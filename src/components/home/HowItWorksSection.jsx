import React from "react";
import { motion } from "framer-motion";
import { Link2, BarChart3, Bell, ShieldCheck } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Link2,
    title: "Paste Product URL",
    description: "Simply paste any product link from Daraz or other Nepali e-commerce platforms.",
  },
  {
    step: "02",
    icon: BarChart3,
    title: "View Price History",
    description: "Instantly see historical price data, trends, and identify whether the current price is a good deal.",
  },
  {
    step: "03",
    icon: Bell,
    title: "Set Your Alert",
    description: "Define your target price and we'll notify you the moment it drops to your desired level.",
  },
  {
    step: "04",
    icon: ShieldCheck,
    title: "Verify & Buy Safely",
    description: "Check the seller's trust score before purchasing. Shop with confidence, every time.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-3 block">
            How It Works
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Four Simple Steps to
            <br />
            <span className="text-accent">Smarter Shopping</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-accent/40 to-transparent" />
              )}
              <div className="relative inline-block mb-5">
                <div className="w-20 h-20 rounded-2xl bg-card border border-border/50 shadow-sm flex items-center justify-center mx-auto">
                  <step.icon className="w-8 h-8 text-accent" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <span className="text-xs font-bold">{step.step}</span>
                </div>
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}