"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/layout/page-header";
import {
  Workflow,
  Search,
  FileText,
  Mail,
  Clock,
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
} from "lucide-react";

const AGENT_TYPES = [
  { value: "research", label: "Research", icon: Search },
  { value: "code", label: "Code", icon: FileText },
  { value: "automation", label: "Automation", icon: Workflow },
  { value: "memory", label: "Memory", icon: Mail },
] as const;

type AgentType = (typeof AGENT_TYPES)[number]["value"];

export default function AutomationsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [triggerType, setTriggerType] = useState<"schedule" | "manual">("schedule");
  const [schedule, setSchedule] = useState("daily 8:00");
  const [steps, setSteps] = useState<{ order: number; agentType: AgentType }[]>([
    { order: 0, agentType: "research" },
    { order: 1, agentType: "code" },
    { order: 2, agentType: "memory" },
  ]);

  const { data: automations, isLoading } = trpc.automation.list.useQuery();
  const utils = trpc.useUtils();
  const createMutation = trpc.automation.create.useMutation({
    onSuccess: () => {
      utils.automation.list.invalidate();
      setShowCreate(false);
      setName("");
      setDescription("");
      setSchedule("daily 8:00");
      setSteps([{ order: 0, agentType: "research" }, { order: 1, agentType: "code" }, { order: 2, agentType: "memory" }]);
    },
  });
  const deleteMutation = trpc.automation.delete.useMutation({
    onSuccess: () => utils.automation.list.invalidate(),
  });

  const handleCreate = () => {
    if (!name.trim()) return;
    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      triggerType,
      schedule: triggerType === "schedule" ? schedule : undefined,
      steps: steps.map((s, i) => ({ order: i, agentType: s.agentType })),
    });
  };

  const addStep = () => {
    setSteps((prev) => [...prev, { order: prev.length, agentType: "research" }]);
  };

  const removeStep = (index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })));
  };

  const updateStepAgent = (index: number, agentType: AgentType) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, agentType } : s)));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automations"
        description="Schedule or event-based runs. Connect agents to triggers."
      >
        <Button size="sm" onClick={() => setShowCreate(!showCreate)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          New automation
        </Button>
      </PageHeader>

      {showCreate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <h3 className="text-sm font-medium text-foreground">Create automation</h3>
          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Morning Report"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="desc">Description (optional)</Label>
              <Input
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Research news, generate summary, send email"
                className="mt-1"
              />
            </div>
            <div className="flex gap-4">
              <div>
                <Label>Trigger</Label>
                <div className="mt-1 flex gap-2">
                  <Button
                    type="button"
                    variant={triggerType === "schedule" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTriggerType("schedule")}
                  >
                    Schedule
                  </Button>
                  <Button
                    type="button"
                    variant={triggerType === "manual" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTriggerType("manual")}
                  >
                    Manual
                  </Button>
                </div>
              </div>
              {triggerType === "schedule" && (
                <div className="flex-1">
                  <Label htmlFor="schedule">Schedule</Label>
                  <Input
                    id="schedule"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    placeholder="daily 8:00"
                    className="mt-1"
                  />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label>Steps</Label>
                <Button type="button" variant="ghost" size="sm" onClick={addStep}>
                  Add step
                </Button>
              </div>
              <ul className="mt-2 space-y-2">
                {steps.map((step, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-6">{i + 1}.</span>
                    <select
                      value={step.agentType}
                      onChange={(e) => updateStepAgent(i, e.target.value as AgentType)}
                      className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                    >
                      {AGENT_TYPES.map((a) => (
                        <option key={a.value} value={a.value}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                      onClick={() => removeStep(i)}
                      disabled={steps.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={createMutation.isPending || !name.trim()}>
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
              </Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : !automations?.length ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <Workflow className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
          <p className="text-sm font-medium text-foreground">No automations yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a workflow (e.g. Morning Report) with trigger and agent steps.
          </p>
          <Button className="mt-4" size="sm" onClick={() => setShowCreate(true)}>
            Create automation
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {automations.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card-hover flex flex-col gap-2 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Workflow className="h-5 w-5 text-primary" />
                  <h3 className="font-medium text-foreground">{a.name}</h3>
                  {!a.enabled && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      Disabled
                    </span>
                  )}
                </div>
                {a.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground">{a.description}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {a.triggerType === "schedule" ? a.schedule ?? "—" : "Manual trigger"}
                  <span className="text-muted-foreground/60">·</span>
                  {a.steps.length} step{a.steps.length !== 1 ? "s" : ""}
                  {a.steps.length > 0 && (
                    <span className="capitalize">
                      ({a.steps.map((s) => s.agentType).join(" → ")})
                    </span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => deleteMutation.mutate({ id: a.id })}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
