"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight } from "lucide-react";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    // Simulate submit - wire to your API later
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 800);
  };

  return (
    <section className="relative py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl p-8 sm:p-12 text-center glass-strong border border-white/20 glow"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/30 to-cyan-500/30 border border-white/20 text-white mb-6">
            <Mail className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-3">
            Join the waitlist
          </h2>
          <p className="text-white/60 mb-8">
            Be the first to get early access and product updates.
          </p>

          {status === "success" ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-emerald-400 font-medium"
            >
              You&apos;re on the list. We&apos;ll be in touch.
            </motion.p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="h-12 rounded-xl bg-white/5 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-violet-500/50 pl-4 pr-4"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={status === "loading"}
                className="h-12 px-6 rounded-xl bg-white text-slate-900 hover:bg-white/90 font-semibold shrink-0"
              >
                {status === "loading" ? (
                  "Joining…"
                ) : (
                  <>
                    Join
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
