import { auth } from "@/server/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AetherLogo } from "@/components/ui/aether-logo";

export async function DashboardHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Link
          href="/dashboard"
          className="flex flex-shrink-0 items-center text-foreground transition-opacity hover:opacity-90"
          aria-label="Aether dashboard"
        >
          <AetherLogo variant="full" className="h-7 w-auto min-w-[6.5rem]" />
        </Link>
      </div>
      <div className="flex flex-shrink-0 items-center gap-3">
        {session?.user?.email && (
          <span className="max-w-[180px] truncate text-sm text-muted-foreground">
            {session.user.email}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          asChild
          className="border-border/80 bg-transparent hover:bg-muted/80"
        >
          <Link href="/api/auth/signout">Sign out</Link>
        </Button>
      </div>
    </header>
  );
}
