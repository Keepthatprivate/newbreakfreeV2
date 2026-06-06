"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const days = [
  { day: "Mon", height: 65, mood: "good" },
  { day: "Tue", height: 45, mood: "neutral" },
  { day: "Wed", height: 80, mood: "good" },
  { day: "Thu", height: 35, mood: "bad" },
  { day: "Fri", height: 70, mood: "good" },
  { day: "Sat", height: 55, mood: "neutral" },
  { day: "Sun", height: 90, mood: "good" },
] as const;

const getMoodColor = (mood: "good" | "neutral" | "bad") => {
  switch (mood) {
    case "good":
      return "bg-emerald-500";
    case "neutral":
      return "bg-amber-500";
    case "bad":
      return "bg-rose-500";
  }
};

export const SkeletonHoroscope = () => {
  return (
    <div className="flex h-full flex-col px-2">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium">Weekly Forecast</span>
        <motion.span
          className="text-primary text-xs font-medium"
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          Great week ahead
        </motion.span>
      </div>
      <div className="flex flex-1 items-end justify-between gap-1.5">
        {days.map(({ day, height, mood }, index) => (
          <div key={day} className="flex flex-1 flex-col items-center gap-1.5">
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              whileInView={{ height: `${height}%`, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.08,
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className={cn("w-full rounded-t-md", getMoodColor(mood))}
            />
            <span className="text-muted-foreground text-[10px] font-medium">
              {day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
