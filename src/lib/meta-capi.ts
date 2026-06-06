import crypto from "crypto";

import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

/**
 * @fileoverview Meta Conversions API (CAPI) server-side utilities
 *
 * Ce module gère l'envoi d'événements vers l'API Graph de Meta côté serveur.
 *
 * ## Pourquoi la CAPI ?
 * - Les bloqueurs de pubs bloquent le Pixel browser
 * - iOS 14+ limite le tracking côté client
 * - Améliore l'Event Match Quality (EMQ) de +20%
 *
 * ## Sécurité :
 * - Toutes les PII (email, phone) sont hashées SHA-256 AVANT envoi
 * - Meta ne reçoit JAMAIS les données en clair
 */

/**
 * Hash une valeur avec SHA-256 (requis par Meta pour les PII)
 */
export function hashSha256(value: string): string {
  return crypto
    .createHash("sha256")
    .update(value.toLowerCase().trim())
    .digest("hex");
}

/**
 * Données utilisateur pour Meta CAPI
 * Tous les champs PII (em, ph, external_id) sont des hashes SHA-256
 */
type UserData = {
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string; // Cookie _fbp (non hashé)
  fbc?: string; // Cookie _fbc (non hashé)
  em?: string; // Email hashé SHA-256
  ph?: string; // Téléphone hashé SHA-256
  external_id?: string; // ID utilisateur hashé SHA-256
};

/**
 * Données personnalisées pour les événements (montants, produits, etc.)
 */
type CustomData = {
  currency?: string;
  value?: number;
  content_type?: string;
  contents?: {
    id: string;
    quantity?: number;
    item_price?: number;
  }[];
  content_ids?: string[];
  content_name?: string;
  content_category?: string;
  num_items?: number;
};

/**
 * Arguments pour construire les données utilisateur
 */
export type BuildUserDataArgs = {
  ip?: string;
  userAgent?: string;
  fbp?: string | null;
  fbc?: string | null;
  email?: string;
  phone?: string;
  externalId?: string;
};

/**
 * Construit l'objet userData pour Meta CAPI
 * Hash automatiquement les PII
 */
export function buildUserData(args: BuildUserDataArgs): UserData {
  const userData: UserData = {};

  if (args.ip) userData.client_ip_address = args.ip;
  if (args.userAgent) userData.client_user_agent = args.userAgent;
  if (args.fbp) userData.fbp = args.fbp;
  if (args.fbc) userData.fbc = args.fbc;
  if (args.email) userData.em = hashSha256(args.email);
  if (args.phone) userData.ph = hashSha256(args.phone);
  if (args.externalId) userData.external_id = hashSha256(args.externalId);

  return userData;
}

/**
 * Arguments pour poster un événement CAPI
 */
export type PostCapiEventArgs = {
  eventName: string;
  eventId: string;
  userData: UserData;
  customData?: CustomData;
  eventTime?: number; // timestamp Unix en secondes
};

type MetaCapiResponse = {
  events_received?: number;
  messages?: string[];
  fbtrace_id?: string;
};

// Délais de retry exponentiels (millisecondes)
const RETRY_DELAYS = [250, 750, 1500];
const MAX_RETRIES = 3;

/**
 * Envoie un événement à l'API Graph Meta avec logique de retry
 *
 * @param args - Paramètres de l'événement
 * @returns Succès/échec avec réponse ou erreur
 */
export async function postCapiEvent(
  args: PostCapiEventArgs,
): Promise<{ success: boolean; response?: MetaCapiResponse; error?: string }> {
  const { eventName, eventId, userData, customData, eventTime } = args;

  // Skip en développement si pas de credentials
  if (env.NODE_ENV === "development") {
    logger.debug(
      `Meta CAPI: Skipped in development - ${eventName} (ID: ${eventId})`,
    );
    return {
      success: true,
      response: { events_received: 1, messages: ["Skipped in development"] },
    };
  }

  const pixelId = env.FB_PIXEL_ID;
  const accessToken = env.FB_CAPI_TOKEN;
  const graphVersion = env.FB_GRAPH_VERSION;

  if (!pixelId || !accessToken) {
    logger.warn("Meta CAPI: Missing FB_PIXEL_ID or FB_CAPI_TOKEN - skipping");
    return { success: true, response: { messages: ["Configuration missing"] } };
  }

  const url = `https://graph.facebook.com/${graphVersion}/${pixelId}/events?access_token=${accessToken}`;

  const eventPayload = {
    event_name: eventName,
    event_time: eventTime ?? Math.floor(Date.now() / 1000),
    event_id: eventId,
    action_source: "website",
    user_data: userData,
    ...(customData &&
      Object.keys(customData).length > 0 && { custom_data: customData }),
  };

  const payload = { data: [eventPayload] };

  logger.info(`Meta CAPI: Sending event ${eventName} with ID ${eventId}`);

  let lastError: string | null = null;

  /* eslint-disable no-await-in-loop -- Intentional sequential retry logic */
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      logger.info(
        `Meta CAPI: Attempt ${attempt + 1}/${MAX_RETRIES} for event ${eventName}`,
      );

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = (await response.json()) as MetaCapiResponse;

      if (!response.ok) {
        throw new Error(
          `Meta API returned ${response.status}: ${JSON.stringify(responseData)}`,
        );
      }

      logger.info(`Meta CAPI: Success for event ${eventName}`, {
        eventsReceived: responseData.events_received,
        fbtraceId: responseData.fbtrace_id,
      });

      return { success: true, response: responseData };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      lastError = errorMessage;

      logger.warn(
        `Meta CAPI: Attempt ${attempt + 1}/${MAX_RETRIES} failed: ${errorMessage}`,
      );

      // Si pas la dernière tentative, attendre avant de retry
      if (attempt < MAX_RETRIES - 1) {
        const delay = RETRY_DELAYS[attempt];
        logger.info(`Meta CAPI: Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  /* eslint-enable no-await-in-loop */

  logger.error(
    `Meta CAPI: All retries failed for event ${eventName}: ${lastError}`,
  );
  return { success: false, error: lastError ?? "Unknown error" };
}
