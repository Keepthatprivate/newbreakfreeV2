"use client";

import { Typography } from "@/components/custom/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  Clock,
  FileText,
  Hand,
  Heart,
  Infinity as InfinityIcon,
  Lock,
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

const readingChapters = [
  {
    icon: Sun,
    title: "Your Cosmic Identity",
    pages: "8 pages",
    items: [
      "Sun, Moon & Rising decoded",
      "Your hidden personality traits",
      "What drives you at your core",
    ],
  },
  {
    icon: Heart,
    title: "Love & Relationships",
    pages: "6 pages",
    items: [
      "Your ideal partner profile",
      "Why past relationships failed",
      "Your love language in the stars",
    ],
  },
  {
    icon: TrendingUp,
    title: "Career & Wealth",
    pages: "5 pages",
    items: [
      "Your natural talents",
      "Best career paths for you",
      "Money mindset & opportunities",
    ],
  },
  {
    icon: Calendar,
    title: "2025 Predictions",
    pages: "6 pages",
    items: [
      "Month-by-month guidance",
      "Key dates to watch",
      "Opportunities & challenges ahead",
    ],
  },
  {
    icon: Hand,
    title: "Palm Reading",
    pages: "4 pages",
    items: [
      "Life, heart & fate lines",
      "Your hand shape meaning",
      "Hidden signs revealed",
    ],
  },
];

const processSteps = [
  {
    step: 1,
    title: "Your data is analyzed",
    description:
      "Birth date, time, location, and palm scan processed through our cosmic engine",
    icon: Zap,
  },
  {
    step: 2,
    title: "AI meets 5,000 years of wisdom",
    description:
      "Advanced algorithms trained on centuries of astrological knowledge",
    icon: InfinityIcon,
  },
  {
    step: 3,
    title: "Your report is generated",
    description: "A unique 25+ page reading crafted specifically for you",
    icon: FileText,
  },
];

const guarantees = [
  { icon: Lock, text: "100% private & secure" },
  { icon: Clock, text: "Instant delivery" },
  { icon: Star, text: "7-day money-back guarantee" },
];

export const PaywallStep2 = () => {
  return (
    <div className="relative mx-auto w-full max-w-2xl px-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
          className="mx-auto mb-6"
        >
          <div className="bg-primary/20 mx-auto flex size-20 items-center justify-center rounded-full">
            <BookOpen className="text-primary size-10" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Typography
            variant="h1"
            className="text-3xl leading-tight font-bold sm:text-4xl md:text-5xl"
          >
            25+ pages of
            <br />
            <span className="text-primary">life-changing insights</span>
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Typography
            variant="muted"
            className="mx-auto mt-6 max-w-md text-base leading-relaxed sm:text-lg"
          >
            Not a generic horoscope. A deeply personal analysis of your cosmic
            blueprint, written specifically for you.
          </Typography>
        </motion.div>
      </motion.div>

      {/* What's Inside - Chapters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-6 flex items-center justify-center gap-3"
        >
          <div className="bg-border h-px flex-1" />
          <Typography className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
            What&apos;s inside your reading
          </Typography>
          <div className="bg-border h-px flex-1" />
        </motion.div>

        <div className="space-y-3">
          {readingChapters.map((chapter, index) => (
            <motion.div
              key={chapter.title}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.8 + index * 0.1,
                ease: "easeOut",
              }}
            >
              <Card className="group border-0 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className="shrink-0"
                    >
                      <div className="bg-primary/15 flex size-12 items-center justify-center rounded-xl">
                        <chapter.icon className="text-primary size-6" />
                      </div>
                    </motion.div>

                    <div className="flex-1">
                      <div className="mb-2 flex items-center justify-between">
                        <Typography className="font-semibold">
                          {chapter.title}
                        </Typography>
                        <span className="text-primary bg-primary/10 rounded-full px-2 py-0.5 text-xs font-medium">
                          {chapter.pages}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {chapter.items.map((item) => (
                          <div key={item} className="flex items-center gap-1.5">
                            <Check className="text-primary size-3" />
                            <Typography variant="muted" className="text-xs">
                              {item}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Total pages indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.3 }}
          className="mt-4 text-center"
        >
          <Typography variant="muted" className="text-sm">
            <span className="text-primary font-semibold">25+ pages</span> of
            personalized insights • Delivered instantly as PDF
          </Typography>
        </motion.div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
        className="mb-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="mb-6 flex items-center justify-center gap-3"
        >
          <div className="bg-border h-px flex-1" />
          <Typography className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
            How it works
          </Typography>
          <div className="bg-border h-px flex-1" />
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="from-primary/50 via-primary to-primary/50 absolute top-6 left-6 h-[calc(100%-48px)] w-0.5 bg-gradient-to-b" />

          <div className="space-y-4">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 1.6 + index * 0.15,
                  ease: "easeOut",
                }}
                className="relative flex items-start gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 1.7 + index * 0.15,
                    type: "spring",
                  }}
                  className="relative z-10 shrink-0"
                >
                  <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-full text-lg font-bold shadow-lg">
                    {step.step}
                  </div>
                </motion.div>

                <div className="flex-1 pt-2">
                  <div className="mb-1 flex items-center gap-2">
                    <step.icon className="text-primary size-4" />
                    <Typography className="font-semibold">
                      {step.title}
                    </Typography>
                  </div>
                  <Typography variant="muted" className="text-sm">
                    {step.description}
                  </Typography>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Guarantees */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2.1 }}
        className="mb-10"
      >
        <Card className="border-primary/20 bg-primary/5 overflow-hidden">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Sparkles className="text-primary size-5" />
              <Typography className="font-semibold">
                Our Promise to You
              </Typography>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              {guarantees.map((guarantee, index) => (
                <motion.div
                  key={guarantee.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 2.2 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <guarantee.icon className="text-primary size-4" />
                  <Typography variant="muted" className="text-sm">
                    {guarantee.text}
                  </Typography>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sample Preview Teaser */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2.4 }}
        className="mb-10"
      >
        <Card className="overflow-hidden border-0 bg-white/5 backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 flex size-16 shrink-0 items-center justify-center rounded-xl">
                <Users className="text-primary size-8" />
              </div>
              <div>
                <Typography className="mb-1 font-semibold">
                  Join 127,000+ people
                </Typography>
                <Typography variant="muted" className="text-sm">
                  who have discovered their cosmic truth and transformed their
                  lives with personalized readings.
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2.6 }}
        className="flex items-center justify-between gap-4"
      >
        <Link href="/start/paywall">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" size="lg" className="py-6">
              <ArrowLeft className="size-4" />
              Back
            </Button>
          </motion.div>
        </Link>

        <Link href="/start/paywall/pricing" className="flex-1">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button size="lg" className="w-full py-6 text-base">
              <Sparkles className="size-5" />
              Unlock My Reading
              <ArrowRight className="size-5" />
            </Button>
          </motion.div>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2.8 }}
        className="mt-4 text-center"
      >
        <Typography variant="muted" className="text-xs">
          Secure checkout • Cancel anytime
        </Typography>
      </motion.div>
    </div>
  );
};
