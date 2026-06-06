"use client";

import { motion } from "motion/react";

// Pre-calculated star positions for twinkling effect
const STARS = [
  { id: 0, x: 12, y: 8, size: 1.5, delay: 0, duration: 3 },
  { id: 1, x: 85, y: 15, size: 1, delay: 0.5, duration: 2.5 },
  { id: 2, x: 45, y: 22, size: 2, delay: 1, duration: 4 },
  { id: 3, x: 78, y: 35, size: 1, delay: 1.5, duration: 3.5 },
  { id: 4, x: 23, y: 42, size: 1.5, delay: 2, duration: 2.8 },
  { id: 5, x: 92, y: 48, size: 1, delay: 0.3, duration: 3.2 },
  { id: 6, x: 5, y: 55, size: 1.5, delay: 0.8, duration: 4.2 },
  { id: 7, x: 67, y: 62, size: 1, delay: 1.2, duration: 2.6 },
  { id: 8, x: 34, y: 68, size: 2, delay: 1.8, duration: 3.8 },
  { id: 9, x: 88, y: 75, size: 1.5, delay: 2.3, duration: 3 },
  { id: 10, x: 15, y: 82, size: 1, delay: 0.6, duration: 2.4 },
  { id: 11, x: 56, y: 88, size: 1.5, delay: 1.4, duration: 3.6 },
  { id: 12, x: 72, y: 12, size: 1, delay: 2.1, duration: 2.9 },
  { id: 13, x: 38, y: 5, size: 2, delay: 0.2, duration: 4.1 },
  { id: 14, x: 95, y: 28, size: 1, delay: 1.6, duration: 2.2 },
  { id: 15, x: 8, y: 38, size: 1.5, delay: 2.5, duration: 3.4 },
];

export const StarField = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {STARS.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white/60"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export const CosmicBackground = () => {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-600 to-purple-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-20rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-40rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-purple-600 to-pink-500 opacity-15 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </>
  );
};

export const CosmicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background relative isolate flex min-h-screen flex-col overflow-hidden">
      <CosmicBackground />
      <StarField />
      {children}
    </div>
  );
};
