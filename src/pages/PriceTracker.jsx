import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingDown, TrendingUp, ArrowDown, Bell, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const samplePriceData = [
  { date: "Jan", price: 15999 },
  { date: "Feb", price: 14999 },
  { date: "Mar", price: 16499 },
  { date: "Apr", price: 13999 },
  { date: "May", price: 12499 },
  { date: "Jun", price: 11999 },
];

const sampleProducts = [
  {
    id: 1,
    name: "Samsung Galaxy A15 (6/128GB)",
    platform: "Daraz",
    currentPrice: 11999,
    originalPrice: 15999,
    lowestPrice: 10499,
    change: -25,
    image: "📱",
    tracked: true,
  },
  {
    id: 2,
    name: "Nike Air Max 270 Running Shoes",
    platform: "Daraz",
    currentPrice: 8499,
    originalPrice: 12999,
    lowestPrice: 7999,
    change: -35,
    image: "👟",
    tracked: false,
  },
  {
    id: 3,
    name: "Sony WH-1000XM5 Headphones",
    platform: "HamroBazar",
    currentPrice: 42999,
    originalPrice: 45999,
    lowestPrice: 39999,
    change: -7,
    image: "🎧",
    tracked: true,
  },
];

export default function PriceTracker() {
  const [searchUrl, setSearchUrl] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(sampleProducts[0]);

  const urlParams = new URLSearchParams(window.location.search);
  const prefilledUrl = urlParams.get("url");

  useEffect(() => {
    if (prefilledUrl) setSearchUrl(prefilledUrl);
  }, [prefilledUrl]);

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-gradient-to-b from-primary to-primary/95 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Price Tracker
          </h1>
          <p className="text-white/70 mb-8">
            Paste a product URL to see its price history and set alerts
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchUrl}
                onChange={(e) => setSearchUrl(e.target.value)}
                placeholder="Paste product URL from Daraz, HamroBazar..."
                className="pl-11 h-12 bg-white border-0 rounded-xl"
              />
            </div>
            <Button className="h-12 px-6 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl font-semibold">
              Track
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Product List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-2">
              Tracked Products
            </h2>
            {sampleProducts.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedProduct(product)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedProduct?.id === product.id
                    ? "border-accent bg-accent/5 shadow-md"
                    : "border-border bg-card hover:border-accent/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{product.image}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-foreground truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {product.platform}
                      </Badge>
                      <span className={`text-xs font-medium flex items-center gap-0.5 ${
                        product.change < 0 ? "text-green-600" : "text-red-500"
                      }`}>
                        {product.change < 0 ? (
                          <ArrowDown className="w-3 h-3" />
                        ) : (
                          <TrendingUp className="w-3 h-3" />
                        )}
                        {Math.abs(product.change)}%
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="font-display text-lg font-bold text-foreground">
                        Rs. {product.currentPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Price Chart & Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedProduct && (
              <>
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="font-heading text-xl">
                          {selectedProduct.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Price history over the last 6 months
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="rounded-lg">
                          <Bell className="w-3.5 h-3.5 mr-1.5" />
                          Set Alert
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-lg">
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                          Visit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={samplePriceData}>
                          <defs>
                            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                          <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" tickFormatter={(v) => `Rs.${(v/1000).toFixed(0)}k`} />
                          <Tooltip
                            contentStyle={{
                              borderRadius: "12px",
                              border: "1px solid hsl(220, 13%, 91%)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            }}
                            formatter={(value) => [`Rs. ${value.toLocaleString()}`, "Price"]}
                          />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke="hsl(25, 95%, 53%)"
                            strokeWidth={2.5}
                            fill="url(#priceGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-3 gap-4">
                  <Card className="border-border/50">
                    <CardContent className="pt-6 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Current Price</p>
                      <p className="font-display text-xl font-bold text-foreground">
                        Rs. {selectedProduct.currentPrice.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="pt-6 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Lowest Ever</p>
                      <p className="font-display text-xl font-bold text-green-600">
                        Rs. {selectedProduct.lowestPrice.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="pt-6 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Original Price</p>
                      <p className="font-display text-xl font-bold text-muted-foreground">
                        Rs. {selectedProduct.originalPrice.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}