import logging
import os
import random
import re
import time
from datetime import datetime, timezone
from typing import Optional

import undetected_chromedriver as uc
from selenium.common.exceptions import (
    NoSuchElementException,
    StaleElementReferenceException,
    TimeoutException,
    WebDriverException,
)
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

logger = logging.getLogger(__name__)

DARAZ_BASE = "https://www.daraz.com.np"

# CSS selectors — update here if Daraz changes its HTML structure
SELECTORS = {
    # Listing page: each product card
    "product_cards": "div[data-qa-locator='product-item']",
    # Listing page: product link inside card
    "card_link": "a",
    # Detail page: product title
    "title": "h1.pdp-mod-product-badge-title, span.pdp-name",
    # Detail page: current selling price
    # pdp-price_size_xl added — Daraz NP storefront uses this class
    "current_price": (
        "span.pdp-price_type_normal, "
        "span.notranslate.pdp-price, "
        "span.pdp-price_size_xl"
    ),
    # Detail page: original / struck-through price
    "original_price": "span.pdp-price_type_deleted",
    # Detail page: seller name
    "seller": "a.seller-name__detail-name, span.seller-name__detail",
    # Detail page: product image (primary gallery image)
    "image": "div.gallery-preview-panel__content img, img.pdp-image",
    # Detail page: item ID extracted from URL
    "item_id_pattern": r"-i(\d+)(?:-s\d+)?\.html",
    # Listing page: next page button
    "next_page": "li.ant-pagination-next:not(.ant-pagination-disabled) button",
    # Anti-bot middleware overlay Daraz injects when it detects automation
    "middleware_overlay": ".J_MIDDLEWARE_FRAME_WIDGET",
}

# Retry config
MAX_RETRIES   = 3   # attempts per product before giving up
RETRY_BACKOFF = 5   # extra seconds added per retry attempt

# Some categories don't have a dedicated path-based listing page on Daraz
# (e.g. https://www.daraz.com.np/books/ returns nothing) — they only
# surface through Daraz's internal search/catalog endpoint instead.
# Maps our category label -> the search query that finds it.
SEARCH_BASED_CATEGORIES = {
    "books": "book",
    "kitchen-appliances": "kitchen",
    "cameras": "camera",
}


def build_listing_url(category: str) -> str:
    """
    Build the correct first-page listing URL for a category.
    Most categories are path-based (daraz.com.np/{slug}/). A few only
    exist as a search/catalog query — see SEARCH_BASED_CATEGORIES above.
    """
    if category in SEARCH_BASED_CATEGORIES:
        query = SEARCH_BASED_CATEGORIES[category]
        return f"{DARAZ_BASE}/catalog/?q={query}"
    return f"{DARAZ_BASE}/{category}/"


