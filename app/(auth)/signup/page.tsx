"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUserAction } from "@/app/(auth)/actions";

const formCardClass =
  "relative z-10 w-full max-w-sm mx-auto rounded-2xl p-6 sm:p-8 glass-strong border border-white/20 shadow-2xl";

const inputClass =
  "h-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-0 focus-visible:border-white/20";

const labelClass = "text-sm font-medium text-white/80";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createUserAction({ email, password, name });
      router.push("/login?registered=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-12">
      <div className={formCardClass}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white">Create an account</h1>
          <p className="mt-2 text-sm text-white/60">
            Enter your details to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className={labelClass}>
              Name (optional)
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className={inputClass}
            />
          </div>
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
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
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
            {loading ? "Creating account…" : "Sign up"}
          </Button>
        </form>

        <p className="text-center text-sm text-white/50 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-white/90 underline-offset-4 hover:text-white hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
