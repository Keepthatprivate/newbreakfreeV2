"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const planets = [
  { symbol: "☉", name: "Sun", x: 0, y: -55, color: "#fbbf24" },
  { symbol: "☽", name: "Moon", x: 48, y: -28, color: "#94a3b8" },
  { symbol: "☿", name: "Mercury", x: 48, y: 28, color: "#a78bfa" },
  { symbol: "♀", name: "Venus", x: 0, y: 55, color: "#f472b6" },
  { symbol: "♂", name: "Mars", x: -48, y: 28, color: "#ef4444" },
  { symbol: "♃", name: "Jupiter", x: -48, y: -28, color: "#f97316" },
];

export const SkeletonBirthChart = () => {
  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="relative size-32">
        <motion.div
          className="border-muted-foreground/20 absolute inset-0 rounded-full border"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="border-muted-foreground/15 absolute inset-4 rounded-full border"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
        <motion.div
          className="border-muted-foreground/10 absolute inset-8 rounded-full border"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />

        {[0, 30, 60, 90, 120, 150].map((angle, index) => (
          <motion.div
            key={angle}
            className="bg-muted-foreground/15 absolute top-1/2 left-1/2 h-px w-1/2 origin-left"
            style={{ rotate: `${angle}deg` }}
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
          />
        ))}

        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {planets.map((planet, index) => (
            <motion.div
              key={planet.symbol}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.5 + index * 0.1,
                duration: 0.4,
                type: "spring",
                stiffness: 200,
              }}
              className={cn(
                "absolute top-1/2 left-1/2 flex size-6 items-center justify-center rounded-full text-xs font-bold",
                "bg-background border shadow-sm",
              )}
              style={{
                transform: `translate(calc(-50% + ${planet.x}px), calc(-50% + ${planet.y}px))`,
                color: planet.color,
                borderColor: planet.color,
              }}
            >
              {planet.symbol}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
