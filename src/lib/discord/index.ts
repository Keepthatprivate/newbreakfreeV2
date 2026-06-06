/**
 * Discord Notification System
 *
 * Production-ready Discord webhook notifications with:
 * - Multi-channel support
 * - Automatic retry with exponential backoff
 * - Fire-and-forget pattern for non-blocking usage
 * - TypeScript strict types
 *
 * @example
 * ```typescript
 * import { notifyUserSignup, notifySubscriptionCreated } from "@/lib/discord";
 *
 * // Fire-and-forget notification (non-blocking)
 * notifyUserSignup({ userId: "123", email: "user@example.com", name: "John" });
 * ```
 */

// Types
export {
  DISCORD_CHANNELS,
  DISCORD_COLORS,
  type DiscordChannel,
  type DiscordEmbed,
  type DiscordEmbedField,
  type DiscordSendResult,
  type DiscordWebhookPayload,
} from "./discord.types";

// Config
export { getWebhookUrl, WEBHOOK_URLS } from "./discord.config";

// Core send functions (for custom notifications)
export {
  sendDiscordNotification,
  sendDiscordNotificationAsync,
} from "./send-notification";

// Pre-built notification functions
export {
  notifySubscriptionCreated,
  notifySubscriptionUpdated,
  notifySubscriptionCanceled,
  notifyPaymentFailed,
  notifyUserSignup,
  notifyTrialStarted,
  notifyTrialEnded,
  notifyTrialExpired,
  type UserSignupParams,
} from "./notifications";
