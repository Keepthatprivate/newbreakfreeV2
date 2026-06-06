# CLAUDE.md

This file provides guidance to AI Agents.

## About the project — Break Free

Break Free is an emotionally-driven quiz funnel that assesses childhood trauma patterns through an interactive, multi-format questionnaire. It guides users through 4 chapters (Your Past, Your Patterns, Your Healing, Your Future) and converts visitors into paying customers for a healing app.

**Main features:**
- Interactive quiz (radio, sliders, emoji, image questions)
- Email capture (contact form)
- Personalized results page
- Donation page
- Subscription checkout (Stripe — trial + upsells)
- Facebook CAPI server-side tracking (properly deduped with browser pixel)

**Goal:** Fix broken tracking from v1, rebuild on clean Next.js/Vercel stack.

## Development Commands

### Core Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build the application
- `pnpm start` - Start production server
- `pnpm ts` - Run TypeScript type checking
- `pnpm lint` - Run ESLint with auto-fix
- `pnpm lint:ci` - Run ESLint without auto-fix for CI
- `pnpm clean` - Run lint, type check, and format code
- `pnpm format` - Format code with Prettier

### Testing Commands

**CRITICAL - ALWAYS use CI commands for testing (non-interactive mode):**

- **ALWAYS run `pnpm test:ci`** - Run unit tests in CI mode
- **ALWAYS run `pnpm test:e2e:ci`** - Run e2e tests in CI mode (headless)

**NEVER run these interactive commands:**
- **NEVER** `pnpm test`
- **NEVER** `pnpm test:e2e`

### Database Commands

- `pnpm prisma:seed` - Seed the database
- `pnpm better-auth:migrate` - Generate better-auth Prisma schema

### Development Tools

- `pnpm stripe-webhooks` - Listen for Stripe webhooks

## Architecture Overview

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS v4 with Shadcn/UI
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth
- **Email**: React Email with Resend
- **Payments**: Stripe (subscription trial + upsells)
- **Tracking**: Meta Pixel (browser) + CAPI (server-side) with shared event_id for deduplication
- **Package Manager**: pnpm

### Quiz Funnel Flow

Landing → Quiz (4 chapters) → Contact Form → Loading → Trauma Patterns → Donation → Results → Benefits → 7 Days → Plan Help → Trust → Testimonials → Timeline → FAQ → **Checkout (Stripe)** → Upsells (Guides / Masterclass / Journal)

### Tracking Architecture (CRITICAL)

Every event must have a **shared event_id** between browser pixel and server CAPI to allow Meta deduplication:

1. Browser generates `event_id = crypto.randomUUID()`
2. Browser fires `fbq('track', 'EventName', data, { eventID: event_id })`
3. Browser sends `event_id` to server via API
4. Server sends same `event_id` to CAPI → Meta deduplicates correctly

### Key files

- `src/features/quiz/` — All quiz components and logic (migrated from v1)
- `src/features/analytics/meta-pixel.tsx` — Browser pixel (already in template)
- `app/api/capi/` — Server-side CAPI endpoints (to build)
- `app/api/webhook/stripe/` — Stripe webhook → Purchase event (to build)
