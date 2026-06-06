"use client";

import { Typography } from "@/components/custom/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Check,
  Crown,
  Shield,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createPaywallCheckoutAction } from "./paywall.action";

const features = [
  "Complete birth chart analysis",
  "Love & relationship insights",
  "Career & money forecast",
  "2025 monthly predictions",
  "Personality deep dive",
  "Palm reading analysis",
  "Unlimited access to your report",
  "Future updates included",
];

type Plan = "monthly" | "yearly";

export const PaywallStep3 = () => {
  const checkoutMutation = useMutation({
    mutationFn: async (plan: Plan) => {
      return resolveActionResult(createPaywallCheckoutAction({ plan }));
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  const handleCheckout = (plan: Plan) => {
    checkoutMutation.mutate(plan);
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <div className="bg-primary/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
          <Crown className="text-primary size-8" />
        </div>
        <Typography variant="h1" className="text-3xl font-bold sm:text-4xl">
          Unlock Your Complete Reading
        </Typography>
        <Typography variant="muted" className="mx-auto mt-4 max-w-lg text-base">
          Get instant access to your personalized astrology and palm reading
          report.
        </Typography>
      </motion.div>

      {/* Pricing Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {/* Monthly Plan */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="relative h-full border-0 bg-white/5 backdrop-blur-sm">
            <CardContent className="flex h-full flex-col p-6">
              <div className="mb-4">
                <Typography className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
                  Monthly
                </Typography>
                <div className="mt-2 flex items-baseline gap-1">
                  <Typography className="text-4xl font-bold">$29.99</Typography>
                  <Typography variant="muted" className="text-sm">
                    /month
                  </Typography>
                </div>
              </div>

              <div className="mb-6 flex-1">
                <div className="space-y-2">
                  {features.slice(0, 4).map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="text-primary size-4 shrink-0" />
                      <Typography variant="muted" className="text-sm">
                        {feature}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => handleCheckout("monthly")}
                disabled={checkoutMutation.isPending}
              >
                {checkoutMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      className="bg-foreground size-2 rounded-full"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    Processing...
                  </span>
                ) : (
                  "Choose Monthly"
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Yearly Plan - Best Value */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-primary relative h-full border-2 bg-white/5 backdrop-blur-sm">
            {/* Best Value Badge */}
            <div className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold">
              BEST VALUE
            </div>

            <CardContent className="flex h-full flex-col p-6 pt-8">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <Typography className="text-primary text-sm font-medium tracking-wide uppercase">
                    Yearly
                  </Typography>
                  <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-semibold text-green-400">
                    Save 83%
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <Typography className="text-4xl font-bold">$59.99</Typography>
                  <Typography variant="muted" className="text-sm">
                    /year
                  </Typography>
                </div>
                <Typography variant="muted" className="mt-1 text-xs">
                  Just $5/month
                </Typography>
              </div>

              <div className="mb-6 flex-1">
                <div className="space-y-2">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="text-primary size-4 shrink-0" />
                      <Typography variant="muted" className="text-sm">
                        {feature}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={() => handleCheckout("yearly")}
                disabled={checkoutMutation.isPending}
              >
                {checkoutMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      className="bg-primary-foreground size-2 rounded-full"
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    Processing...
                  </span>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Get Yearly Access
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="text-primary size-5" />
            <Typography variant="muted" className="text-xs">
              Secure Payment
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="text-primary size-5" />
            <Typography variant="muted" className="text-xs">
              Instant Access
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <Star className="text-primary size-5" />
            <Typography variant="muted" className="text-xs">
              7-Day Guarantee
            </Typography>
          </div>
        </div>
      </motion.div>

      {/* Social Proof */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8"
      >
        <Card className="border-0 bg-white/5 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="mb-2 flex justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <Typography variant="muted" className="text-sm">
              <span className="font-semibold">50,000+</span> readings delivered
            </Typography>
            <Typography variant="muted" className="mt-1 text-xs">
              Rated 4.9/5 by our users
            </Typography>
          </CardContent>
        </Card>
      </motion.div>

      {/* Back Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center"
      >
        <Link href="/start/paywall/how-it-works">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};
