"use client";

import { motion } from "framer-motion";
import { Bot, Cpu, GitBranch, Mail } from "lucide-react";

const AGENTS = [
  { name: "Writer", icon: Bot, color: "from-violet-500/30 to-purple-500/30", desc: "Drafts, edits, and structures content" },
  { name: "Researcher", icon: Cpu, color: "from-blue-500/30 to-cyan-500/30", desc: "Finds and synthesizes information" },
  { name: "Scheduler", icon: GitBranch, color: "from-emerald-500/30 to-teal-500/30", desc: "Manages calendar and priorities" },
  { name: "Inbox", icon: Mail, color: "from-amber-500/30 to-orange-500/30", desc: "Triage and follow-ups" },
];

export function AgentSystem() {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Specialized agents. One command center.
          </h2>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Each agent is tuned for a domain. You choose the task; Aether routes it to the right agent and keeps context.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {AGENTS.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="relative p-5 rounded-2xl glass border border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 text-center"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} border border-white/10 text-white/90 mb-3`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-white mb-1">{agent.name}</h3>
                <p className="text-xs text-white/50">{agent.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/40 text-sm mt-8"
        >
          More agents and custom agents coming soon.
        </motion.p>
      </div>
    </section>
  );
}
