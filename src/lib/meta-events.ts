import { logger } from "@/lib/logger";
import { buildUserData, postCapiEvent } from "@/lib/meta-capi";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

/**
 * @fileoverview Meta Events for Stripe integration
 *
 * Ce module gère l'envoi des événements Purchase à Meta
 * lors des webhooks Stripe.
 */

/**
 * Envoie un événement Purchase Meta pour une Checkout Session complétée
 * Utilise CheckoutLinkage pour éviter les doublons
 */
export async function sendMetaPurchaseEvent(
  session: Stripe.Checkout.Session,
): Promise<void> {
  const sessionId = session.id;

  // Vérifier si déjà envoyé
  const existingLinkage = await prisma.checkoutLinkage.findUnique({
    where: { stripeSessionId: sessionId },
  });

  if (existingLinkage?.purchaseSent) {
    logger.info(`[MetaEvents] Purchase event already sent for: ${sessionId}`);
    return;
  }

  try {
    const event_id = existingLinkage?.fbEventId ?? `purchase-${sessionId}`;
    const currency = (session.currency ?? "eur").toUpperCase();
    const value = (session.amount_total ?? 0) / 100; // Centimes → euros

    // Construire les données utilisateur
    const userData = buildUserData({
      fbp:
        existingLinkage?.fbp ??
        (session.metadata?.fbp as string | undefined) ??
        undefined,
      fbc:
        existingLinkage?.fbc ??
        (session.metadata?.fbc as string | undefined) ??
        undefined,
      email: session.customer_email ?? undefined,
      externalId:
        (session.metadata?.userId as string | undefined) ??
        existingLinkage?.userId ??
        undefined,
      ip:
        existingLinkage?.clientIp ??
        (session.metadata?.clientIp as string | undefined) ??
        undefined,
      userAgent:
        existingLinkage?.userAgent ??
        (session.metadata?.clientUserAgent as string | undefined) ??
        undefined,
    });

    // Construire les données produit
    const customData = {
      currency,
      value,
      contents: [
        {
          id: (session.metadata?.plan as string | undefined) ?? "subscription",
          quantity: 1,
          item_price: value,
        },
      ],
      content_type: "product" as const,
    };

    // Envoyer à Meta CAPI
    const result = await postCapiEvent({
      eventName: "Purchase",
      eventId: event_id,
      userData,
      customData,
    });

    // Mettre à jour ou créer le CheckoutLinkage
    if (existingLinkage) {
      await prisma.checkoutLinkage.update({
        where: { id: existingLinkage.id },
        data: {
          purchaseSent: result.success,
          purchaseSentAt: result.success ? new Date() : undefined,
        },
      });
    } else {
      await prisma.checkoutLinkage.create({
        data: {
          stripeSessionId: sessionId,
          fbEventId: event_id,
          userId: session.metadata?.userId ?? undefined,
          fbp: (session.metadata?.fbp as string | undefined) ?? undefined,
          fbc: (session.metadata?.fbc as string | undefined) ?? undefined,
          clientIp:
            (session.metadata?.clientIp as string | undefined) ?? undefined,
          userAgent:
            (session.metadata?.clientUserAgent as string | undefined) ??
            undefined,
          purchaseSent: result.success,
          purchaseSentAt: result.success ? new Date() : undefined,
        },
      });
    }

    // Logger l'événement
    await prisma.eventLog.create({
      data: {
        eventName: "Purchase",
        eventId: event_id,
        source: "webhook",
        requestJson: {
          stripeSessionId: sessionId,
          currency,
          value,
          userId: session.metadata?.userId,
        },
        responseJson: result.response,
        statusCode: result.success ? 200 : 500,
        success: result.success,
      },
    });

    if (result.success) {
      logger.info(`[MetaEvents] Purchase sent for: ${sessionId}`);
    } else {
      logger.error(
        `[MetaEvents] Purchase failed for: ${sessionId} - ${result.error}`,
      );
    }
  } catch (error) {
    logger.error(`[MetaEvents] Error for session ${sessionId}:`, error);
  }
}
