import { buildUserData, hashSha256, postCapiEvent } from "@/lib/meta-capi";
import { prisma } from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * @fileoverview API endpoint pour Meta CAPI
 *
 * Reçoit les événements du client et les transmet à Meta Graph API
 * avec validation, rate limiting, et logging en base de données.
 */

const ALLOWED_EVENTS = [
  "ViewContent",
  "InitiateCheckout",
  "CompleteRegistration",
  "Purchase",
  "AddPaymentInfo",
] as const;

const EventPayloadSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  external_id: z.string().optional(),
  currency: z.string().length(3).optional(),
  value: z.number().positive().optional(),
  contents: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.number().optional(),
        item_price: z.number().optional(),
      }),
    )
    .optional(),
  content_type: z.string().optional(),
  userId: z.string().optional(),
});

const CapiRequestSchema = z.object({
  eventName: z.enum(ALLOWED_EVENTS),
  event_id: z.string().min(1),
  fbp: z.string().nullable().optional(),
  fbc: z.string().nullable().optional(),
  payload: EventPayloadSchema.optional(),
});

// Rate limiter simple en mémoire
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60; // requêtes par minute
const RATE_LIMIT_WINDOW = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}

// Nettoyage toutes les 5 minutes
if (typeof globalThis !== "undefined") {
  const cleanupInterval = setInterval(
    () => {
      const now = Date.now();
      for (const [ip, record] of rateLimitMap.entries()) {
        if (now > record.resetAt) rateLimitMap.delete(ip);
      }
    },
    5 * 60 * 1000,
  );

  // Éviter les fuites de mémoire en développement avec HMR
  if (process.env.NODE_ENV === "development") {
    // @ts-expect-error - Global cleanup for HMR
    globalThis.__metaCapiCleanupInterval?.unref?.();
    // @ts-expect-error - Global cleanup for HMR
    globalThis.__metaCapiCleanupInterval = cleanupInterval;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();
    const parsed = CapiRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid request" },
        { status: 400 },
      );
    }

    const { eventName, event_id, fbp, fbc, payload } = parsed.data;

    // Récupérer IP et User Agent
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";
    const ua = req.headers.get("user-agent") ?? "unknown";

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { ok: false, error: "Rate limit exceeded" },
        { status: 429 },
      );
    }

    // Hasher les données sensibles
    const emailHash = payload?.email ? hashSha256(payload.email) : undefined;
    const phoneHash = payload?.phone ? hashSha256(payload.phone) : undefined;
    const externalIdHash = payload?.external_id
      ? hashSha256(payload.external_id)
      : undefined;

    // Trouver ou créer une session de tracking
    let trackingSession = await prisma.trackingSession.findFirst({
      where: {
        OR: [
          ...(fbp ? [{ fbp }] : []),
          ...(payload?.userId ? [{ userId: payload.userId }] : []),
        ],
      },
      orderBy: { updatedAt: "desc" },
    });

    if (!trackingSession && (fbp ?? payload?.userId)) {
      trackingSession = await prisma.trackingSession.create({
        data: {
          fbp: fbp ?? undefined,
          fbc: fbc ?? undefined,
          userAgent: ua !== "unknown" ? ua : undefined,
          ip: ip !== "unknown" ? ip : undefined,
          userId: payload?.userId,
          emailHash,
          phoneHash,
          externalIdHash,
          lastEventAt: new Date(),
          eventCount: 1,
        },
      });
    } else if (trackingSession) {
      trackingSession = await prisma.trackingSession.update({
        where: { id: trackingSession.id },
        data: {
          fbp: fbp ?? trackingSession.fbp,
          fbc: fbc ?? trackingSession.fbc,
          userAgent: ua !== "unknown" ? ua : trackingSession.userAgent,
          ip: ip !== "unknown" ? ip : trackingSession.ip,
          emailHash: emailHash ?? trackingSession.emailHash,
          phoneHash: phoneHash ?? trackingSession.phoneHash,
          externalIdHash: externalIdHash ?? trackingSession.externalIdHash,
          lastEventAt: new Date(),
          eventCount: { increment: 1 },
        },
      });
    }

    // Construire les données utilisateur pour CAPI
    const userData = buildUserData({
      ip: ip !== "unknown" ? ip : undefined,
      userAgent: ua !== "unknown" ? ua : undefined,
      fbp: fbp ?? undefined,
      fbc: fbc ?? undefined,
      email: payload?.email,
      phone: payload?.phone,
      externalId: payload?.external_id,
    });

    // Construire les données personnalisées
    const customData: Record<string, unknown> = {};
    if (payload?.currency) customData.currency = payload.currency.toUpperCase();
    if (payload?.value !== undefined) customData.value = payload.value;
    if (payload?.contents) customData.contents = payload.contents;
    if (payload?.content_type) customData.content_type = payload.content_type;

    // Envoyer à Meta CAPI
    const result = await postCapiEvent({
      eventName,
      eventId: event_id,
      userData,
      customData: Object.keys(customData).length > 0 ? customData : undefined,
    });

    // Logger l'événement en base
    await prisma.eventLog.create({
      data: {
        trackingId: trackingSession?.id,
        eventName,
        eventId: event_id,
        source: "server",
        requestJson: {
          eventName,
          event_id,
          fbp,
          fbc,
          payload: {
            ...payload,
            email: payload?.email ? "[REDACTED]" : undefined,
            phone: payload?.phone ? "[REDACTED]" : undefined,
            emailHash,
            phoneHash,
            externalIdHash,
          },
        },
        responseJson: result.response,
        statusCode: result.success ? 200 : 500,
        success: result.success,
      },
    });

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { ok: true, fbtrace_id: result.response?.fbtrace_id },
      { status: 200, headers: { "X-Request-ID": event_id } },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 400 },
    );
  }
}
