import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell, TrendingDown, Shield, Zap, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_URL = "https://media.base44.com/images/public/6a24463f14619589c55bfcf7/a5d07fe59_Untitled_design-removebg-preview.png";

const navLinks = [
{ path: "/", label: "Home", icon: Zap },
{ path: "/tracker", label: "Price Tracker", icon: TrendingDown },
{ path: "/trust", label: "Trust Checker", icon: Shield },
{ path: "/deals", label: "Deals", icon: Bell },
{ path: "/alerts", label: "My Alerts", icon: Bell }];


export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src="https://media.base44.com/images/public/6a24463f14619589c55bfcf7/1b82d2500_Untitled_design-removebg-preview.png" alt="Dealert" className="h-10 w-auto my-8 rounded-3xl px-10" />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`font-medium text-sm ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    
                    <link.icon className="w-4 h-4 mr-1.5" />
                    {link.label}
                  </Button>
                </Link>);

            })}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}>
            
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen &&
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-b border-border overflow-hidden">
          
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}>
                  
                    <div
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive ?
                    "bg-primary text-primary-foreground" :
                    "text-muted-foreground hover:bg-muted"}`
                    }>
                    
                      <link.icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{link.label}</span>
                    </div>
                  </Link>);

            })}
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </nav>);

}