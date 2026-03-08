/**
 * Client providers - Wrap app with TRPCProvider, SessionProvider (Auth), ThemeProvider if needed.
 * Use in root layout so dashboard and all client trees have access.
 */

"use client";

import { TRPCProvider } from "@/lib/trpc/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <TRPCProvider>{children}</TRPCProvider>;
}
