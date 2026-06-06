"use client";

import { Typography } from "@/components/custom/typography";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Heart,
  Moon,
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { SectionLayout } from "../section-layout";
import { SkeletonBirthChart } from "./skeleton-birth-chart";
import { SkeletonCompatibility } from "./skeleton-compatibility";
import { SkeletonHoroscope } from "./skeleton-horoscope";
import { SkeletonPalm } from "./skeleton-palm";
import { SkeletonTarot } from "./skeleton-tarot";
import { SkeletonZodiac } from "./skeleton-zodiac";

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
  skeleton: ReactNode;
  href: string;
};

const features: Feature[] = [
  {
    title: "Zodiac Signs",
    description:
      "Discover what your zodiac sign reveals about your personality and life path.",
    icon: Star,
    skeleton: <SkeletonZodiac />,
    href: "/start",
  },
  {
    title: "Horoscopes",
    description:
      "Get predictions about your health, career, and love life based on celestial movements.",
    icon: Sun,
    skeleton: <SkeletonHoroscope />,
    href: "/start",
  },
  {
    title: "Palm Reading",
    description:
      "Learn what the lines on your palms reveal about your past, present, and future.",
    icon: Sparkles,
    skeleton: <SkeletonPalm />,
    href: "/start",
  },
  {
    title: "Compatibility",
    description:
      "Discover your potential matches and chances for a harmonious relationship.",
    icon: Heart,
    skeleton: <SkeletonCompatibility />,
    href: "/start",
  },
  {
    title: "Birth Chart",
    description:
      "Explore planetary positions to better understand your unique personality.",
    icon: Moon,
    skeleton: <SkeletonBirthChart />,
    href: "/start",
  },
  {
    title: "Tarot",
    description:
      "Draw the cards to find answers to your most pressing life questions.",
    icon: TrendingUp,
    skeleton: <SkeletonTarot />,
    href: "/start",
  },
];

export const FeaturesGrid = () => {
  return (
    <SectionLayout size="lg" id="features">
      <div className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Typography className="text-primary mb-2 font-semibold tracking-wider uppercase">
            Our Services
          </Typography>
          <Typography variant="h2" className="text-4xl sm:text-5xl">
            Explore our readings
          </Typography>
          <Typography
            variant="large"
            className="text-muted-foreground mx-auto mt-4 max-w-2xl font-normal"
          >
            Powerful tools to understand your destiny and make the best
            decisions.
          </Typography>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard key={feature.title} feature={feature} index={index} />
        ))}
      </div>
    </SectionLayout>
  );
};

const FeatureCard = ({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) => {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
        <div className="bg-muted/30 relative h-40 overflow-hidden p-4">
          {feature.skeleton}
        </div>
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <div className="bg-primary/10 flex size-10 items-center justify-center rounded-xl">
            <Icon className="text-primary size-5" />
          </div>
          <Typography variant="h3">{feature.title}</Typography>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Typography variant="muted" className="flex-1">
            {feature.description}
          </Typography>
          <Link
            href={feature.href}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-fit",
            )}
          >
            Explore
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};
