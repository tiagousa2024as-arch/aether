"use client";

import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc/client";
import { PageHeader } from "@/components/layout/page-header";
import { Bot, Search, Code2, Workflow, Brain, Loader2 } from "lucide-react";

const AGENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  research: Search,
  code: Code2,
  automation: Workflow,
  memory: Brain,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
};

export default function AgentsPage() {
  const { data: agents, isLoading } = trpc.agent.listAgents.useQuery();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agents"
        description="AI agents that run your task steps. Each agent handles a specific type of work in the pipeline."
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2"
        >
          {agents?.map((agent) => {
            const Icon = AGENT_ICONS[agent.type] ?? Bot;
            return (
              <motion.div
                key={agent.type}
                variants={item}
                className="card-hover flex gap-4 rounded-xl border border-border bg-card p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-medium text-foreground">{agent.name}</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {agent.description}
                  </p>
                  <span className="mt-2 inline-block text-xs font-medium capitalize text-muted-foreground">
                    {agent.type}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
                    Ready
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
