/**
 * Settings - User and workspace settings.
 * Profile, security, notifications, API keys, danger zone.
 */

import { auth } from "@/server/auth";
import Link from "next/link";
import { Settings, User, Mail, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile and preferences."
      />

      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <h2 className="text-sm font-medium text-foreground flex items-center gap-2">
          <User className="w-4 h-4" /> Profile
        </h2>
        <div className="flex items-center gap-4">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt=""
              className="w-14 h-14 rounded-full border border-border"
            />
          ) : (
            <div className="w-14 h-14 rounded-full border border-border bg-muted flex items-center justify-center text-muted-foreground text-lg font-medium">
              {session?.user?.name?.slice(0, 1) ?? session?.user?.email?.slice(0, 1) ?? "?"}
            </div>
          )}
          <div>
            <p className="font-medium text-foreground">
              {session?.user?.name ?? "—"}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              {session?.user?.email ?? "—"}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Account is managed by your sign-in provider. To change email or
          password, use the provider&apos;s account settings.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Sign out
        </h2>
        <Button variant="outline" asChild>
          <Link href="/api/auth/signout">Sign out of Aether</Link>
        </Button>
      </div>
    </div>
  );
}
