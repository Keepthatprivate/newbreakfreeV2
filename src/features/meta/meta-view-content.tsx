"use client";

import { trackAndSend } from "@/lib/meta-client";
import { useEffect, useRef } from "react";

type MetaViewContentProps = {
  pageName: string;
  value?: number;
  currency?: string;
  contentType?: string;
};

/**
 * Composant invisible qui envoie un événement ViewContent au chargement
 * Utiliser sur les pages produit/paywall
 *
 * @example
 * ```tsx
 * // Dans une page
 * export default function PricingPage() {
 *   return (
 *     <>
 *       <MetaViewContent pageName="pricing" value={29.99} currency="EUR" />
 *       <PricingContent />
 *     </>
 *   );
 * }
 * ```
 */
export function MetaViewContent({
  pageName,
  value = 0,
  currency = "EUR",
  contentType = "product",
}: MetaViewContentProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    trackAndSend("ViewContent", {
      currency,
      value,
      content_type: contentType,
    }).catch(() => {
      // Silently fail - don't block UX
    });
  }, [pageName, value, currency, contentType]);

  return null;
}