class DarazCrawler:
    """
    Crawls Daraz Nepal product listing pages and extracts price data.

    Uses undetected-chromedriver to bypass Daraz's bot-detection middleware
    (the J_MIDDLEWARE_FRAME_WIDGET overlay that blocks price extraction).

    TWO MODES controlled by CRAWL_MODE env var:
      discovery  — walk category listing pages, find new products, scrape them.
                   Use this during Phase 1 (now → July 15) to build your basket.
      tracking   — skip listing pages entirely, re-scrape already-known product
                   URLs pulled from MongoDB. Use this during Phase 2 (July 15 →
                   July 30) to build deep price history on the fixed basket.

    Usage:
        crawler = DarazCrawler(delay_min=10, delay_max=20)
        with crawler:
            # Discovery mode
            products = crawler.crawl_category("laptops", max_products=50)
            # Tracking mode
            products = crawler.crawl_known_products(url_list, save_callback=cb)
    """

    def __init__(self, delay_min: int = 10, delay_max: int = 20):
        self.delay_min = delay_min
        self.delay_max = delay_max
        self.driver: Optional[uc.Chrome] = None

    # ──────────────────────────── Driver lifecycle ──────────────────────────────

    def _build_driver(self) -> uc.Chrome:
        """
        Build a Chrome driver that bypasses Daraz's bot detection.

        undetected-chromedriver patches navigator.webdriver, removes CDP
        fingerprint signals, and handles all the masking that the manual
        execute_cdp_cmd approach misses.

        version_main: read from CHROME_VER env var (set by GitHub Actions
        workflow after detecting the installed Chrome version). Falls back
        to 149 for local Windows development. Pass version_main explicitly
        so uc never guesses wrong and downloads a mismatched ChromeDriver.

        CHROME_BINARY: optional path override for CI environments where
        Chrome is installed to a non-standard location.
        """
        opts = uc.ChromeOptions()
        opts.add_argument("--no-sandbox")
        opts.add_argument("--disable-dev-shm-usage")
        opts.add_argument("--disable-gpu")
        opts.add_argument("--window-size=1920,1080")

        # Headless only in CI — non-headless is much harder for Daraz to detect
        if os.getenv("CI") or os.getenv("GITHUB_ACTIONS"):
            opts.add_argument("--headless=new")

        # Allow CI to point uc at a specific Chrome binary
        chrome_binary = os.getenv("CHROME_BINARY")
        if chrome_binary:
            opts.binary_location = chrome_binary

        ua = self._pick_user_agent()
        opts.add_argument(f"--user-agent={ua}")

        # Read Chrome major version from env (set by Actions) or default to 149
        version_main = int(os.getenv("CHROME_VER", "149"))
        driver = uc.Chrome(options=opts, version_main=version_main)
        return driver

    def _pick_user_agent(self) -> str:
        agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.122 Safari/537.36",
        ]
        return random.choice(agents)

    def __enter__(self):
        logger.info("Starting Chrome driver (undetected-chromedriver)...")
        self.driver = self._build_driver()
        return self

    def __exit__(self, *args):
        if self.driver:
            self.driver.quit()
            logger.info("Chrome driver closed.")

    # ──────────────────────────── Delay utilities ───────────────────────────────

    def _polite_wait(self, extra: float = 0.0):
        """Sleep for a randomised duration — polite and ToS-compliant."""
        delay = random.uniform(self.delay_min, self.delay_max) + extra
        logger.debug(f"Waiting {delay:.1f}s...")
        time.sleep(delay)

    def _retry_wait(self, attempt: int):
        """Exponential-ish backoff between retries."""
        delay = RETRY_BACKOFF * attempt + random.uniform(2, 5)
        logger.info(f"  Retry backoff: waiting {delay:.1f}s before attempt {attempt + 1}...")
        time.sleep(delay)

    # ──────────────────────────── Page helpers ──────────────────────────────────

    def _wait_for(self, css: str, timeout: int = 15):
        return WebDriverWait(self.driver, timeout).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, css))
        )

    def _safe_text(self, css: str) -> Optional[str]:
        try:
            el = self.driver.find_element(By.CSS_SELECTOR, css)
            return el.text.strip() or None
        except NoSuchElementException:
            return None

    # ──────────────────────────── Overlay dismissal ─────────────────────────────

    def _dismiss_overlay(self):
        """
        Dismiss Daraz's J_MIDDLEWARE_FRAME_WIDGET anti-bot overlay.

        Strategy (in order):
          1. Wait up to 5s for it to vanish on its own (sometimes it does)
          2. JS removal — rip it from the DOM and unfreeze body scroll
          3. Escape key fallback — catches standard modal patterns

        Called before reading any price element and before any pagination click.
        Safe to call even when no overlay is present.
        """
        # Step 1: give it a moment to self-dismiss
        try:
            WebDriverWait(self.driver, 5).until(
                EC.invisibility_of_element_located(
                    (By.CSS_SELECTOR, SELECTORS["middleware_overlay"])
                )
            )
            return  # Gone — carry on
        except TimeoutException:
            pass

        # Step 2: JS removal
        try:
            self.driver.execute_script("""
                var overlay = document.querySelector('.J_MIDDLEWARE_FRAME_WIDGET');
                if (overlay) {
                    overlay.parentNode.removeChild(overlay);
                }
                // Daraz sets overflow:hidden on body when the overlay appears —
                // restore it so the page is scrollable again.
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            """)
            time.sleep(0.5)
            logger.debug("Middleware overlay removed via JS.")
        except WebDriverException as e:
            logger.debug(f"JS overlay removal failed: {e}")

        # Step 3: Escape key
        try:
            self.driver.find_element(By.TAG_NAME, "body").send_keys(Keys.ESCAPE)
            time.sleep(0.5)
        except WebDriverException:
            pass

    # ──────────────────────────── Price parsing ─────────────────────────────────

    def _parse_price(self, raw: Optional[str]) -> Optional[float]:
        if not raw:
            return None
        # Remove currency symbols and spaces, THEN extract digits
        # Strips "Rs.", "NPR", "रू" etc.
        cleaned = re.sub(r"[^\d,]", "", raw).strip()
        if not cleaned:
            return None
        # Remove all commas (Nepali thousands separator: 1,23,456)
        cleaned = cleaned.replace(",", "")
        if not cleaned:
            return None
        try:
            value = float(cleaned)
            if value < 1 or value > 10_000_000:
                logger.warning(f"Price out of expected range: {value} (raw: {raw!r})")
                return None
            return value
        except ValueError:
            logger.warning(f"Could not parse price: {raw!r}")
            return None

    # ──────────────────────────── Product detail ────────────────────────────────

    def _scrape_product_detail(self, url: str) -> Optional[dict]:
        """
        Visit a single Daraz product page and extract price fields.

        Flow:
          1. Navigate to URL
          2. Wait for title element (confirms page loaded)
          3. Dismiss overlay BEFORE trying to read any price element
          4. Extract all fields
          5. Return dict or None on failure
        """
        try:
            self.driver.get(url)
            self._wait_for(SELECTORS["title"], timeout=20)

            # Dismiss overlay before touching any price element
            self._dismiss_overlay()
            self._polite_wait(extra=1.0)

            match = re.search(SELECTORS["item_id_pattern"], url)
            item_id = match.group(1) if match else None

            title        = self._safe_text(SELECTORS["title"])
            raw_current  = self._safe_text(SELECTORS["current_price"])
            raw_original = self._safe_text(SELECTORS["original_price"])
            seller       = self._safe_text(SELECTORS["seller"])

            current_price  = self._parse_price(raw_current)
            original_price = self._parse_price(raw_original)

            # Debug log — remove once selectors are confirmed stable
            if not current_price:
                logger.debug(
                    f"Price debug — raw_current={raw_current!r}, "
                    f"raw_original={raw_original!r}, url={url}"
                )

            is_promotional = original_price is not None and (
                original_price > (current_price or 0)
            )

            # ── Image extraction ─────────────────────────────────────────────
            image_url = None
            try:
                img_el = self.driver.find_element(By.CSS_SELECTOR, SELECTORS["image"])
                image_url = (
                    img_el.get_attribute("src") or
                    img_el.get_attribute("data-src") or
                    None
                )
                if image_url and (
                    image_url.startswith("data:") or image_url.strip() == ""
                ):
                    image_url = None
            except NoSuchElementException:
                logger.debug(f"No image element found at {url}")

            if not current_price:
                logger.warning(f"No price found at {url}")
                return None

            return {
                "item_id":        item_id,
                "title":          title,
                "url":            url,
                "current_price":  current_price,
                "original_price": original_price,
                "is_promotional": is_promotional,
                "seller_name":    seller,
                "image_url":      image_url,
                "image_verified": image_url is not None,
                "scraped_at":     datetime.now(timezone.utc),
            }

        except TimeoutException:
            logger.warning(f"Timeout loading product page: {url}")
            return None
        except WebDriverException as e:
            logger.error(f"WebDriver error on {url}: {e}")
            return None

    def _scrape_with_retry(self, url: str) -> Optional[dict]:
        """
        Attempt to scrape a product page up to MAX_RETRIES times.
        Waits with backoff between attempts.
        """
        for attempt in range(1, MAX_RETRIES + 1):
            result = self._scrape_product_detail(url)
            if result is not None:
                if attempt > 1:
                    logger.info(f"  ✓ Succeeded on attempt {attempt}: {url}")
                return result

            if attempt < MAX_RETRIES:
                logger.warning(
                    f"  Attempt {attempt}/{MAX_RETRIES} failed for {url} — retrying..."
                )
                self._retry_wait(attempt)
            else:
                logger.error(
                    f"  ✗ All {MAX_RETRIES} attempts failed for {url} — skipping."
                )

        return None

    # ──────────────────────────── Category listing (discovery) ──────────────────

    def _extract_links_from_current_page(self, links: list[str], max_products: int) -> None:
        """Read product cards currently in the DOM and append new links in-place."""
        cards = self.driver.find_elements(By.CSS_SELECTOR, SELECTORS["product_cards"])
        for card in cards:
            if len(links) >= max_products:
                break
            try:
                anchor = card.find_element(By.CSS_SELECTOR, SELECTORS["card_link"])
                href = anchor.get_attribute("href")
                if href and "daraz.com.np/products/" in href:
                    clean = href.split("?")[0].split("#")[0]
                    if clean not in links:
                        links.append(clean)
            except NoSuchElementException:
                continue

    def _collect_product_links(self, category: str, max_products: int) -> list[str]:
        """
        Walk Daraz category listing pages and collect product detail URLs.
        Stops when max_products links are collected or no more pages exist.

        IMPORTANT: Daraz's listing page is a client-rendered SPA — pagination
        state lives in JavaScript, not the URL. Re-navigating to ?page=N
        with driver.get() just reloads page 1's content again, which silently
        caps every category at one page worth of products. We instead click
        the actual "Next" pagination button and wait for the old cards to go
        stale before reading the new ones.

        The overlay is dismissed before every pagination click because the
        middleware widget intercepts click events, causing
        "Element click intercepted" WebDriverException.
        """
        links = []
        page = 1
        listing_url = build_listing_url(category)

        try:
            self.driver.get(listing_url)
            self._wait_for(SELECTORS["product_cards"], timeout=20)
            self._dismiss_overlay()
            self._polite_wait()
        except TimeoutException:
            logger.warning(f"Timeout on listing page 1 for /{category}/, stopping category.")
            return links
        except WebDriverException as e:
            logger.error(f"WebDriver error loading {listing_url}: {e}")
            return links

        while len(links) < max_products:
            logger.info(f"Listing page {page} for /{category}/ — {len(links)} links so far")

            cards_before = self.driver.find_elements(By.CSS_SELECTOR, SELECTORS["product_cards"])
            if not cards_before:
                logger.info(f"No products on page {page}, stopping.")
                break

            self._extract_links_from_current_page(links, max_products)

            if len(links) >= max_products:
                break

            try:
                next_btn = self.driver.find_element(By.CSS_SELECTOR, SELECTORS["next_page"])
            except NoSuchElementException:
                logger.info("Last page reached.")
                break

            try:
                self.driver.execute_script(
                    "arguments[0].scrollIntoView({block: 'center'});", next_btn
                )
                self._polite_wait(extra=0.5)
                # Dismiss overlay BEFORE clicking next — prevents
                # "Element click intercepted" from the middleware widget
                self._dismiss_overlay()
                next_btn.click()
            except WebDriverException as e:
                logger.warning(f"Click on next-page button failed: {e}")
                break

            page += 1

            try:
                first_card_before = cards_before[0]
                WebDriverWait(self.driver, 15).until(EC.staleness_of(first_card_before))
                self._wait_for(SELECTORS["product_cards"], timeout=20)
            except (TimeoutException, StaleElementReferenceException):
                logger.warning(
                    f"Timeout waiting for page {page} content to load on /{category}/, stopping."
                )
                break
            except WebDriverException as e:
                logger.error(f"WebDriver error advancing to page {page}: {e}")
                break

            self._polite_wait()

        logger.info(f"Collected {len(links)} links from /{category}/")
        return links

    # ──────────────────────────── Public API ────────────────────────────────────

    def crawl_category(
        self,
        category: str,
        max_products: int = 50,
        save_callback=None,
    ) -> list[dict]:
        """
        DISCOVERY MODE — full crawl of one Daraz category.

        Walks listing pages to find new product URLs, then scrapes each one.
        Use during Phase 1 (now → July 15) to populate your product basket.

        Args:
            category:      Daraz category slug (e.g. 'laptops')
            max_products:  Maximum products to scrape
            save_callback: Optional callable(product_dict) — called immediately
                           after each successful scrape so data is persisted
                           even if the crawl crashes partway through.

        Returns a list of all successfully scraped product dicts.
        """
        logger.info(f"=== [DISCOVERY] Crawling category: {category} (max {max_products}) ===")
        links = self._collect_product_links(category, max_products)

        results      = []
        saved_count  = 0
        failed_count = 0

        for i, link in enumerate(links, 1):
            logger.info(f"  [{i}/{len(links)}] {link}")

            data = self._scrape_with_retry(link)

            if data:
                data["category"] = category
                results.append(data)

                if save_callback:
                    try:
                        save_callback(data)
                        saved_count += 1
                    except Exception as e:
                        logger.error(f"  Save callback failed for {link}: {e}")
            else:
                failed_count += 1

            self._polite_wait()

        logger.info(
            f"=== Category {category} done: "
            f"{len(results)} scraped, {saved_count} saved immediately, "
            f"{failed_count} failed after {MAX_RETRIES} retries ==="
        )
        return results

    def crawl_known_products(
        self,
        products: list[dict],
        save_callback=None,
    ) -> list[dict]:
        """
        TRACKING MODE — re-scrape a pre-known list of products from MongoDB.

        Skips listing page navigation entirely. Goes straight to each product
        URL and records a fresh price snapshot. Use during Phase 2 (July 15 →
        July 30) to build deep price history on the fixed basket.

        Args:
            products:      List of dicts with at least 'url' and 'category' keys.
                           Pulled from MongoDB via storage.get_all_tracked_urls().
            save_callback: Optional callable(product_dict) — same as crawl_category.

        Returns a list of all successfully scraped product dicts.
        """
        logger.info(f"=== [TRACKING] Re-scraping {len(products)} known products ===")

        results      = []
        saved_count  = 0
        failed_count = 0

        for i, product in enumerate(products, 1):
            url      = product.get("url")
            category = product.get("category", "unknown")

            if not url:
                logger.warning(f"  [{i}] Skipping product with no URL: {product}")
                failed_count += 1
                continue

            logger.info(f"  [{i}/{len(products)}] {url}")

            data = self._scrape_with_retry(url)

            if data:
                data["category"] = category
                results.append(data)

                if save_callback:
                    try:
                        save_callback(data)
                        saved_count += 1
                    except Exception as e:
                        logger.error(f"  Save callback failed for {url}: {e}")
            else:
                failed_count += 1

            self._polite_wait()

        logger.info(
            f"=== Tracking run done: "
            f"{len(results)} scraped, {saved_count} saved immediately, "
            f"{failed_count} failed after {MAX_RETRIES} retries ==="
        )
        return results