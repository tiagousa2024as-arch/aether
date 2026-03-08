"use client";

import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc/client";
import { PageHeader } from "@/components/layout/page-header";
import { Brain, Loader2 } from "lucide-react";

export default function MemoryPage() {
  const { data, isLoading } = trpc.memory.list.useQuery({ limit: 50 });

  const memories = data?.memories ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Memory"
        description="Context stored by the Memory agent during task runs. Used for future context and recall."
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : memories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-12 text-center"
        >
          <Brain className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-50" />
          <p className="text-sm font-medium text-foreground">No memories yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Run a pipeline in the Command center that includes a Memory step.
            Completed memory steps will appear here.
          </p>
        </motion.div>
      ) : (
        <ul className="space-y-3">
          {memories.map((m, i) => (
            <motion.li
              key={m.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="card-hover rounded-xl border border-border bg-card p-4"
            >
              <p className="text-sm text-foreground">{m.content}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(m.createdAt).toLocaleString()}
                {m.source && ` · Run ${m.source.slice(0, 8)}…`}
              </p>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
