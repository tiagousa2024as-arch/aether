"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Terminal,
  ListOrdered,
  FileText,
} from "lucide-react";

interface WorkflowStep {
  id: string;
  type: string;
  status: string;
  input: unknown;
  output: string | null;
  error: string | null;
  startedAt: string | null;
  completedAt: string | null;
}

interface ExecutionLogEntry {
  stepId: string | null;
  action: string;
  result: string | null;
  error: string | null;
  createdAt: string;
}

interface CommandEntry {
  id: string;
  commandText: string;
  status: string;
  workflowId: string | null;
  createdAt: string;
  workflow: {
    id: string;
    status: string;
    steps: WorkflowStep[];
    logs: ExecutionLogEntry[];
  } | null;
}

export default function CommandsPage() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<CommandEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/commands");
      if (!res.ok) throw new Error("Failed to load commands");
      const data = await res.json();
      setHistory(data.commands ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = command.trim();
    if (!text || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/commands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Command failed");
      setCommand("");
      await fetchHistory();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Command failed");
    } finally {
      setSubmitting(false);
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "running":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Commands"
        description="Type a command. AI interprets it and executes real actions through Salesforce and Microsoft Teams."
      />

      <section className="rounded-xl border border-border bg-card/50 p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="e.g. Create Salesforce lead and notify sales team in Microsoft Teams"
              className="min-h-11 border-border bg-muted/30 font-mono text-sm placeholder:text-muted-foreground focus-visible:ring-primary/40"
              disabled={submitting}
            />
          </div>
          <Button
            type="submit"
            disabled={submitting || !command.trim()}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Execute
          </Button>
        </form>
        {error && (
          <p className="mt-3 text-sm text-destructive">{error}</p>
        )}
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
          <Terminal className="h-4 w-4 text-muted-foreground" />
          Command history
        </h2>
        {loading ? (
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card/50 p-6 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading…
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-xl border border-border bg-card/50 p-6 text-sm text-muted-foreground">
            No commands yet. Run a command above.
          </div>
        ) : (
          <ul className="space-y-4">
            {history.map((c) => (
              <li
                key={c.id}
                className="rounded-xl border border-border bg-card/50 overflow-hidden"
              >
                <div className="flex items-start gap-3 border-b border-border p-4">
                  <div className="mt-0.5 shrink-0">{statusIcon(c.status)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-sm text-foreground">{c.commandText}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(c.createdAt).toLocaleString()} · {c.status}
                    </p>
                  </div>
                </div>
                {c.workflow && (
                  <>
                    <div className="border-b border-border px-4 py-3">
                      <h3 className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        <ListOrdered className="h-3.5 w-3.5" />
                        Workflow · {c.workflow.status}
                      </h3>
                      <ul className="space-y-2">
                        {c.workflow.steps.map((s) => (
                          <li
                            key={s.id}
                            className={cn(
                              "flex items-start gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-xs",
                              s.status === "completed" && "border-emerald-500/20 bg-emerald-500/5",
                              s.status === "failed" && "border-red-500/20 bg-red-500/5"
                            )}
                          >
                            <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <div className="min-w-0 flex-1">
                              <span className="font-medium text-foreground">{s.type}</span>
                              <span className="ml-2 text-muted-foreground">{s.status}</span>
                              {s.output && (
                                <pre className="mt-1 overflow-x-auto rounded bg-background/50 p-1.5 font-mono text-[11px] text-muted-foreground">
                                  {s.output}
                                </pre>
                              )}
                              {s.error && (
                                <p className="mt-1 text-red-500">{s.error}</p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {c.workflow.logs.length > 0 && (
                      <div className="px-4 py-3">
                        <h3 className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          <FileText className="h-3.5 w-3.5" />
                          Execution logs
                        </h3>
                        <ul className="space-y-1.5 font-mono text-[11px] text-muted-foreground">
                          {c.workflow.logs.map((l, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="shrink-0 text-muted-foreground/70">
                                {new Date(l.createdAt).toLocaleTimeString()}
                              </span>
                              <span>{l.action}</span>
                              {l.error && <span className="text-red-500">{l.error}</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
