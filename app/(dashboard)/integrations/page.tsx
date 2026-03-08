"use client";

import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import {
  MessageSquare,
  Mail,
  Calendar,
  FileText,
  Github,
  Building2,
  Loader2,
  Check,
} from "lucide-react";

const PROVIDERS = [
  { id: "slack", name: "Slack", description: "Send notifications and summaries to channels.", icon: MessageSquare },
  { id: "google", name: "Google Workspace", description: "Gmail, Drive, Calendar, and Docs.", icon: Building2 },
  { id: "github", name: "GitHub", description: "Repos, issues, and pull requests.", icon: Github },
  { id: "notion", name: "Notion", description: "Databases, pages, and docs.", icon: FileText },
  { id: "email", name: "Email", description: "Send reports and alerts via SMTP.", icon: Mail },
  { id: "calendar", name: "Calendar", description: "Schedule runs and sync events.", icon: Calendar },
] as const;

export default function IntegrationsPage() {
  const { data: connected, isLoading } = trpc.integration.list.useQuery();
  const utils = trpc.useUtils();
  const connectMutation = trpc.integration.connect.useMutation({
    onSuccess: () => utils.integration.list.invalidate(),
  });
  const disconnectMutation = trpc.integration.disconnect.useMutation({
    onSuccess: () => utils.integration.list.invalidate(),
  });

  const connectedSet = new Set((connected ?? []).map((c) => c.provider));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        description="Connect APIs, tools, and data sources for agents to use."
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROVIDERS.map((int, i) => {
            const Icon = int.icon;
            const isConnected = connectedSet.has(int.id);
            return (
              <motion.div
                key={int.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-hover flex flex-col rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-foreground">{int.name}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {int.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  {isConnected ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-500">
                        <Check className="h-3.5 w-3.5" />
                        Connected
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => disconnectMutation.mutate({ provider: int.id })}
                        disabled={disconnectMutation.isPending}
                      >
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => connectMutation.mutate({ provider: int.id })}
                      disabled={connectMutation.isPending}
                    >
                      {connectMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Connect"
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
