"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { ClipboardPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("");

  useEffect(() => {
    const nextCallbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
    setCallbackUrl(nextCallbackUrl || "");
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Invalid email or password.");
      } else {
        router.push(callbackUrl || "/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-frame flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl blueprint-panel">
            <ClipboardPlus className="h-6 w-6 text-[#f4eee4]" />
          </div>
          <div>
            <p className="label-chip text-[color:var(--ink-soft)]">Change Order Tracker</p>
            <h1 className="headline mt-2 text-5xl text-foreground">Sign in</h1>
          </div>
        </div>

        <div className="section-card rounded-[1.9rem] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 bg-white/70"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 bg-white/70"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-full text-sm font-semibold"
              style={{ backgroundColor: "var(--brand)", color: "var(--primary-foreground)" }}
            >
              <LogIn className="mr-2 h-4 w-4" />
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-[color:var(--ink-soft)]">
            No account yet?{" "}
            <Link href="/register" className="font-semibold text-[color:var(--brand)] hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
