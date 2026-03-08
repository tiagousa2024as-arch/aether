/**
 * Dashboard shell - Composes Sidebar + main content area.
 * Used in (dashboard)/layout.tsx. Premium dark layout with clear hierarchy.
 */

import { Sidebar } from "@/components/layout/sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] lg:flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
