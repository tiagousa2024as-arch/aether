/**
 * Create Stripe Checkout session - POST /api/stripe/create-checkout.
 * Creates session for subscription or one-time; redirect to Stripe Checkout.
 */

export async function POST(request: Request) {
  return new Response("Create checkout - wire to Stripe");
}
