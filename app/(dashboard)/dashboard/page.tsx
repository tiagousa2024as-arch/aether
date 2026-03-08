"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import {
  ArrowRight,
  Sparkles,
  Activity,
  Shield,
  ListChecks,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

const statusIcon = {
  completed: CheckCircle2,
  failed: XCircle,
  running: Loader2,
  pending: Clock,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const cardItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { data: stats, isLoading } = trpc.task.getStats.useQuery();

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <PageHeader
          title="Dashboard"
          description="Your AI operating layer—plans, runs, and outcomes."
        >
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/command-center">
              Command center
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </PageHeader>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {[
          {
            icon: Sparkles,
            title: "Agents ready",
            value: "Planner, Research, Code, Automation, Memory",
            delay: 0,
          },
          {
            icon: Activity,
            title: "Task runs",
            value: isLoading ? (
              <Loader2 className="inline h-4 w-4 animate-spin" />
            ) : (
              `${stats?.totalRuns ?? 0} total runs`
            ),
            delay: 1,
          },
          {
            icon: Shield,
            title: "Secure by default",
            value: "Sessions managed by NextAuth + Prisma",
            delay: 2,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            variants={cardItem}
            className="card-hover rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              {stat.title}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="rounded-xl border border-border bg-card"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ListChecks className="h-4 w-4 text-muted-foreground" />
            Recent activity
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tasks">View all</Link>
          </Button>
        </div>
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : !stats?.recentRuns?.length ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No runs yet. Create a plan in the Command center and run the pipeline.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {stats.recentRuns.map((run, i) => {
                const Icon = statusIcon[run.status as keyof typeof statusIcon] ?? Clock;
                return (
                  <motion.li
                    key={run.id}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <Link
                      href="/tasks"
                      className="card-hover flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5 text-sm"
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          run.status === "running" ? "animate-spin text-primary" : ""
                        } ${
                          run.status === "completed"
                            ? "text-emerald-500"
                            : run.status === "failed"
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span className="min-w-0 flex-1 truncate text-foreground">
                        {run.command}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {new Date(run.startedAt).toLocaleDateString()}
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </div>
      </motion.section>
    </div>
  );
}
