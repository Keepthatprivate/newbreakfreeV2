# Discord Notification System

Production-ready Discord webhook notifications with:

- Multi-channel webhooks
- Automatic retry with exponential backoff
- Fire-and-forget pattern (non-blocking)
- TypeScript strict types
- Never throws - graceful degradation

## Setup

### 1. Add Environment Variables

Add to `.env`:

```bash
# Discord Webhooks (optional - leave empty to disable)
DISCORD_WEBHOOK_PAYMENT=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_PAYMENT_FAILED=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_SIGNUP=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_SUBSCRIPTION_CANCELED=https://discord.com/api/webhooks/...
DISCORD_WEBHOOK_TRIAL=https://discord.com/api/webhooks/...
```

### 2. Create Discord Webhooks

1. Go to your Discord server
2. Server Settings > Integrations > Webhooks
3. Create webhooks for each channel you want to use
4. Copy the webhook URLs to your `.env` file

## Usage

### Pre-built Notifications

```typescript
import {
  notifyUserSignup,
  notifySubscriptionCreated,
  notifySubscriptionCanceled,
  notifyTrialStarted,
} from "@/lib/discord";

// User signup (fire-and-forget)
notifyUserSignup({
  userId: "user_123",
  email: "john@example.com",
  name: "John Doe",
  provider: "email", // optional
});

// Subscription created
notifySubscriptionCreated({
  subscription: dbSubscription,
  planName: "Pro",
  amount: 2900, // in cents
  currency: "usd",
});

// Subscription canceled
notifySubscriptionCanceled({
  subscription: dbSubscription,
  planName: "Pro",
});

// Trial started
notifyTrialStarted({
  subscription: dbSubscription,
  organizationName: "Acme Inc",
  planName: "Pro",
  trialDays: 14,
});
```

### Custom Notifications

```typescript
import {
  sendDiscordNotificationAsync,
  DISCORD_CHANNELS,
  DISCORD_COLORS,
} from "@/lib/discord";

sendDiscordNotificationAsync(DISCORD_CHANNELS.PAYMENT, {
  username: "Custom Bot Name",
  embeds: [
    {
      title: "Custom Event",
      description: "Something happened",
      color: DISCORD_COLORS.SUCCESS,
      fields: [
        { name: "Field 1", value: "Value 1", inline: true },
        { name: "Field 2", value: "Value 2", inline: true },
      ],
      timestamp: new Date().toISOString(),
    },
  ],
});
```

## Available Channels

| Channel                  | Environment Variable                  | Purpose                 |
| ------------------------ | ------------------------------------- | ----------------------- |
| `payment`                | `DISCORD_WEBHOOK_PAYMENT`             | Successful payments     |
| `payment_failed`         | `DISCORD_WEBHOOK_PAYMENT_FAILED`      | Failed payments         |
| `signup`                 | `DISCORD_WEBHOOK_SIGNUP`              | New user registrations  |
| `subscription_canceled`  | `DISCORD_WEBHOOK_SUBSCRIPTION_CANCELED` | Subscription cancellations |
| `trial_started`          | `DISCORD_WEBHOOK_TRIAL`               | Trial starts            |
| `trial_ended`            | `DISCORD_WEBHOOK_TRIAL`               | Trial ends              |
| `trial_expired`          | `DISCORD_WEBHOOK_TRIAL`               | Trial expires           |

## Available Colors

```typescript
import { DISCORD_COLORS } from "@/lib/discord";

DISCORD_COLORS.SUCCESS;  // Green - 0x22c55e
DISCORD_COLORS.WARNING;  // Amber - 0xf59e0b
DISCORD_COLORS.ERROR;    // Red - 0xef4444
DISCORD_COLORS.INFO;     // Brand primary - 0x007291
DISCORD_COLORS.BLURPLE;  // Discord brand - 0x5865f2
DISCORD_COLORS.PREMIUM;  // Purple - 0xa855f7
```

## Best Practices

### Fire-and-Forget Pattern

Always use fire-and-forget in critical paths:

```typescript
// In webhook handlers or auth hooks
void notifyUserSignup({ ... });

// The void keyword makes the intent explicit
```

### Never Block Critical Flows

```typescript
// GOOD - Non-blocking
export async function handlePayment(payment) {
  await saveToDatabase(payment);
  notifySubscriptionCreated({ ... }); // No await
  return { success: true };
}

// BAD - Blocks response
export async function handlePayment(payment) {
  await saveToDatabase(payment);
  await sendDiscordNotification(...); // Blocks!
  return { success: true };
}
```

### Graceful Degradation

If a webhook URL is not configured, notifications silently skip:

```typescript
// This works even without DISCORD_WEBHOOK_SIGNUP configured
notifyUserSignup({ ... }); // Silent no-op if no webhook
```

## Adding New Channels

1. Add the channel type in `discord.types.ts`:

```typescript
export const DISCORD_CHANNELS = {
  // ... existing
  NEW_CHANNEL: "new_channel",
} as const;
```

2. Add the environment variable in `src/lib/env.ts`:

```typescript
DISCORD_WEBHOOK_NEW_CHANNEL: z.string().url().optional(),
```

3. Add the mapping in `discord.config.ts`:

```typescript
[DISCORD_CHANNELS.NEW_CHANNEL]: env.DISCORD_WEBHOOK_NEW_CHANNEL,
```

4. Create the notification in `notifications/new-channel.notification.ts`

5. Export from `notifications/index.ts` and `index.ts`

## Retry Behavior

- Maximum 3 retries
- Exponential backoff: ~1s, ~2s, ~4s (with jitter)
- Maximum delay capped at 10 seconds
- Rate limits (429) handled with `Retry-After` header
- Client errors (4xx except 429) are not retried

## Privacy

User emails are automatically masked in notifications:

- `john@example.com` → `jo***@example.com`
