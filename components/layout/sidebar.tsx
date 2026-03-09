"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Command,
  Terminal,
  Bot,
  ListChecks,
  Brain,
  Workflow,
  Wrench,
  Plug,
  CreditCard,
  Settings,
} from "lucide-react";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Orchestration",
    items: [
      { href: "/commands", label: "Commands", icon: Terminal },
      { href: "/command-center", label: "Command center", icon: Command },
      { href: "/agents", label: "Agents", icon: Bot },
      { href: "/tasks", label: "Tasks", icon: ListChecks },
      { href: "/memory", label: "Memory", icon: Brain },
      { href: "/automations", label: "Automations", icon: Workflow },
      { href: "/tools/executions", label: "Tool executions", icon: Wrench },
      { href: "/integrations", label: "Integrations", icon: Plug },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/billing", label: "Billing", icon: CreditCard },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const item = {
  hidden: { opacity: 0, x: -6 },
  show: { opacity: 1, x: 0 },
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-56 lg:flex-col lg:border-r lg:border-border lg:bg-card/30">
      <div className="flex flex-col gap-6 px-3 py-5">
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="px-2"
        >
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Workspace
          </span>
        </motion.div>

        <motion.nav
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6"
        >
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <motion.p
                variants={item}
                className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                {group.label}
              </motion.p>
              <ul className="space-y-0.5">
                {group.items.map((navItem) => {
                  const active =
                    navItem.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname?.startsWith(navItem.href);
                  const Icon = navItem.icon;
                  return (
                    <motion.li key={navItem.href} variants={item}>
                      <Link
                        href={navItem.href}
                        className={cn(
                          "relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors duration-150",
                          active
                            ? "bg-primary/10 text-foreground font-medium"
                            : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                        )}
                      >
                        {active && (
                          <span
                            className="nav-active-indicator"
                            aria-hidden
                          />
                        )}
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            active && "text-primary"
                          )}
                        />
                        <span>{navItem.label}</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          ))}
        </motion.nav>
      </div>
    </aside>
  );
}
