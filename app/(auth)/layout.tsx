/**
 * Auth layout - Wraps login/signup/callback.
 * Premium dark style aligned with landing (slate-950, glass, gradient accents).
 */

import Link from "next/link";
import { AetherLogo } from "@/components/ui/aether-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased">
      {/* Subtle gradient orbs for continuity with landing */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.07] blur-[100px] -top-32 -left-32 bg-violet-500" />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.07] blur-[80px] top-1/2 -right-24 bg-blue-500" />
      </div>

      <header className="relative z-10 border-b border-white/10 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center text-white hover:opacity-90 transition-opacity"
            aria-label="Aether home"
          >
            <AetherLogo className="h-8 w-auto" />
          </Link>
          <Link
            href="/"
            className="text-sm text-white/60 hover:text-white transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="relative z-10">{children}</main>
    </div>
  );
}
