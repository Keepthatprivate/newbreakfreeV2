"use client";

import { Typography } from "@/components/custom/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import {
  ArrowRight,
  Clock,
  Eye,
  Heart,
  Moon,
  Shield,
  Sparkles,
  Star,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Animated counter component
const AnimatedNumber = ({ value }: { value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v).toLocaleString());
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      ease: "easeOut",
    });
    const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [count, value, rounded]);

  return <span>{displayValue}</span>;
};

// Floating orb animation
const FloatingOrb = ({
  delay,
  duration,
  size,
  className,
}: {
  delay: number;
  duration: number;
  size: number;
  className: string;
}) => (
  <motion.div
    className={`absolute rounded-full blur-xl ${className}`}
    style={{ width: size, height: size }}
    animate={{
      y: [0, -20, 0],
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);

const promises = [
  {
    icon: Heart,
    badge: "Love",
    title: "You deserve the love you've been dreaming of",
    description:
      "Those failed relationships? They weren't your fault. Your chart reveals exactly why some connections felt impossible — and who is truly meant for you.",
    highlight: "Find your soulmate compatibility",
  },
  {
    icon: Target,
    badge: "Purpose",
    title: "Your struggles have a hidden meaning",
    description:
      "Every obstacle, every setback, every moment of self-doubt... They're not random. Saturn's challenges are preparing you for something extraordinary.",
    highlight: "Discover your true calling",
  },
  {
    icon: Shield,
    badge: "Destiny",
    title: "You were born with a rare gift",
    description:
      "Only 2% of people have your exact planetary alignment. The universe chose this moment for you to finally understand your unique power.",
    highlight: "Unlock your hidden potential",
  },
];

const stats = [
  { value: 127439, label: "readings delivered" },
  { value: 4.9, label: "average rating", suffix: "/5" },
  { value: 94, label: "feel more clarity", suffix: "%" },
];

const scrollingTestimonials = [
  {
    text: "I finally understood why every relationship ended the same way",
    author: "Marie, 34",
  },
  {
    text: "My career change suddenly made complete sense",
    author: "Thomas, 29",
  },
  {
    text: "I stopped blaming myself for things written in the stars",
    author: "Sophie, 41",
  },
  {
    text: "The accuracy gave me chills. It's like they knew my whole life",
    author: "Lucas, 26",
  },
  {
    text: "Best decision I've made this year. Life-changing insights",
    author: "Emma, 38",
  },
];

export const PaywallStep1 = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(
        (prev) => (prev + 1) % scrollingTestimonials.length,
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-2xl px-4">
      {/* Floating orbs */}
      <FloatingOrb
        delay={0}
        duration={6}
        size={120}
        className="bg-primary/20 -top-10 -left-10"
      />
      <FloatingOrb
        delay={2}
        duration={8}
        size={80}
        className="top-1/4 -right-10 bg-purple-500/20"
      />
      <FloatingOrb
        delay={4}
        duration={7}
        size={100}
        className="bottom-1/4 -left-16 bg-indigo-500/20"
      />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mb-12 text-center"
      >
        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          className="mx-auto mb-6"
        >
          <div className="relative">
            <div className="bg-primary/20 mx-auto flex size-20 items-center justify-center rounded-full">
              <Moon className="text-primary size-10" />
            </div>
            {/* Orbiting sparkle */}
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="text-primary size-5" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Typography
            variant="h1"
            className="text-3xl leading-tight font-bold sm:text-4xl md:text-5xl"
          >
            The stars have been waiting
            <br />
            <span className="text-primary">to tell you something</span>
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Typography
            variant="muted"
            className="mx-auto mt-6 max-w-md text-base leading-relaxed sm:text-lg"
          >
            Your unique cosmic blueprint has been decoded. Discover why life has
            unfolded exactly as it has — and what&apos;s coming next.
          </Typography>
        </motion.div>

        {/* Live indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-6 flex items-center justify-center gap-2"
        >
          <motion.div
            className="size-2 rounded-full bg-green-500"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <Typography variant="muted" className="text-sm">
            <Eye className="mr-1 inline size-3" />
            <span className="font-medium">847 people</span> viewing their
            reading right now
          </Typography>
        </motion.div>
      </motion.div>

      {/* Promises Section */}
      <div className="mb-12 space-y-4">
        {promises.map((promise, index) => (
          <motion.div
            key={promise.title}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.8 + index * 0.15,
              ease: "easeOut",
            }}
          >
            <Card className="group relative overflow-hidden border-0 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
              {/* Glow effect on hover */}
              <div className="from-primary/0 via-primary/5 to-primary/0 absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <CardContent className="relative flex gap-5 p-6">
                <motion.div
                  className="shrink-0"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="bg-primary/15 flex size-14 items-center justify-center rounded-2xl">
                    <promise.icon className="text-primary size-7" />
                  </div>
                </motion.div>

                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="bg-primary/20 text-primary rounded-full px-2.5 py-0.5 text-xs font-semibold">
                      {promise.badge}
                    </span>
                  </div>
                  <Typography className="mb-2 text-base leading-snug font-semibold">
                    {promise.title}
                  </Typography>
                  <Typography
                    variant="muted"
                    className="mb-3 text-sm leading-relaxed"
                  >
                    {promise.description}
                  </Typography>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="text-primary size-3.5" />
                    <Typography className="text-primary text-sm font-medium">
                      {promise.highlight}
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.3 }}
        className="mb-10"
      >
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
              className="text-center"
            >
              <Typography className="text-primary text-2xl font-bold sm:text-3xl">
                {typeof stat.value === "number" && stat.value > 100 ? (
                  <AnimatedNumber value={stat.value} />
                ) : (
                  stat.value
                )}
                {stat.suffix}
              </Typography>
              <Typography variant="muted" className="text-xs">
                {stat.label}
              </Typography>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scrolling Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="mb-10"
      >
        <Card className="overflow-hidden border-0 bg-white/5 backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="size-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>

            <div className="relative h-16 overflow-hidden">
              {scrollingTestimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: currentTestimonial === index ? 1 : 0,
                    y: currentTestimonial === index ? 0 : 20,
                  }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                >
                  <Typography className="text-sm italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </Typography>
                  <Typography variant="muted" className="mt-2 text-xs">
                    — {testimonial.author}
                  </Typography>
                </motion.div>
              ))}
            </div>

            {/* Dots */}
            <div className="mt-3 flex justify-center gap-1.5">
              {scrollingTestimonials.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className="size-1.5 rounded-full"
                  animate={{
                    backgroundColor:
                      i === currentTestimonial
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted-foreground) / 0.3)",
                    scale: i === currentTestimonial ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Urgency + CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.7 }}
        className="text-center"
      >
        {/* Urgency message */}
        <motion.div
          className="mb-4 flex items-center justify-center gap-2"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Clock className="text-primary size-4" />
          <Typography variant="muted" className="text-sm">
            Your reading is ready — don&apos;t miss this cosmic window
          </Typography>
        </motion.div>

        <Link href="/start/paywall/how-it-works">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button size="lg" className="min-w-72 py-6 text-base">
              <Sparkles className="size-5" />
              Reveal My Cosmic Blueprint
              <ArrowRight className="size-5" />
            </Button>
          </motion.div>
        </Link>

        <Typography variant="muted" className="mt-4 text-xs">
          No commitment required • Takes 2 minutes
        </Typography>
      </motion.div>
    </div>
  );
};
