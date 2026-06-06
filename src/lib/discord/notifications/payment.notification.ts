/**
 * Discord Notification System - Payment Notifications
 *
 * Notifications for subscription and payment events.
 */

import type { Organization, Subscription } from "@/generated/prisma";
import { SiteConfig } from "@/site-config";

import { sendDiscordNotificationAsync } from "../send-notification";
import {
  DISCORD_CHANNELS,
  DISCORD_COLORS,
  type DiscordWebhookPayload,
} from "../discord.types";

type SubscriptionWithOrg = Subscription & {
  organization?: Organization | null;
};

/**
 * Notify when a new subscription is created (checkout completed)
 */
export function notifySubscriptionCreated(params: {
  subscription: SubscriptionWithOrg;
  planName: string;
  amount?: number;
  currency?: string;
}): void {
  const { subscription, planName, amount, currency } = params;

  const fields = [
    {
      name: "Organization",
      value: subscription.organization?.name ?? "Unknown",
      inline: true,
    },
    { name: "Plan", value: planName, inline: true },
    { name: "Status", value: subscription.status ?? "active", inline: true },
  ];

  if (amount) {
    fields.push({
      name: "Amount",
      value: `${currency?.toUpperCase() ?? "USD"} ${(amount / 100).toFixed(2)}`,
      inline: true,
    });
  }

  const payload: DiscordWebhookPayload = {
    username: `${SiteConfig.title} Payments`,
    embeds: [
      {
        title: "New Subscription",
        description: `A new ${planName} subscription was created`,
        color: DISCORD_COLORS.SUCCESS,
        fields,
        timestamp: new Date().toISOString(),
      },
    ],
  };

  sendDiscordNotificationAsync(DISCORD_CHANNELS.PAYMENT, payload);
}

/**
 * Notify when a subscription is updated (plan change, renewal, etc.)
 */
export function notifySubscriptionUpdated(params: {
  subscription: SubscriptionWithOrg;
  previousPlan?: string;
  newPlan: string;
}): void {
  const { subscription, previousPlan, newPlan } = params;

  const description = previousPlan
    ? `Plan changed from ${previousPlan} to ${newPlan}`
    : `Subscription renewed on ${newPlan} plan`;

  const payload: DiscordWebhookPayload = {
    username: `${SiteConfig.title} Payments`,
    embeds: [
      {
        title: "Subscription Updated",
        description,
        color: DISCORD_COLORS.INFO,
        fields: [
          {
            name: "Organization",
            value: subscription.organization?.name ?? "Unknown",
            inline: true,
          },
          { name: "Plan", value: newPlan, inline: true },
          {
            name: "Status",
            value: subscription.status ?? "active",
            inline: true,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  sendDiscordNotificationAsync(DISCORD_CHANNELS.PAYMENT, payload);
}

/**
 * Notify when a subscription is canceled
 */
export function notifySubscriptionCanceled(params: {
  subscription: SubscriptionWithOrg;
  planName: string;
}): void {
  const { subscription, planName } = params;

  const payload: DiscordWebhookPayload = {
    username: `${SiteConfig.title} Payments`,
    embeds: [
      {
        title: "Subscription Canceled",
        description: `A ${planName} subscription was canceled`,
        color: DISCORD_COLORS.WARNING,
        fields: [
          {
            name: "Organization",
            value: subscription.organization?.name ?? "Unknown",
            inline: true,
          },
          { name: "Plan", value: planName, inline: true },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  sendDiscordNotificationAsync(DISCORD_CHANNELS.SUBSCRIPTION_CANCELED, payload);
}

/**
 * Notify when a payment fails
 */
export function notifyPaymentFailed(params: {
  organizationName: string;
  planName: string;
  errorMessage?: string;
}): void {
  const { organizationName, planName, errorMessage } = params;

  const payload: DiscordWebhookPayload = {
    username: `${SiteConfig.title} Payments`,
    embeds: [
      {
        title: "Payment Failed",
        description: errorMessage ?? "A payment attempt failed",
        color: DISCORD_COLORS.ERROR,
        fields: [
          { name: "Organization", value: organizationName, inline: true },
          { name: "Plan", value: planName, inline: true },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  sendDiscordNotificationAsync(DISCORD_CHANNELS.PAYMENT_FAILED, payload);
}
