/**
 * Stripe Customer Portal - POST /api/stripe/create-portal.
 * Creates portal session for managing subscription, payment method, invoices.
 */

import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json().catch(() => ({}));
    const returnUrl = (body.returnUrl as string) ?? undefined;

    const stripe = (await import("@/lib/stripe/server")).stripe;
    if (!stripe) {
      return NextResponse.json(
        { error: "Billing is not configured. Set STRIPE_SECRET_KEY." },
        { status: 503 }
      );
    }

    const { url } = await stripe.billingPortal.sessions.create({
      customer_email: session.user.email,
      return_url: returnUrl ?? undefined,
    });
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Stripe portal error:", err);
    return NextResponse.json(
      { error: "Failed to create billing portal session" },
      { status: 500 }
    );
  }
}
