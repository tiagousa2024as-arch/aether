/**
 * Stripe webhook - POST /api/stripe/webhook.
 * Receives checkout.session.completed, customer.subscription.*, invoice.*.
 * Verify signature with STRIPE_WEBHOOK_SECRET; update DB (subscriptions, usage).
 */

export async function POST(request: Request) {
  // Stripe webhook logic: verify signature, switch on event.type, update Prisma
  return new Response("Stripe webhook - wire to Stripe SDK");
}
