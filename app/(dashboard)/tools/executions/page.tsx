"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";
import { Wrench, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";

interface ToolExecutionRow {
  id: string;
  workspaceId: string;
  toolName: string;
  agentId: string;
  input: unknown;
  output: string | null;
  status: string;
  error: string | null;
  duration: number;
  createdAt: string;
}

export default function ToolExecutionsPage() {
  const [executions, setExecutions] = useState<ToolExecutionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExecutions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tools/executions");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data.error ?? "Failed to load executions";
        const hint = data.hint ? ` ${data.hint}` : "";
        throw new Error(msg + hint);
      }
      setExecutions(data.executions ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExecutions();
  }, [fetchExecutions]);

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
        title="Tool executions"
        description="Log of every tool call: tool, agent, status, duration, result."
      />

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
          <Wrench className="h-4 w-4 text-muted-foreground" />
          Execution log
        </h2>
        {loading ? (
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card/50 p-6 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading…
          </div>
        ) : error ? (
          <div className="rounded-xl border border-border bg-card/50 p-6 text-sm text-destructive">
            {error}
          </div>
        ) : executions.length === 0 ? (
          <div className="rounded-xl border border-border bg-card/50 p-6 text-sm text-muted-foreground">
            No tool executions yet. Run a command that uses tools (e.g. Salesforce lead, Teams message).
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 font-medium text-foreground">Tool</th>
                  <th className="px-4 py-3 font-medium text-foreground">Agent</th>
                  <th className="px-4 py-3 font-medium text-foreground">Status</th>
                  <th className="px-4 py-3 font-medium text-foreground">Duration</th>
                  <th className="px-4 py-3 font-medium text-foreground">Time</th>
                </tr>
              </thead>
              <tbody>
                {executions.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-foreground">{e.toolName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.agentId}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        {statusIcon(e.status)}
                        <span
                          className={cn(
                            e.status === "completed" && "text-emerald-600",
                            e.status === "failed" && "text-red-600"
                          )}
                        >
                          {e.status}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{e.duration}ms</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(e.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {executions.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-medium text-foreground">Details</h2>
          <ul className="space-y-3">
            {executions.slice(0, 20).map((e) => (
              <li
                key={e.id}
                className={cn(
                  "rounded-lg border border-border bg-muted/10 p-4 text-xs",
                  e.status === "failed" && "border-red-500/20 bg-red-500/5"
                )}
              >
                <div className="flex items-center gap-2 font-mono text-foreground">
                  {e.toolName}
                  <span className="text-muted-foreground">· {e.agentId}</span>
                  <span className={cn(e.status === "failed" ? "text-red-500" : "text-muted-foreground")}>
                    {e.status}
                  </span>
                </div>
                {e.error && <p className="mt-1 text-red-500">{e.error}</p>}
                {e.output && (
                  <pre className="mt-2 overflow-x-auto rounded bg-background/50 p-2 font-mono text-[11px] text-muted-foreground">
                    {e.output}
                  </pre>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
