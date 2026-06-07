import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#1e40af] p-10 sm:p-16 text-center overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-medium text-white/80">
                Start saving today
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Shop Smarter?
            </h2>
            <p className="text-white/70 mb-8 max-w-lg mx-auto">
              Join thousands of Nepali shoppers who use Dealert to find genuine deals and avoid scams. It's free to get started.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/tracker">
                <Button
                  size="lg"
                  className="bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-semibold px-8"
                >
                  Start Tracking Prices
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/trust">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl font-semibold px-8 border-white/20 text-white hover:bg-white/10"
                >
                  Verify a Seller
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}