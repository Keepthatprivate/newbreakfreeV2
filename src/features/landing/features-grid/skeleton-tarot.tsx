"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const cards = [
  { id: 1, name: "The Sun", symbol: "☀", rotation: -15, x: -30 },
  { id: 2, name: "The Moon", symbol: "☽", rotation: 0, x: 0 },
  { id: 3, name: "The Star", symbol: "★", rotation: 15, x: 30 },
];

export const SkeletonTarot = () => {
  return (
    <div className="relative flex h-full items-center justify-center pt-2">
      <div className="relative flex h-28 items-center justify-center">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{
              opacity: 0,
              y: 20,
              rotate: 0,
              x: 0,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
              rotate: card.rotation,
              x: card.x,
            }}
            viewport={{ once: true }}
            transition={{
              delay: 0.2 + index * 0.15,
              duration: 0.5,
              type: "spring",
              stiffness: 150,
              damping: 15,
            }}
            className={cn(
              "absolute flex h-24 w-16 flex-col items-center justify-center rounded-lg shadow-lg",
              "bg-gradient-to-br from-indigo-900 to-purple-900",
              "border-2 border-amber-400/40",
            )}
            style={{
              zIndex: index === 1 ? 3 : index === 0 ? 1 : 2,
            }}
          >
            <motion.span
              className="text-2xl text-amber-300"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.5 + index * 0.15,
                duration: 0.3,
                type: "spring",
              }}
            >
              {card.symbol}
            </motion.span>
            <motion.span
              className="mt-1 text-[8px] text-amber-200/80"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + index * 0.15, duration: 0.3 }}
            >
              {card.name}
            </motion.span>
          </motion.div>
        ))}
      </div>
      <motion.p
        className="text-muted-foreground absolute bottom-1 text-xs"
        initial={{ opacity: 0, y: 5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9, duration: 0.4 }}
      >
        Draw your cards
      </motion.p>
    </div>
  );
};
