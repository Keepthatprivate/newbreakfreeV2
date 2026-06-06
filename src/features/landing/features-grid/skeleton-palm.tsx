"use client";

import { motion } from "motion/react";

const palmLines = [
  { name: "Heart", color: "#ef4444", path: "M 20 35 Q 50 20 80 35" },
  { name: "Head", color: "#3b82f6", path: "M 15 50 Q 50 42 85 55" },
  { name: "Life", color: "#22c55e", path: "M 25 75 Q 35 50 30 20" },
  { name: "Fate", color: "#a855f7", path: "M 50 85 Q 50 55 55 25" },
];

export const SkeletonPalm = () => {
  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="relative flex items-center gap-4">
        <svg
          viewBox="0 0 100 100"
          className="size-28 drop-shadow-sm"
          style={{ transform: "rotate(-5deg)" }}
        >
          <ellipse
            cx="50"
            cy="55"
            rx="35"
            ry="40"
            fill="none"
            className="stroke-muted-foreground/20"
            strokeWidth="1"
          />
          {palmLines.map((line, index) => (
            <motion.path
              key={line.name}
              d={line.path}
              fill="none"
              stroke={line.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.2 + index * 0.2,
                duration: 0.8,
                ease: "easeOut",
              }}
            />
          ))}
        </svg>
        <div className="flex flex-col gap-1.5">
          {palmLines.map((line, index) => (
            <motion.div
              key={line.name}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.4 + index * 0.15,
                duration: 0.4,
              }}
              className="flex items-center gap-2"
            >
              <div
                className="size-2.5 rounded-full"
                style={{ backgroundColor: line.color }}
              />
              <span className="text-xs font-medium">{line.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
