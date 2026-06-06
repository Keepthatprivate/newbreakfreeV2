"use server";

import { action } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { headers } from "next/headers";

const OptInSchema = z.object({
  email: z.string().email(),
});

export const checkAndCreateUserAction = action
  .inputSchema(OptInSchema)
  .action(async ({ parsedInput: { email } }) => {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // User exists, they need to use OTP
      return { exists: true, needsOtp: true };
    }

    // User doesn't exist, create account and sign in directly
    const headersList = await headers();

    // Create user with a random password (they won't use it)
    const randomPassword = crypto.randomUUID() + crypto.randomUUID();

    try {
      await auth.api.signUpEmail({
        body: {
          email,
          password: randomPassword,
          name: email.split("@")[0],
        },
        headers: headersList,
      });

      // Sign in the user automatically
      const session = await auth.api.signInEmail({
        body: {
          email,
          password: randomPassword,
        },
        headers: headersList,
      });

      return {
        exists: false,
        needsOtp: false,
        success: true,
        token: session.token,
      };
    } catch {
      // If signup fails (maybe user was created between check and signup)
      // Fall back to OTP flow
      return { exists: true, needsOtp: true };
    }
  });
