/**
 * Discord Notification System - Type Definitions
 *
 * This module provides TypeScript types for the Discord notification system.
 * Uses const objects instead of enums per project conventions.
 */

/**
 * Available Discord webhook channels
 * Each channel corresponds to a different webhook URL
 */
export const DISCORD_CHANNELS = {
  PAYMENT: "payment",
  PAYMENT_FAILED: "payment_failed",
  SIGNUP: "signup",
  SUBSCRIPTION_CANCELED: "subscription_canceled",
  TRIAL_STARTED: "trial_started",
  TRIAL_ENDED: "trial_ended",
  TRIAL_EXPIRED: "trial_expired",
} as const;

export type DiscordChannel =
  (typeof DISCORD_CHANNELS)[keyof typeof DISCORD_CHANNELS];

/**
 * Predefined colors for Discord embeds (as integer values)
 */
export const DISCORD_COLORS = {
  SUCCESS: 0x22c55e, // Green
  WARNING: 0xf59e0b, // Amber
  ERROR: 0xef4444, // Red
  INFO: 0x007291, // Brand primary
  BLURPLE: 0x5865f2, // Discord brand
  PREMIUM: 0xa855f7, // Purple
} as const;

/**
 * Discord embed field structure
 */
export type DiscordEmbedField = {
  name: string;
  value: string;
  inline?: boolean;
};

/**
 * Discord embed structure for rich notifications
 */
export type DiscordEmbed = {
  title?: string;
  description?: string;
  color?: number;
  fields?: DiscordEmbedField[];
  footer?: {
    text: string;
    icon_url?: string;
  };
  thumbnail?: {
    url: string;
  };
  image?: {
    url: string;
  };
  timestamp?: string;
};

/**
 * Discord webhook payload structure
 */
export type DiscordWebhookPayload = {
  content?: string;
  username?: string;
  avatar_url?: string;
  embeds?: DiscordEmbed[];
};

/**
 * Result of sending a Discord notification
 * Follows the project's { data, error } pattern
 */
export type DiscordSendResult = {
  data: { messageId: string } | null;
  error: Error | null;
};

/**
 * Retry configuration for failed requests
 */
export type RetryConfig = {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
};
