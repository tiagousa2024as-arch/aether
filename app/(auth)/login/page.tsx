"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInCredentialsAction } from "@/app/(auth)/actions";

const formCardClass =
  "relative z-10 w-full max-w-sm mx-auto rounded-2xl p-6 sm:p-8 glass-strong border border-white/20 shadow-2xl";

const inputClass =
  "h-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-0 focus-visible:border-white/20";

const labelClass = "text-sm font-medium text-white/80";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const registered = searchParams.get("registered") === "1";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInCredentialsAction(email, password, callbackUrl);
    } catch (err) {
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-12">
      <div className={formCardClass}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white">Sign in</h1>
          <p className="mt-2 text-sm text-white/60">
            Use your email or a provider to continue.
          </p>
          {registered && (
            <p className="mt-2 text-sm text-emerald-400">
              Account created. Sign in below.
            </p>
          )}
        </div>

        <form onSubmit={handleCredentials} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className={labelClass}>
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className={labelClass}>
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className={inputClass}
            />
          </div>
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full h-11 rounded-xl bg-white text-slate-900 hover:bg-white/90 font-semibold"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in with email"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase text-white/40">
            <span className="bg-transparent px-2">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            disabled={loading}
            asChild
            className="h-11 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            <Link
              href={`/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            >
              Google
            </Link>
          </Button>
          <Button
            variant="outline"
            disabled={loading}
            asChild
            className="h-11 rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            <Link
              href={`/api/auth/signin/github?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            >
              GitHub
            </Link>
          </Button>
        </div>

        <p className="text-center text-sm text-white/50 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-white/90 underline-offset-4 hover:text-white hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
