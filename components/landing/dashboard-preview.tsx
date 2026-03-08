"use client";

import { motion } from "framer-motion";

const MOCK_ITEMS = [
  { label: "Organize work tomorrow", status: "Done", time: "2m ago" },
  { label: "Draft Q2 summary", status: "Running", time: "Just now" },
  { label: "Summarize standup notes", status: "Queued", time: "—" },
];

export function DashboardPreview() {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Your mission control
          </h2>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            One dashboard to see all tasks, agents, and outcomes. No sprawl—just clarity.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden glass-strong border border-white/20 shadow-2xl"
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-amber-500/60" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs font-medium">
                app.aether.io/dashboard
              </div>
            </div>
            <div className="w-12" />
          </div>

          {/* Mock content */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-white/[0.03] to-transparent">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-9 w-48 rounded-lg bg-white/10" />
              <div className="h-9 w-24 rounded-lg bg-white/5" />
              <div className="h-9 w-24 rounded-lg bg-white/5" />
            </div>

            <div className="space-y-2">
              {MOCK_ITEMS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex items-center gap-4 py-3 px-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400/80 shrink-0" />
                  <span className="text-white/90 font-medium flex-1 text-sm sm:text-base">
                    {item.label}
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                      item.status === "Done"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : item.status === "Running"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs text-white/40 w-14 text-right">
                    {item.time}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              <div className="h-10 flex-1 max-w-[200px] rounded-lg bg-white/10" />
              <div className="h-10 w-10 rounded-lg bg-violet-500/30 border border-violet-400/30" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
