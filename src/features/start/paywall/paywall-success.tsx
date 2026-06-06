"use client";

import { Typography } from "@/components/custom/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import { CheckCircle, Download, Sparkles } from "lucide-react";
import Link from "next/link";

export const PaywallSuccess = () => {
  return (
    <div className="mx-auto w-full max-w-lg px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
          className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-green-500/20"
        >
          <CheckCircle className="size-10 text-green-500" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Typography variant="h1" className="text-3xl font-bold sm:text-4xl">
            Payment Successful
          </Typography>
          <Typography
            variant="muted"
            className="mx-auto mt-4 max-w-md text-base"
          >
            Thank you for your purchase. Your personalized astrology and palm
            reading report is now being generated.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="border-0 bg-white/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="mb-4 flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="bg-primary size-2 rounded-full"
                    animate={{ opacity: [0.4, 1, 0.4], y: [0, -8, 0] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
              <Typography className="font-medium">
                Generating your reading...
              </Typography>
              <Typography variant="muted" className="mt-2 text-sm">
                This usually takes 2-3 minutes. We&apos;ll send you an email
                when it&apos;s ready.
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 flex flex-col gap-3"
        >
          <Link href="/dashboard">
            <Button size="lg" className="w-full">
              <Sparkles className="size-4" />
              Go to Dashboard
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="w-full" disabled>
            <Download className="size-4" />
            Download PDF (Available soon)
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <Typography variant="muted" className="text-xs">
            A confirmation email has been sent to your inbox. If you have any
            questions, contact us at support@karlastro.com
          </Typography>
        </motion.div>
      </motion.div>
    </div>
  );
};
