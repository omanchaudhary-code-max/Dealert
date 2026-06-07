import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff, TrendingDown, Trash2, ArrowDown, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const initialAlerts = [
  {
    id: 1,
    product: "Samsung Galaxy A15 (6/128GB)",
    platform: "Daraz",
    currentPrice: 11999,
    targetPrice: 10000,
    image: "📱",
    active: true,
    triggered: false,
  },
  {
    id: 2,
    product: "Nike Air Max 270 Running Shoes",
    platform: "Daraz",
    currentPrice: 8499,
    targetPrice: 7000,
    image: "👟",
    active: true,
    triggered: false,
  },
  {
    id: 3,
    product: "Sony WH-1000XM5 Headphones",
    platform: "HamroBazar",
    currentPrice: 39999,
    targetPrice: 42999,
    image: "🎧",
    active: false,
    triggered: true,
  },
  {
    id: 4,
    product: "The North Face Jacket",
    platform: "Daraz",
    currentPrice: 5999,
    targetPrice: 6000,
    image: "🧥",
    active: true,
    triggered: true,
  },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState(initialAlerts);

  const toggleAlert = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const activeCount = alerts.filter((a) => a.active).length;
  const triggeredCount = alerts.filter((a) => a.triggered).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary to-primary/95 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            My Alerts
          </h1>
          <p className="text-white/70">
            Manage your price drop notifications
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="border-border/50">
            <CardContent className="pt-6 text-center">
              <Bell className="w-5 h-5 text-accent mx-auto mb-2" />
              <p className="font-display text-2xl font-bold text-foreground">{alerts.length}</p>
              <p className="text-xs text-muted-foreground">Total Alerts</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6 text-center">
              <TrendingDown className="w-5 h-5 text-green-500 mx-auto mb-2" />
              <p className="font-display text-2xl font-bold text-green-600">{triggeredCount}</p>
              <p className="text-xs text-muted-foreground">Price Dropped!</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6 text-center">
              <Bell className="w-5 h-5 text-blue-500 mx-auto mb-2" />
              <p className="font-display text-2xl font-bold text-blue-600">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          <AnimatePresence>
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <Card className={`border-border/50 transition-all ${
                  alert.triggered
                    ? "border-green-500/30 bg-green-500/5"
                    : !alert.active
                    ? "opacity-60"
                    : ""
                }`}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{alert.image}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm text-foreground truncate">
                            {alert.product}
                          </h3>
                          {alert.triggered && (
                            <Badge className="bg-green-500 text-white border-0 text-xs shrink-0">
                              <ArrowDown className="w-3 h-3 mr-0.5" />
                              Price Dropped!
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Badge variant="secondary" className="text-xs">
                            {alert.platform}
                          </Badge>
                          <span className="text-muted-foreground">
                            Current: <span className="font-semibold text-foreground">Rs. {alert.currentPrice.toLocaleString()}</span>
                          </span>
                          <span className="text-muted-foreground">
                            Target: <span className="font-semibold text-accent">Rs. {alert.targetPrice.toLocaleString()}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Switch
                          checked={alert.active}
                          onCheckedChange={() => toggleAlert(alert.id)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAlert(alert.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {alerts.length === 0 && (
          <div className="text-center py-20">
            <BellOff className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
              No alerts yet
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Start tracking products to set up price drop alerts
            </p>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Track a Product
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}