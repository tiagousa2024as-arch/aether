"use client";

import { motion } from "framer-motion";
import { Layers, Workflow, Shield, Sparkles } from "lucide-react";

const FEATURES = [
  {
    icon: Layers,
    title: "Operating layer",
    description: "Aether sits between you and your tools. One interface to command everything—email, calendar, docs, and more.",
  },
  {
    icon: Workflow,
    title: "Tasks that flow",
    description: "Break work into steps, hand off to agents, and track outcomes. No more context switching.",
  },
  {
    icon: Shield,
    title: "Your data, your rules",
    description: "Memory and context stay in your workspace. We never train on your data.",
  },
  {
    icon: Sparkles,
    title: "Agents that adapt",
    description: "Specialized agents for writing, research, scheduling, and custom workflows. Add more as you grow.",
  },
];

export function ProductExplanation() {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Built for how you work
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Not another chatbot. A full AI operating layer that connects your goals to execution.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative p-6 sm:p-7 rounded-2xl glass border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 text-violet-300 mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
