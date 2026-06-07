import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, TrendingDown, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

const HERO_IMG = "https://media.base44.com/images/public/6a24463f14619589c55bfcf7/382516a41_generated_cb765201.png";

export default function HeroSection() {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (url.trim()) {
      navigate(`/tracker?url=${encodeURIComponent(url)}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#1e40af] min-h-[90vh] flex items-center">
      {/* Decorative orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
              <Zap className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-medium text-white/80">
                Nepal's First Smart Price Intelligence Platform
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Never Overpay
              <br />
              <span className="text-accent">Online Again</span>
            </h1>

            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
              Track prices, spot genuine deals, and verify seller trustworthiness across Nepal's e-commerce platforms. Make every purchase count.
            </p>

            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste a product URL to start tracking..."
                  className="pl-11 h-12 bg-white/95 border-0 text-foreground placeholder:text-muted-foreground rounded-xl text-sm"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 px-6 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-semibold"
              >
                Track Price
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-accent" />
                </div>
                <span className="text-xs text-white/60">Price History</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-xs text-white/60">Trust Scores</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-xs text-white/60">Instant Alerts</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent rounded-2xl z-10" />
              <img
                src={HERO_IMG}
                alt="Dealert Dashboard"
                className="w-full rounded-2xl shadow-2xl animate-float"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}