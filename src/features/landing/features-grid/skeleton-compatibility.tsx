"use client";

import { Heart } from "lucide-react";
import { motion } from "motion/react";

export const SkeletonCompatibility = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0, x: 20 }}
          whileInView={{ scale: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.1,
            duration: 0.5,
            type: "spring",
            stiffness: 200,
          }}
          className="bg-primary/10 flex size-14 items-center justify-center rounded-full border-2 border-pink-400"
        >
          <span className="text-2xl">♈</span>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Heart className="size-6 fill-red-500 text-red-500" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ scale: 0, x: -20 }}
          whileInView={{ scale: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.2,
            duration: 0.5,
            type: "spring",
            stiffness: 200,
          }}
          className="bg-primary/10 flex size-14 items-center justify-center rounded-full border-2 border-blue-400"
        >
          <span className="text-2xl">♌</span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="text-center"
      >
        <div className="text-primary text-2xl font-bold">89%</div>
        <div className="text-muted-foreground text-xs">Love compatibility</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.3 }}
        className="bg-muted h-2 w-full overflow-hidden rounded-full"
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
          initial={{ width: 0 }}
          whileInView={{ width: "89%" }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
        />
      </motion.div>
    </div>
  );
};
