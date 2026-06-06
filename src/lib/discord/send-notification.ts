/**
 * Discord Notification System - Send Notification
 *
 * Core functionality for sending Discord notifications with retry logic.
 * This module never throws - all errors are captured and returned.
 */

import { logger } from "@/lib/logger";

import { getWebhookUrl, RETRY_CONFIG } from "./discord.config";
import type {
  DiscordChannel,
  DiscordSendResult,
  DiscordWebhookPayload,
} from "./discord.types";

/**
 * Sleep helper for retry delays
 */
const sleep = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculate delay with exponential backoff + jitter
 * This helps prevent thundering herd problems
 */
function calculateDelay(attempt: number): number {
  const exponentialDelay = RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt);
  const jitter = Math.random() * RETRY_CONFIG.baseDelayMs;
  return Math.min(exponentialDelay + jitter, RETRY_CONFIG.maxDelayMs);
}

/**
 * Sends a Discord notification with automatic retry
 *
 * This function NEVER throws. All errors are captured and returned
 * in the result object following the { data, error } pattern.
 *
 * @param channel - The Discord channel to send to
 * @param payload - The webhook payload (embeds, content, etc.)
 * @returns Promise with { data, error } result
 */

export async function sendDiscordNotification(
  channel: DiscordChannel,
  payload: DiscordWebhookPayload,
): Promise<DiscordSendResult> {
  const webhookUrl = getWebhookUrl(channel);

  // Silent skip if webhook URL is not configured
  if (!webhookUrl) {
    logger.debug(`[Discord] No webhook configured for channel: ${channel}`);
    return { data: null, error: null };
  }

  let lastError: Error | null = null;

  /* eslint-disable no-await-in-loop -- Intentional sequential retry logic */
  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        logger.debug(`[Discord] Notification sent to ${channel}`);
        return { data: { messageId: `discord_${Date.now()}` }, error: null };
      }

      // Handle Discord rate limiting (429)
      if (response.status === 429) {
        const retryAfter = parseInt(
          response.headers.get("Retry-After") ?? "5",
          10,
        );
        logger.debug(
          `[Discord] Rate limited, waiting ${retryAfter}s before retry`,
        );
        await sleep(retryAfter * 1000);
        continue;
      }

      // Non-retryable client errors (4xx except 429)
      if (response.status >= 400 && response.status < 500) {
        const errorText = await response.text();
        lastError = new Error(
          `Discord API error: ${response.status} - ${errorText}`,
        );
        break;
      }

      // Server error - will retry
      lastError = new Error(`Discord API error: ${response.status}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }

    // Wait before retry (except on last attempt)
    if (attempt < RETRY_CONFIG.maxRetries) {
      const delay = calculateDelay(attempt);
      logger.debug(
        `[Discord] Retry ${attempt + 1}/${RETRY_CONFIG.maxRetries} in ${Math.round(delay)}ms`,
      );
      await sleep(delay);
    }
  }
  /* eslint-enable no-await-in-loop */

  logger.error(`[Discord] Failed to send notification to ${channel}`, {
    error: lastError,
  });
  return { data: null, error: lastError };
}

/**
 * Fire-and-forget wrapper for sending Discord notifications
 *
 * Use this function in critical paths (webhooks, auth hooks) where
 * you don't want to block the response waiting for Discord.
 *
 * This function:
 * - Does NOT await the notification
 * - Never blocks the calling code
 * - Logs errors internally but never throws
 *
 * @param channel - The Discord channel to send to
 * @param payload - The webhook payload (embeds, content, etc.)
 */
export function sendDiscordNotificationAsync(
  channel: DiscordChannel,
  payload: DiscordWebhookPayload,
): void {
  // Intentionally not awaited - fire and forget
  sendDiscordNotification(channel, payload).catch((error: unknown) => {
    // This should never happen since sendDiscordNotification never throws
    logger.error(`[Discord] Unexpected error in async notification`, { error });
  });
}
