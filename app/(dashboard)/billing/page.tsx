/**
 * Billing - Stripe subscription and usage.
 * Plans: Starter, Pro, Enterprise. Payment method, invoices; upgrade/downgrade.
 */

import Link from "next/link";
import { CreditCard, ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { BillingPortalButton } from "./billing-portal-button";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "For individuals and small projects.",
    features: [
      "Up to 100 task runs / month",
      "All 5 agents (Planner, Research, Code, Automation, Memory)",
      "7-day execution history",
      "Email support",
    ],
    cta: "Get Started",
    href: "/api/stripe/create-checkout?plan=starter",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$99",
    period: "/month",
    description: "For teams and production workloads.",
    features: [
      "Unlimited task runs",
      "Priority agent execution",
      "90-day history & export",
      "Automations & integrations",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    href: "/api/stripe/create-checkout?plan=pro",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with advanced needs.",
    features: [
      "Everything in Pro",
      "Dedicated infrastructure",
      "SSO & audit logs",
      "Custom agents & SLAs",
      "Account manager",
    ],
    cta: "Contact sales",
    href: "/#pricing",
    highlighted: false,
  },
] as const;

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Billing"
        description="Manage your subscription, payment method, and invoices."
      />

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-sm font-medium text-foreground">
          Current plan
        </h2>
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
          <div>
            <p className="font-medium text-foreground">Free</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Access to command center, agents, and task history.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-500">
            <Check className="h-4 w-4" />
            Active
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Upgrade to a paid plan for higher limits and team features. Billing is
          managed securely through Stripe.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <BillingPortalButton />
          <Button variant="outline" size="sm" asChild>
            <Link href="/#pricing">
              View plans <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-medium text-foreground">Plans</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl border bg-card p-5 ${
                plan.highlighted
                  ? "border-primary/50 ring-1 ring-primary/20"
                  : "border-border"
              }`}
            >
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-foreground">
                  {plan.name}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {plan.description}
              </p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-xl font-semibold text-foreground">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </div>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-5 w-full"
                variant={plan.highlighted ? "default" : "outline"}
                size="sm"
                asChild
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
