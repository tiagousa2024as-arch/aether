import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }
  return (
    <div className="dashboard-layout dark min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex-1">
        <DashboardShell>{children}</DashboardShell>
      </main>
    </div>
  );
}
