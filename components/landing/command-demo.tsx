"use client";

import { motion } from "framer-motion";
import { MessageSquare, Zap, CheckCircle2 } from "lucide-react";

const DEMO_COMMANDS = [
  { text: "Summarize my unread emails and flag urgent items", icon: MessageSquare },
  { text: "Draft a project brief from my notes and calendar", icon: Zap },
  { text: "Prepare my weekly standup and block focus time", icon: CheckCircle2 },
];

export function CommandDemo() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Just say what you need
          </h2>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Natural language commands. No scripts, no forms. Your AI layer understands context and executes in one step.
          </p>
        </motion.div>

        <div className="space-y-4">
          {DEMO_COMMANDS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group flex items-center gap-4 p-4 sm:p-5 rounded-2xl glass border border-white/10 hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-white/10 text-violet-300 group-hover:from-violet-500/30 group-hover:to-blue-500/30 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-white/90 font-medium text-base sm:text-lg flex-1">
                  &ldquo;{item.text}&rdquo;
                </p>
                <span className="text-sm text-white/40 group-hover:text-cyan-400/80 transition-colors">
                  One tap →
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
