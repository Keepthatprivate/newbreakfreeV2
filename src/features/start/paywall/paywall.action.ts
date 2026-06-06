"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { getServerUrl } from "@/lib/server-url";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ActionError } from "@/lib/errors/action-error";

const CreateCheckoutSchema = z.object({
  plan: z.enum(["monthly", "yearly"]),
  // Meta Pixel tracking data
  fbp: z.string().optional(),
  fbc: z.string().optional(),
  clientIp: z.string().optional(),
  clientUserAgent: z.string().optional(),
});

// Price IDs - these should be in env vars in production
const PRICES = {
  monthly: process.env.STRIPE_ASTROLOGY_MONTHLY_PRICE_ID ?? "",
  yearly: process.env.STRIPE_ASTROLOGY_YEARLY_PRICE_ID ?? "",
};

export const createPaywallCheckoutAction = authAction
  .inputSchema(CreateCheckoutSchema)
  .action(
    async ({
      parsedInput: { plan, fbp, fbc, clientIp, clientUserAgent },
      ctx: { user },
    }) => {
      const priceId = PRICES[plan];

      if (!priceId) {
        throw new ActionError(`Price ID not configured for ${plan} plan`);
      }

      // Get user's organization
      const member = await prisma.member.findFirst({
        where: { userId: user.id },
        include: { organization: true },
      });

      if (!member?.organization) {
        throw new ActionError("No organization found");
      }

      let customerId = member.organization.stripeCustomerId;

      // Create Stripe customer if doesn't exist
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: {
            userId: user.id,
            organizationId: member.organization.id,
          },
        });
        customerId = customer.id;

        await prisma.organization.update({
          where: { id: member.organization.id },
          data: { stripeCustomerId: customerId },
        });
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${getServerUrl()}/start/paywall/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${getServerUrl()}/start/paywall/pricing`,
        metadata: {
          userId: user.id,
          organizationId: member.organization.id,
          plan,
          // Meta Pixel tracking
          ...(fbp && { fbp }),
          ...(fbc && { fbc }),
          ...(clientIp && { clientIp }),
          ...(clientUserAgent && { clientUserAgent }),
        },
        subscription_data: {
          metadata: {
            userId: user.id,
            organizationId: member.organization.id,
            plan,
          },
        },
        allow_promotion_codes: true,
      });

      if (!session.url) {
        throw new ActionError("Failed to create checkout session");
      }

      return { url: session.url };
    },
  );
