"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";
import {
  Command,
  Play,
  ListTodo,
  Loader2,
  CheckCircle2,
  XCircle,
  Circle,
  Search,
  Code2,
  Workflow,
  Brain,
  ChevronRight,
} from "lucide-react";
import { CommandPipeline, type PipelineStepState } from "@/components/dashboard/command-pipeline";
import type { ExecutionPlan, TaskStep, StepResult } from "@/server/agents/types";

const AGENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  research: Search,
  code: Code2,
  automation: Workflow,
  memory: Brain,
};

function AgentIcon({ type }: { type: string }) {
  const Icon = AGENT_ICONS[type] ?? Circle;
  return <Icon className="h-4 w-4" />;
}

export default function CommandCenterPage() {
  const [command, setCommand] = useState("create a presentation about AI");
  const [plan, setPlan] = useState<ExecutionPlan | null>(null);
  const [stepResults, setStepResults] = useState<StepResult[]>([]);
  const [runningIndex, setRunningIndex] = useState<number | null>(null);

  const createPlanMutation = trpc.agent.createPlan.useMutation({
    onSuccess: (data) => {
      setPlan(data);
      setStepResults([]);
      setRunningIndex(null);
    },
  });

  const executeStepMutation = trpc.agent.executeStep.useMutation({
    onMutate: ({ step }) => {
      const idx = plan?.steps.findIndex((s) => s.id === step.id) ?? -1;
      setRunningIndex(idx);
    },
    onSuccess: (result) => {
      setStepResults((prev) => [...prev, result]);
      setRunningIndex(null);
    },
    onError: () => {
      setRunningIndex(null);
    },
  });

  const startTaskRunMutation = trpc.agent.startTaskRun.useMutation();
  const completeTaskRunMutation = trpc.agent.completeTaskRun.useMutation();

  const handleGeneratePlan = () => {
    createPlanMutation.mutate({ command });
  };

  const handleRunPlan = async () => {
    if (!plan) return;
    setStepResults([]);
    const { taskRunId } = await startTaskRunMutation.mutateAsync({
      planId: plan.id,
    });
    const sortedSteps = [...plan.steps].sort((a, b) => a.order - b.order);
    const accumulated: StepResult[] = [];
    let finalStatus: "completed" | "failed" = "completed";
    for (let i = 0; i < sortedSteps.length; i++) {
      const step = sortedSteps[i];
      const context = {
        planId: plan.id,
        command: plan.command,
        previousResults: accumulated,
      };
      const result = await executeStepMutation.mutateAsync({
        step,
        context,
        taskRunId,
      });
      accumulated.push(result);
      setStepResults((prev) => [...prev, result]);
      if (result.status === "failed") finalStatus = "failed";
    }
    await completeTaskRunMutation.mutateAsync({
      taskRunId,
      status: finalStatus,
    });
  };

  const isLoadingPlan = createPlanMutation.isPending;
  const isRunning = executeStepMutation.isPending;
  const canRun = plan && plan.steps.length > 0 && !isRunning;

  const pipelineSteps: PipelineStepState[] = plan
    ? plan.steps
      .sort((a, b) => a.order - b.order)
      .map((step, index) => {
        const result = stepResults.find((r) => r.stepId === step.id);
        const isThisRunning = runningIndex === index;
        const status = result
          ? result.status
          : isThisRunning
          ? "running"
          : "pending";
        return {
          id: step.id,
          type: step.type,
          title: step.title,
          status: status as PipelineStepState["status"],
          order: step.order,
        };
      })
    : [];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <PageHeader
          title="Command center"
          description="Enter a command. The planner generates a task plan; then run the agent pipeline."
        />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
        className="space-y-3"
      >
        <label className="text-sm font-medium text-foreground">
          User command
        </label>
        <div className="flex gap-2">
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="e.g. create a presentation about AI"
            className="flex-1 border-border bg-muted/30 focus-visible:ring-primary/30"
            disabled={isLoadingPlan || isRunning}
          />
          <Button
            onClick={handleGeneratePlan}
            disabled={isLoadingPlan || isRunning || !command.trim()}
            className="gap-1.5"
          >
            {isLoadingPlan ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ListTodo className="h-4 w-4" />
                Generate plan
              </>
            )}
          </Button>
        </div>
      </motion.section>

      <AnimatePresence mode="wait">
        {plan && (
          <>
            {pipelineSteps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mb-6"
              >
                <CommandPipeline steps={pipelineSteps} />
              </motion.div>
            )}
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border border-border bg-card"
            >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Command className="h-4 w-4 text-muted-foreground" />
                Execution plan
              </h2>
              <Button
                size="sm"
                onClick={handleRunPlan}
                disabled={!canRun}
                className="gap-1.5"
              >
                {isRunning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run pipeline
                  </>
                )}
              </Button>
            </div>
            <p className="border-b border-border px-5 py-3 text-sm text-muted-foreground">
              &ldquo;{plan.command}&rdquo;
            </p>
            <ul className="divide-y divide-border p-2">
              {plan.steps
                .sort((a, b) => a.order - b.order)
                .map((step, index) => {
                  const result = stepResults.find((r) => r.stepId === step.id);
                  const isThisRunning = runningIndex === index;
                  const status = result
                    ? result.status
                    : isThisRunning
                    ? "running"
                    : "pending";
                  return (
                    <motion.li
                      key={step.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/30"
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                          status === "completed" &&
                            "bg-emerald-500/15 text-emerald-500",
                          status === "failed" &&
                            "bg-destructive/15 text-destructive",
                          status === "running" &&
                            "bg-primary/15 text-primary",
                          status === "pending" &&
                            "bg-muted text-muted-foreground"
                        )}
                      >
                        {status === "completed" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : status === "failed" ? (
                          <XCircle className="h-4 w-4" />
                        ) : status === "running" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <AgentIcon type={step.type} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {step.title}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {step.type}
                          </span>
                        </div>
                        {step.description && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {step.description}
                          </p>
                        )}
                        {result?.output && (
                          <p className="mt-2 rounded-md border border-border bg-background/50 p-2 text-xs text-muted-foreground">
                            {result.output}
                          </p>
                        )}
                        {result?.error && (
                          <p className="mt-2 text-xs text-destructive">
                            {result.error}
                          </p>
                        )}
                        {result?.durationMs != null &&
                          result.status === "completed" && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {result.durationMs}ms
                            </p>
                          )}
                      </div>
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    </motion.li>
                  );
                })}
            </ul>
          </motion.div>
          </>
        )}
      </AnimatePresence>

      {createPlanMutation.isError && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-destructive"
        >
          Failed to generate plan. Try again.
        </motion.p>
      )}
    </div>
  );
}
