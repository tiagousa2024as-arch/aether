"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";
import {
  ListChecks,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
} from "lucide-react";

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    className: "text-emerald-500",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    className: "text-destructive",
  },
  running: {
    icon: Loader2,
    label: "Running",
    className: "text-primary",
  },
  pending: {
    icon: Clock,
    label: "Pending",
    className: "text-muted-foreground",
  },
} as const;

export default function TasksPage() {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  const { data, isLoading } = trpc.task.listRuns.useQuery({ limit: 30 });

  const { data: runDetail, isLoading: isLoadingDetail } =
    trpc.task.getRun.useQuery(
      { runId: selectedRunId! },
      { enabled: !!selectedRunId }
    );

  const runs = data?.runs ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Execution history from the command center. Click a run to see steps and results."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-medium text-foreground">Recent runs</h2>
          </div>
          <div className="divide-y divide-border">
            {isLoading ? (
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : runs.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No task runs yet. Create a plan in the Command center and run the pipeline.
              </div>
            ) : (
              <div className="divide-y divide-border">
              {runs.map((run, i) => {
                const config = statusConfig[run.status as keyof typeof statusConfig] ?? statusConfig.pending;
                const Icon = config.icon;
                return (
                  <motion.button
                    key={run.id}
                    type="button"
                    onClick={() => setSelectedRunId(run.id)}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className={cn(
                      "card-hover flex w-full items-center gap-3 px-4 py-3 text-left",
                      selectedRunId === run.id && "bg-primary/10"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-md shrink-0",
                        run.status === "completed" && "bg-emerald-500/20",
                        run.status === "failed" && "bg-destructive/20",
                        run.status === "running" && "bg-blue-500/20",
                        run.status === "pending" && "bg-muted",
                        config.className
                      )}
                    >
                      {run.status === "running" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {run.command}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(run.startedAt).toLocaleString()} · {run.stepCount} steps
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </motion.button>
                );
              })}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-medium text-foreground">Run details</h2>
            {selectedRunId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRunId(null)}
              >
                Clear
              </Button>
            )}
          </div>
          <div className="p-5">
            {!selectedRunId ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Select a run from the list
              </p>
            ) : isLoadingDetail ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : !runDetail ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Run not found
              </p>
            ) : (
              <div className="space-y-5">
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Command
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {runDetail.command}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {(() => {
                    const config =
                      statusConfig[runDetail.status as keyof typeof statusConfig] ??
                      statusConfig.pending;
                    const Icon = config.icon;
                    return (
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                          runDetail.status === "completed" && "bg-emerald-500/15 text-emerald-500",
                          runDetail.status === "failed" && "bg-destructive/15 text-destructive",
                          runDetail.status === "running" && "bg-primary/15 text-primary",
                          runDetail.status === "pending" && "bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {config.label}
                      </span>
                    );
                  })()}
                  <span className="text-xs text-muted-foreground">
                    Started {new Date(runDetail.startedAt).toLocaleString()}
                  </span>
                  {runDetail.completedAt && (
                    <span className="text-xs text-muted-foreground">
                      Completed {new Date(runDetail.completedAt).toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="rounded-lg border border-border bg-muted/20 px-3 py-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Agents used
                  </p>
                  <p className="mt-0.5 text-sm text-foreground">
                    {runDetail.steps.map((s) => s.type).join(" → ")}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Execution log
                  </p>
                  <ul className="space-y-2">
                    {runDetail.steps.map((step, i) => {
                      const result = runDetail.stepResults.find(
                        (r) => r.stepId === step.id
                      );
                      const resConfig = result
                        ? statusConfig[result.status as keyof typeof statusConfig]
                        : statusConfig.pending;
                      const ResIcon = resConfig.icon;
                      return (
                        <li
                          key={step.id}
                          className="rounded-lg border border-border bg-card p-3 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <ResIcon
                              className={cn(
                                "h-4 w-4 shrink-0",
                                resConfig.className,
                                result?.status === "running" && "animate-spin"
                              )}
                            />
                            <span className="font-medium text-foreground">
                              {step.title}
                            </span>
                            <span className="text-xs capitalize text-muted-foreground">
                              {step.type}
                            </span>
                            {result?.durationMs != null && result.status === "completed" && (
                              <span className="ml-auto text-xs text-muted-foreground">
                                {result.durationMs}ms
                              </span>
                            )}
                          </div>
                          {result?.output && (
                            <p className="mt-2 whitespace-pre-wrap rounded border border-border bg-background/50 p-2 text-xs text-muted-foreground">
                              {result.output}
                            </p>
                          )}
                          {result?.error && (
                            <p className="mt-2 text-xs text-destructive">
                              {result.error}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
