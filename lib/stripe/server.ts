/**
 * Stripe server (Node) - For API routes and webhooks.
 * Use STRIPE_SECRET_KEY; create checkout/portal sessions, verify webhooks.
 */

import Stripe from "stripe";

function createStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, {
    apiVersion: "2025-02-24.acacia",
    typescript: true,
  });
}

export const stripe: Stripe | null = createStripe();
