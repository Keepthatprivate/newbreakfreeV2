/**
 * Discord Notification System - Signup Notifications
 *
 * Notifications for new user registrations.
 */

import { SiteConfig } from "@/site-config";

import { sendDiscordNotificationAsync } from "../send-notification";
import {
  DISCORD_CHANNELS,
  DISCORD_COLORS,
  type DiscordWebhookPayload,
} from "../discord.types";

export type UserSignupParams = {
  userId: string;
  email: string;
  name?: string | null;
  provider?: string;
};

/**
 * Mask email for privacy in Discord notifications
 * "john@example.com" -> "jo***@example.com"
 */
function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return "***@***";

  const visibleChars = Math.min(2, localPart.length);
  const masked = `${localPart.slice(0, visibleChars)  }***`;
  return `${masked}@${domain}`;
}

/**
 * Notify when a new user signs up
 */
export function notifyUserSignup(params: UserSignupParams): void {
  const { email, name, provider } = params;

  const maskedEmail = maskEmail(email);

  const fields = [{ name: "Email", value: maskedEmail, inline: true }];

  if (name) {
    fields.push({ name: "Name", value: name, inline: true });
  }

  if (provider) {
    fields.push({ name: "Method", value: provider, inline: true });
  }

  const description = name
    ? `${name} joined ${SiteConfig.title}`
    : `A new user joined ${SiteConfig.title}`;

  const payload: DiscordWebhookPayload = {
    username: `${SiteConfig.title} Signups`,
    embeds: [
      {
        title: "New User Signup",
        description,
        color: DISCORD_COLORS.SUCCESS,
        fields,
        timestamp: new Date().toISOString(),
      },
    ],
  };

  sendDiscordNotificationAsync(DISCORD_CHANNELS.SIGNUP, payload);
}
