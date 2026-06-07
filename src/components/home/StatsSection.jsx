import React from "react";
import { motion } from "framer-motion";
import { TrendingDown, Users, ShoppingBag, Shield } from "lucide-react";

const stats = [
  { icon: ShoppingBag, value: "10,000+", label: "Products Tracked", color: "text-accent" },
  { icon: Users, value: "5,000+", label: "Active Users", color: "text-blue-500" },
  { icon: TrendingDown, value: "Rs. 2.5M+", label: "Saved by Users", color: "text-green-500" },
  { icon: Shield, value: "1,200+", label: "Sellers Verified", color: "text-purple-500" },
];

export default function StatsSection() {
  return (
    <section className="relative -mt-12 z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-2xl p-6 text-center hover:shadow-xl transition-shadow"
          >
            <stat.icon className={`w-6 h-6 mx-auto mb-3 ${stat.color}`} />
            <div className="font-display text-2xl font-bold text-foreground mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}