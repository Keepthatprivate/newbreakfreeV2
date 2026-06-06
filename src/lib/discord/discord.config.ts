/**
 * Discord Notification System - Configuration
 *
 * This module provides configuration for Discord webhooks and retry settings.
 */

import { env } from "@/lib/env";

import {
  DISCORD_CHANNELS,
  type DiscordChannel,
  type RetryConfig,
} from "./discord.types";

/**
 * Mapping of channels to webhook URLs from environment variables
 * Each channel can have its own webhook, or channels can share webhooks
 */
export const WEBHOOK_URLS: Record<DiscordChannel, string | undefined> = {
  [DISCORD_CHANNELS.PAYMENT]: env.DISCORD_WEBHOOK_PAYMENT,
  [DISCORD_CHANNELS.PAYMENT_FAILED]: env.DISCORD_WEBHOOK_PAYMENT_FAILED,
  [DISCORD_CHANNELS.SIGNUP]: env.DISCORD_WEBHOOK_SIGNUP,
  [DISCORD_CHANNELS.SUBSCRIPTION_CANCELED]:
    env.DISCORD_WEBHOOK_SUBSCRIPTION_CANCELED,
  // Trial events share the same webhook URL
  [DISCORD_CHANNELS.TRIAL_STARTED]: env.DISCORD_WEBHOOK_TRIAL,
  [DISCORD_CHANNELS.TRIAL_ENDED]: env.DISCORD_WEBHOOK_TRIAL,
  [DISCORD_CHANNELS.TRIAL_EXPIRED]: env.DISCORD_WEBHOOK_TRIAL,
};

/**
 * Retry configuration with exponential backoff
 * - 3 retries total
 * - Base delay of 1 second
 * - Maximum delay capped at 10 seconds
 */
export const RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

/**
 * Gets the webhook URL for a specific channel
 */
export function getWebhookUrl(channel: DiscordChannel): string | undefined {
  return WEBHOOK_URLS[channel];
}
