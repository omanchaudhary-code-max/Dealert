import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flame, TrendingDown, ArrowDown, Search, Filter, ExternalLink, Clock } from "lucide-react";
import { motion } from "framer-motion";

const deals = [
  {
    id: 1,
    name: "Samsung Galaxy A15 (6/128GB)",
    platform: "Daraz",
    currentPrice: 11999,
    originalPrice: 15999,
    discount: 25,
    category: "Electronics",
    image: "📱",
    isHot: true,
    timeLeft: "2h 15m",
  },
  {
    id: 2,
    name: "Nike Air Max 270 Running Shoes",
    platform: "Daraz",
    currentPrice: 8499,
    originalPrice: 12999,
    discount: 35,
    category: "Fashion",
    image: "👟",
    isHot: true,
    timeLeft: "5h 30m",
  },
  {
    id: 3,
    name: "Sony WH-1000XM5 Headphones",
    platform: "HamroBazar",
    currentPrice: 42999,
    originalPrice: 45999,
    discount: 7,
    category: "Electronics",
    image: "🎧",
    isHot: false,
    timeLeft: null,
  },
  {
    id: 4,
    name: "The North Face Jacket",
    platform: "Daraz",
    currentPrice: 5999,
    originalPrice: 9999,
    discount: 40,
    category: "Fashion",
    image: "🧥",
    isHot: true,
    timeLeft: "1h 45m",
  },
  {
    id: 5,
    name: "Logitech MX Master 3S Mouse",
    platform: "Daraz",
    currentPrice: 9499,
    originalPrice: 11999,
    discount: 21,
    category: "Electronics",
    image: "🖱️",
    isHot: false,
    timeLeft: null,
  },
  {
    id: 6,
    name: "Prestige Pressure Cooker 5L",
    platform: "HamroBazar",
    currentPrice: 3499,
    originalPrice: 4999,
    discount: 30,
    category: "Home",
    image: "🍳",
    isHot: false,
    timeLeft: "12h",
  },
];

export default function Deals() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = deals.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || d.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary to-primary/95 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 mb-4">
            <Flame className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-accent">Live Deals</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Today's Best Deals
          </h1>
          <p className="text-white/70">
            Verified genuine price drops across Nepal's e-commerce platforms
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search deals..."
              className="pl-11 h-11 rounded-xl"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-44 h-11 rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Fashion">Fashion</SelectItem>
              <SelectItem value="Home">Home</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Deals Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((deal, i) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-border/50 hover:shadow-lg hover:border-accent/30 transition-all group overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative bg-muted/50 p-8 text-center">
                    <div className="text-6xl mb-2">{deal.image}</div>
                    {deal.isHot && (
                      <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0">
                        <Flame className="w-3 h-3 mr-1" />
                        Hot Deal
                      </Badge>
                    )}
                    <Badge className="absolute top-3 right-3 bg-green-500 text-white border-0">
                      <ArrowDown className="w-3 h-3 mr-0.5" />
                      {deal.discount}% OFF
                    </Badge>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {deal.platform}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {deal.category}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-sm text-foreground mb-3 line-clamp-2">
                      {deal.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="font-display text-xl font-bold text-foreground">
                        Rs. {deal.currentPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        Rs. {deal.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    {deal.timeLeft && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-600 mb-3">
                        <Clock className="w-3 h-3" />
                        Ends in {deal.timeLeft}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg text-xs">
                        <TrendingDown className="w-3.5 h-3.5 mr-1" />
                        Track Price
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-lg">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}