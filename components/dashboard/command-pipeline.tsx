"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ListTodo,
  Search,
  Code2,
  Workflow,
  Brain,
  CheckCircle2,
  XCircle,
  Loader2,
  Circle,
} from "lucide-react";

const PIPELINE_AGENTS = [
  { key: "planner", label: "Planner", icon: ListTodo },
  { key: "research", label: "Research", icon: Search },
  { key: "code", label: "Code", icon: Code2 },
  { key: "automation", label: "Automation", icon: Workflow },
  { key: "memory", label: "Memory", icon: Brain },
] as const;

type StepStatus = "pending" | "running" | "completed" | "failed";

export interface PipelineStepState {
  id: string;
  type: string;
  title: string;
  status: StepStatus;
  order: number;
}

interface CommandPipelineProps {
  steps: PipelineStepState[];
  className?: string;
}

export function CommandPipeline({ steps, className }: CommandPipelineProps) {
  const ordered = [...steps].sort((a, b) => a.order - b.order);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-0 rounded-xl border border-border bg-card/50 p-6",
        className
      )}
    >
      <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Execution pipeline
      </p>
      <div className="flex flex-col items-center gap-0">
        {ordered.map((step, index) => {
          const config = PIPELINE_AGENTS.find((a) => a.key === step.type) ?? {
            key: step.type,
            label: step.type,
            icon: Circle,
          };
          const Icon = config.icon;
          const isLast = index === ordered.length - 1;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08, duration: 0.25 }}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-4 py-2.5 transition-colors",
                  step.status === "completed" &&
                    "border-emerald-500/30 bg-emerald-500/10",
                  step.status === "failed" &&
                    "border-destructive/30 bg-destructive/10",
                  step.status === "running" &&
                    "border-primary/40 bg-primary/10",
                  step.status === "pending" &&
                    "border-border bg-muted/30"
                )}
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    step.status === "completed" && "text-emerald-500",
                    step.status === "failed" && "text-destructive",
                    step.status === "running" && "text-primary",
                    step.status === "pending" && "text-muted-foreground"
                  )}
                >
                  {step.status === "completed" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : step.status === "failed" ? (
                    <XCircle className="h-5 w-5" />
                  ) : step.status === "running" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">
                    {step.title}
                  </p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {config.label} · {step.status}
                  </p>
                </div>
              </motion.div>
              {!isLast && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 12 }}
                  transition={{ delay: index * 0.08 + 0.1 }}
                  className="w-0.5 flex-shrink-0 bg-border"
                  style={{ minHeight: 12 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
