"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const zodiacSigns = [
  { symbol: "♈", name: "Aries", x: 0, y: -70 },
  { symbol: "♉", name: "Taurus", x: 35, y: -61 },
  { symbol: "♊", name: "Gemini", x: 61, y: -35 },
  { symbol: "♋", name: "Cancer", x: 70, y: 0 },
  { symbol: "♌", name: "Leo", x: 61, y: 35 },
  { symbol: "♍", name: "Virgo", x: 35, y: 61 },
  { symbol: "♎", name: "Libra", x: 0, y: 70 },
  { symbol: "♏", name: "Scorpio", x: -35, y: 61 },
  { symbol: "♐", name: "Sagittarius", x: -61, y: 35 },
  { symbol: "♑", name: "Capricorn", x: -70, y: 0 },
  { symbol: "♒", name: "Aquarius", x: -61, y: -35 },
  { symbol: "♓", name: "Pisces", x: -35, y: -61 },
];

export const SkeletonZodiac = () => {
  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="relative flex items-center justify-center">
        {zodiacSigns.map((sign, index) => (
          <motion.div
            key={sign.symbol}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.05,
              duration: 0.4,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className={cn(
              "absolute flex size-9 items-center justify-center rounded-full text-base",
              "bg-background border shadow-sm",
              "hover:bg-primary hover:text-primary-foreground transition-colors",
            )}
            style={{
              transform: `translate(${sign.x}px, ${sign.y}px)`,
            }}
          >
            {sign.symbol}
          </motion.div>
        ))}
        <motion.div
          className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-full text-xl font-bold"
          initial={{ scale: 0, rotate: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          animate={{ rotate: 360 }}
          transition={{
            scale: { duration: 0.5, delay: 0.6 },
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          }}
        >
          ☉
        </motion.div>
      </div>
    </div>
  );
};
