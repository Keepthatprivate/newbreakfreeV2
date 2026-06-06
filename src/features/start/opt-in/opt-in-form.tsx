"use client";

import { Typography } from "@/components/custom/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Form, useForm } from "@/features/form/tanstack-form";
import { LoadingButton } from "@/features/form/submit-button";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Star, Sparkles, Mail } from "lucide-react";
import { checkAndCreateUserAction } from "./opt-in.action";
import { resolveActionResult } from "@/lib/actions/actions-utils";

const EmailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type EmailSchemaType = z.infer<typeof EmailSchema>;

// Testimonials data
const testimonials = [
  {
    name: "Sarah M.",
    text: "The reading was incredibly accurate! It helped me understand my relationship patterns.",
    rating: 5,
  },
  {
    name: "Michael R.",
    text: "I was skeptical at first, but the insights about my career path were spot on.",
    rating: 5,
  },
  {
    name: "Emma L.",
    text: "This gave me clarity during a difficult time. Highly recommend!",
    rating: 5,
  },
  {
    name: "James K.",
    text: "The personality analysis was so accurate it gave me chills.",
    rating: 5,
  },
  {
    name: "Lisa T.",
    text: "Finally understand why I am the way I am. Life-changing experience.",
    rating: 5,
  },
  {
    name: "David H.",
    text: "My compatibility reading helped me understand my partner better.",
    rating: 5,
  },
];

export const OptInForm = () => {
  const [otpEmail, setOtpEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Creating your account...",
  );

  // First check if user exists, create if not
  const checkUserMutation = useMutation({
    mutationFn: async (values: EmailSchemaType) => {
      setIsLoading(true);
      setLoadingMessage("Creating your account...");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return resolveActionResult(
        checkAndCreateUserAction({ email: values.email }),
      );
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.message);
    },
    onSuccess: async (result, values) => {
      if (result.needsOtp) {
        // User exists, need OTP
        setLoadingMessage("Sending verification code...");
        try {
          await unwrapSafePromise(
            authClient.emailOtp.sendVerificationOtp({
              email: values.email,
              type: "sign-in",
            }),
          );
          setIsLoading(false);
          setOtpEmail(values.email);
        } catch {
          setIsLoading(false);
          toast.error("Failed to send verification code");
        }
      } else {
        // User was created and signed in, redirect
        setLoadingMessage("Redirecting...");
        window.location.href = "/start/paywall";
      }
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      setIsLoading(true);
      setLoadingMessage("Sending verification code...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return unwrapSafePromise(
        authClient.emailOtp.sendVerificationOtp({
          email,
          type: "sign-in",
        }),
      );
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.message);
    },
    onSuccess: () => {
      setIsLoading(false);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (otp: string) => {
      if (!otpEmail) {
        throw new Error("Email is required");
      }
      setIsLoading(true);
      setLoadingMessage("Verifying...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return unwrapSafePromise(
        authClient.signIn.emailOtp({
          email: otpEmail,
          otp: otp,
        }),
      );
    },
    onError: (error) => {
      setIsLoading(false);
      toast.error(error.message);
    },
    onSuccess: () => {
      setLoadingMessage("Redirecting...");
      window.location.href = "/start/paywall";
    },
  });

  return (
    <div className="mx-auto w-full max-w-lg px-4">
      <div className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-primary/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
            <Sparkles className="text-primary size-8" />
          </div>
          <Typography variant="h2" className="text-2xl sm:text-3xl">
            Your reading is ready
          </Typography>
          <Typography variant="muted" className="mt-2">
            Enter your email to access your personalized astrology report
          </Typography>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-8"
                >
                  <div className="mb-4 flex gap-1">
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
                  <Typography variant="muted" className="text-sm">
                    {loadingMessage}
                  </Typography>
                </motion.div>
              ) : otpEmail ? (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <OtpVerificationForm
                    email={otpEmail}
                    onVerify={verifyOtpMutation.mutate}
                    onResend={() => sendOtpMutation.mutate(otpEmail)}
                    isResendPending={sendOtpMutation.isPending}
                    onBack={() => setOtpEmail(null)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <EmailForm
                    onSubmit={(email) => checkUserMutation.mutate({ email })}
                    isPending={checkUserMutation.isPending}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Scrolling Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8"
      >
        <Typography
          variant="muted"
          className="mb-4 text-center text-xs tracking-wide uppercase"
        >
          What our users say
        </Typography>
        <TestimonialsCarousel />
      </motion.div>
    </div>
  );
};

const EmailForm = ({
  onSubmit,
  isPending,
}: {
  onSubmit: (email: string) => void;
  isPending: boolean;
}) => {
  const form = useForm({
    schema: EmailSchema,
    defaultValues: { email: "" },
    onSubmit: async (values: EmailSchemaType) => {
      onSubmit(values.email);
    },
  });

  return (
    <Form form={form} className="space-y-4">
      <form.AppField name="email">
        {(field) => (
          <field.Field>
            <field.Label>Email address</field.Label>
            <field.Content>
              <div className="relative">
                <Mail className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <field.Input
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                />
              </div>
              <field.Message />
            </field.Content>
          </field.Field>
        )}
      </form.AppField>

      <LoadingButton loading={isPending} type="submit" className="w-full">
        <Sparkles className="size-4" />
        Continue
      </LoadingButton>

      <Typography variant="muted" className="text-center text-xs">
        By continuing, you agree to our terms and privacy policy
      </Typography>
    </Form>
  );
};

const OtpVerificationForm = ({
  email,
  onVerify,
  onResend,
  isResendPending,
  onBack,
}: {
  email: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  isResendPending: boolean;
  onBack: () => void;
}) => {
  const [value, setValue] = useState("");
  const [countdown, setCountdown] = useState(0);

  const setOtpValue = (otp: string) => {
    setValue(otp);
    if (otp.length === 6) {
      onVerify(otp);
    }
  };

  const handleResend = () => {
    setCountdown(60);
    onResend();
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Typography className="text-center">
        Enter the code sent to <span className="font-semibold">{email}</span>
      </Typography>

      <InputOTP maxLength={6} value={value} onChange={setOtpValue}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <div className="flex items-center gap-2 text-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResend}
          disabled={isResendPending || countdown > 0}
          className="text-xs"
        >
          Resend code {countdown > 0 ? `(${countdown}s)` : ""}
        </Button>
        <span className="text-muted-foreground">|</span>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-xs">
          Change email
        </Button>
      </div>
    </div>
  );
};

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-24 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          <Card className="h-full border-0 bg-transparent shadow-none">
            <CardContent className="flex h-full flex-col items-center justify-center p-4 text-center">
              <div className="mb-2 flex gap-0.5">
                {Array.from({ length: testimonials[currentIndex].rating }).map(
                  (_, i) => (
                    <Star
                      key={i}
                      className="size-3 fill-yellow-400 text-yellow-400"
                    />
                  ),
                )}
              </div>
              <Typography variant="muted" className="text-sm italic">
                &ldquo;{testimonials[currentIndex].text}&rdquo;
              </Typography>
              <Typography className="mt-2 text-xs font-medium">
                {testimonials[currentIndex].name}
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Dots indicator */}
      <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-1">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              "size-1.5 rounded-full transition-colors",
              i === currentIndex ? "bg-primary" : "bg-muted-foreground/30",
            )}
          />
        ))}
      </div>
    </div>
  );
};
