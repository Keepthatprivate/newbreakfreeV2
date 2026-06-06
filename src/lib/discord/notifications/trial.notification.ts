/**
 * Discord Notification System - Trial Notifications
 *
 * Notifications for trial lifecycle events.
 */

import type { Subscription } from "@/generated/prisma";
import { SiteConfig } from "@/site-config";

import { sendDiscordNotificationAsync } from "../send-notification";
import {
  DISCORD_CHANNELS,
  DISCORD_COLORS,
  type DiscordWebhookPayload,
} from "../discord.types";

/**
 * Notify when a trial starts
 */
export function notifyTrialStarted(params: {
  subscription: Subscription;
  organizationName: string;
  planName: string;
  trialDays: number;
}): void {
  const { organizationName, planName, trialDays } = params;

  const payload: DiscordWebhookPayload = {
    username: `${SiteConfig.title} Trials`,
    embeds: [
      {
        title: "Trial Started",
        description: `A new ${trialDays}-day trial started`,
        color: DISCORD_COLORS.INFO,
        fields: [
          { name: "Organization", value: organizationName, inline: true },
          { name: "Plan", value: planName, inline: true },
          { name: "Trial Days", value: String(trialDays), inline: true },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  sendDiscordNotificationAsync(DISCORD_CHANNELS.TRIAL_STARTED, payload);
}

/**
 * Notify when a trial ends (converted or not)
 */
export function notifyTrialEnded(params: {
  organizationName: string;
  planName: string;
  converted: boolean;
}): void {
  const { organizationName, planName, converted } = params;

  const payload: DiscordWebhookPayload = {
    username: `${SiteConfig.title} Trials`,
    embeds: [
      {
        title: converted ? "Trial Converted" : "Trial Ended",
        description: converted
          ? "Trial converted to paid subscription"
          : "Trial ended without conversion",
        color: converted ? DISCORD_COLORS.SUCCESS : DISCORD_COLORS.WARNING,
        fields: [
          { name: "Organization", value: organizationName, inline: true },
          { name: "Plan", value: planName, inline: true },
          { name: "Converted", value: converted ? "Yes" : "No", inline: true },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  sendDiscordNotificationAsync(DISCORD_CHANNELS.TRIAL_ENDED, payload);
}

/**
 * Notify when a trial expires without payment method
 */
export function notifyTrialExpired(params: {
  organizationName: string;
  planName: string;
}): void {
  const { organizationName, planName } = params;

  const payload: DiscordWebhookPayload = {
    username: `${SiteConfig.title} Trials`,
    embeds: [
      {
        title: "Trial Expired",
        description: "A trial expired without adding payment method",
        color: DISCORD_COLORS.ERROR,
        fields: [
          { name: "Organization", value: organizationName, inline: true },
          { name: "Plan", value: planName, inline: true },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  sendDiscordNotificationAsync(DISCORD_CHANNELS.TRIAL_EXPIRED, payload);
}
