"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Try the command center and core agents.",
    features: [
      "Up to 50 tasks / month",
      "3 agents (Writer, Researcher, Scheduler)",
      "1 workspace",
      "Community support",
    ],
    cta: "Get started",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For individuals and small teams.",
    features: [
      "Unlimited tasks",
      "All agents + custom agents",
      "Unlimited workspaces",
      "Memory & automations",
      "Priority support",
    ],
    cta: "Start free trial",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Security, SSO, and dedicated support.",
    features: [
      "Everything in Pro",
      "SSO & audit logs",
      "Dedicated success manager",
      "SLA & compliance",
    ],
    cta: "Contact sales",
    href: "/signup",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Start free. Upgrade when you need more agents and power.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative rounded-2xl p-6 sm:p-8 flex flex-col ${
                plan.highlighted
                  ? "glass-strong border-2 border-violet-500/40 bg-violet-500/5 shadow-lg shadow-violet-500/10"
                  : "glass border border-white/10"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-violet-500/90 text-white text-xs font-medium">
                  Popular
                </div>
              )}
              <h3 className="text-lg font-semibold text-white mb-1">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-semibold text-white">
                  {plan.price}
                </span>
                <span className="text-white/50 text-sm">{plan.period}</span>
              </div>
              <p className="text-sm text-white/60 mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-white/80"
                  >
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                className={`w-full rounded-xl font-semibold ${
                  plan.highlighted
                    ? "bg-white text-slate-900 hover:bg-white/90"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                }`}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
