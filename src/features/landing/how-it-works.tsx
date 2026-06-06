"use client";

import { Typography } from "@/components/custom/typography";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ClipboardCheck, Sparkles, Star, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { SectionLayout } from "./section-layout";

type Step = {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
};

const steps: Step[] = [
  {
    number: 1,
    title: "Create your account",
    description:
      "Answer a few questions about yourself to help us design your personalized profile.",
    icon: User,
  },
  {
    number: 2,
    title: "Take an astrology quiz",
    description:
      "Take a short personality quiz to learn more about yourself and your zodiac sign.",
    icon: ClipboardCheck,
  },
  {
    number: 3,
    title: "Get your personalized reading",
    description:
      "Our astrologers analyze your profile and provide detailed predictions based on your birth info.",
    icon: Sparkles,
  },
  {
    number: 4,
    title: "Access your profile",
    description:
      "Sign in anytime to view your personalized readings and detailed astrology forecast.",
    icon: Star,
  },
];

export const HowItWorks = () => {
  return (
    <SectionLayout size="lg">
      <div className="mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Typography className="text-primary mb-2 font-semibold tracking-wider uppercase">
            Getting Started
          </Typography>
          <Typography variant="h2" className="text-4xl sm:text-5xl">
            How it works
          </Typography>
          <Typography
            variant="large"
            className="text-muted-foreground mx-auto mt-4 max-w-2xl font-normal"
          >
            Start your journey to self-discovery in just a few simple steps.
          </Typography>
        </motion.div>
      </div>

      <div className="relative">
        <div className="bg-border absolute top-0 left-1/2 hidden h-full w-0.5 -translate-x-1/2 lg:block" />

        <div className="flex flex-col gap-12 lg:gap-0">
          {steps.map((step, index) => (
            <StepItem key={step.number} step={step} index={index} />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-16 flex justify-center"
      >
        <Link
          href="/start/quiz"
          className={cn(buttonVariants({ size: "lg" }), "min-w-48")}
        >
          Get my predictions
        </Link>
      </motion.div>
    </SectionLayout>
  );
};

const StepItem = ({ step, index }: { step: Step; index: number }) => {
  const Icon = step.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "relative flex flex-col items-center gap-6 lg:flex-row lg:gap-12",
        isEven ? "lg:flex-row" : "lg:flex-row-reverse",
      )}
    >
      <div
        className={cn(
          "flex-1 text-center lg:text-left",
          !isEven && "lg:text-right",
        )}
      >
        <div
          className={cn(
            "inline-flex items-center gap-2",
            !isEven && "lg:flex-row-reverse",
          )}
        >
          <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full text-sm font-bold">
            {step.number}
          </span>
          <Typography variant="h3">{step.title}</Typography>
        </div>
        <Typography
          variant="muted"
          className="mx-auto mt-2 max-w-sm lg:mx-0 lg:text-base"
        >
          {step.description}
        </Typography>
      </div>

      <div className="bg-background border-primary relative z-10 flex size-16 shrink-0 items-center justify-center rounded-full border-4 shadow-lg lg:size-20">
        <Icon className="text-primary size-8 lg:size-10" />
      </div>

      <div className="hidden flex-1 lg:block" />
    </motion.div>
  );
};
