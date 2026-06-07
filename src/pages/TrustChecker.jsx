import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Search, CheckCircle, XCircle, AlertTriangle, Globe, Lock, Clock, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const sampleResult = {
  url: "www.daraz.com.np",
  overallScore: 92,
  status: "Trusted",
  factors: [
    { name: "HTTPS Security", score: 100, status: "pass", icon: Lock, detail: "Valid SSL certificate detected" },
    { name: "Domain Age", score: 95, status: "pass", icon: Clock, detail: "Domain registered 8+ years ago" },
    { name: "Pricing Patterns", score: 85, status: "warning", icon: BarChart3, detail: "Minor pricing fluctuations detected" },
    { name: "Online Presence", score: 90, status: "pass", icon: Globe, detail: "Strong social media and web presence" },
  ],
};

const recentChecks = [
  { url: "daraz.com.np", score: 92, status: "Trusted" },
  { url: "hamrobazar.com", score: 88, status: "Trusted" },
  { url: "facebook.com/shop123", score: 45, status: "Suspicious" },
  { url: "nepalbuyonline.xyz", score: 23, status: "Risky" },
];

export default function TrustChecker() {
  const [sellerUrl, setSellerUrl] = useState("");
  const [showResult, setShowResult] = useState(true);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  const getStatusBadge = (status) => {
    const config = {
      Trusted: "bg-green-500/10 text-green-600 border-green-500/20",
      Suspicious: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      Risky: "bg-red-500/10 text-red-600 border-red-500/20",
    };
    return config[status] || config.Trusted;
  };

  const getProgressColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary to-primary/95 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Trust Checker
          </h1>
          <p className="text-white/70 mb-8">
            Verify seller and website credibility before you buy
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={sellerUrl}
                onChange={(e) => setSellerUrl(e.target.value)}
                placeholder="Enter seller URL or website address..."
                className="pl-11 h-12 bg-white border-0 rounded-xl"
              />
            </div>
            <Button
              onClick={() => setShowResult(true)}
              className="h-12 px-6 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl font-semibold"
            >
              <Search className="w-4 h-4 mr-2" />
              Check Trust
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Result */}
          <div className="lg:col-span-2">
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="border-border/50 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 p-8 text-center border-b border-border/50">
                    <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto mb-4">
                      <span className={`font-display text-3xl font-bold ${getScoreColor(sampleResult.overallScore)}`}>
                        {sampleResult.overallScore}
                      </span>
                    </div>
                    <h2 className="font-heading text-xl font-semibold text-foreground">
                      {sampleResult.url}
                    </h2>
                    <Badge className={`mt-2 ${getStatusBadge(sampleResult.status)} border`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {sampleResult.status}
                    </Badge>
                  </div>
                  <CardContent className="p-6 space-y-5">
                    <h3 className="font-heading font-semibold text-foreground">
                      Trust Factors Analysis
                    </h3>
                    {sampleResult.factors.map((factor) => (
                      <div key={factor.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <factor.icon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">
                              {factor.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${getScoreColor(factor.score)}`}>
                              {factor.score}/100
                            </span>
                            {factor.status === "pass" ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : factor.status === "warning" ? (
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(factor.score)}`}
                            style={{ width: `${factor.score}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{factor.detail}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Recent Checks */}
          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4">
              Recent Checks
            </h2>
            <div className="space-y-3">
              {recentChecks.map((check, i) => (
                <motion.div
                  key={check.url}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="border-border/50 hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          check.score >= 80 ? "bg-green-500/10" : check.score >= 50 ? "bg-amber-500/10" : "bg-red-500/10"
                        }`}>
                          <Shield className={`w-5 h-5 ${getScoreColor(check.score)}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{check.url}</p>
                          <Badge className={`text-xs mt-1 ${getStatusBadge(check.status)} border`}>
                            {check.status}
                          </Badge>
                        </div>
                      </div>
                      <span className={`font-display text-lg font-bold ${getScoreColor(check.score)}`}>
                        {check.score}
                      </span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}