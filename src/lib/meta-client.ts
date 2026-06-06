"use client";

/* eslint-disable no-console -- Client-side logging for debugging Meta events */

/**
 * @fileoverview Meta Pixel client-side utilities
 *
 * Ce module fournit les utilitaires pour le tracking Meta Pixel côté navigateur.
 *
 * ## Fonctionnalités principales :
 * - Génération d'event_id unique pour la déduplication
 * - Extraction des cookies Meta (_fbp, _fbc)
 * - Envoi unifié vers Pixel browser + CAPI server
 *
 * ## Utilisation :
 * ```typescript
 * import { trackAndSend, getFbpFbc, genEventId } from "@/lib/meta-client";
 *
 * // Envoyer un événement (automatiquement dédupliqué)
 * await trackAndSend("ViewContent", {
 *   currency: "USD",
 *   value: 29.99,
 *   content_type: "product",
 * });
 * ```
 */

/**
 * Génère un ID d'événement unique pour la déduplication Meta
 * Meta utilise cet ID pour dédupliquer les événements browser/server
 */
export function genEventId(): string {
  return crypto.randomUUID();
}

/**
 * Récupère un cookie par son nom
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() ?? null;
  }
  return null;
}

/**
 * Récupère les cookies Meta Pixel (_fbp et _fbc)
 *
 * - _fbp : identifiant unique du navigateur créé par Meta Pixel
 * - _fbc : contient le fbclid si l'utilisateur vient d'une pub Facebook
 */
export function getFbpFbc(): { fbp: string | null; fbc: string | null } {
  return {
    fbp: getCookie("_fbp"),
    fbc: getCookie("_fbc"),
  };
}

/**
 * Payload pour les événements Meta
 */
type MetaEventPayload = {
  email?: string;
  phone?: string;
  external_id?: string;
  currency?: string;
  value?: number;
  contents?: {
    id: string;
    quantity?: number;
    item_price?: number;
  }[];
  content_type?: string;
  userId?: string;
};

/**
 * Envoie un événement à la fois au Meta Pixel (browser) et à la CAPI (server)
 *
 * IMPORTANT : Cette fonction utilise le même event_id pour les deux envois,
 * ce qui permet à Meta de dédupliquer automatiquement les événements.
 *
 * @param eventName - Nom de l'événement (ViewContent, Purchase, etc.)
 * @param payload - Données de l'événement
 * @returns Succès ou erreur
 */
export async function trackAndSend(
  eventName: string,
  payload?: MetaEventPayload,
): Promise<{ success: boolean; error?: string }> {
  // Validation du nom d'événement
  if (
    !eventName ||
    typeof eventName !== "string" ||
    eventName.trim().length === 0
  ) {
    const error = `[Meta] Invalid event name: "${eventName}". Event not sent.`;
    console.error(error);
    return { success: false, error };
  }

  const event_id = genEventId();
  const { fbp, fbc } = getFbpFbc();

  try {
    // 1. Envoyer au Meta Pixel (browser)
    if (typeof window !== "undefined" && window.fbq) {
      try {
        window.fbq("track", eventName, payload ?? {}, { eventID: event_id });
      } catch (fbqError) {
        console.warn("[Meta] Pixel tracking failed:", fbqError);
        // Continuer vers CAPI même si le Pixel échoue
      }
    }

    // 2. Envoyer à la CAPI (server) via notre API
    const response = await fetch("/api/meta/capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        event_id,
        fbp,
        fbc,
        payload,
      }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      console.error("[Meta] CAPI error:", data.error);
      return { success: false, error: data.error };
    }

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[Meta] Track and send error:", errorMessage);
    // Ne pas bloquer l'UX - juste logger l'erreur
    return { success: false, error: errorMessage };
  }
}

// Extension du type Window pour TypeScript
declare global {
  interface Window {
    fbq?: (
      action: string,
      eventName: string,
      payload?: Record<string, unknown>,
      options?: { eventID?: string },
    ) => void;
  }
}
