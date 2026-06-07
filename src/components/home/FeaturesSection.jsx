import React from "react";
import { motion } from "framer-motion";
import { TrendingDown, Shield, Bell, BarChart3, Search, Lock } from "lucide-react";

const features = [
  {
    icon: TrendingDown,
    title: "Price History Tracking",
    description: "Monitor product prices over time with detailed historical charts. Never miss a genuine deal again.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Shield,
    title: "Seller Trust Verification",
    description: "Evaluate seller credibility through domain age, HTTPS validation, pricing anomalies, and more.",
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: Bell,
    title: "Smart Price Alerts",
    description: "Set your target price and get notified instantly when prices drop to your desired level.",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: BarChart3,
    title: "Deal Analysis",
    description: "AI-powered analysis identifies genuine discounts vs artificially inflated prices.",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: Search,
    title: "Multi-Platform Search",
    description: "Track prices across Daraz, social media marketplaces, and other Nepali e-commerce platforms.",
    color: "bg-pink-500/10 text-pink-600",
  },
  {
    icon: Lock,
    title: "Scam Protection",
    description: "Advanced fraud detection algorithms protect you from suspicious sellers and fake deals.",
    color: "bg-amber-500/10 text-amber-600",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-3 block">
            Features
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything You Need to
            <br />
            <span className="text-accent">Shop Smarter</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dealert combines price intelligence with trust verification to give you the complete picture before every purchase.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-accent/30 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}