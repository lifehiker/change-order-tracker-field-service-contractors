"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { ClipboardPlus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", companyName: "" });

  function patch(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? "Registration failed.");
        return;
      }
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-frame flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl blueprint-panel">
            <ClipboardPlus className="h-6 w-6 text-[#f4eee4]" />
          </div>
          <div>
            <p className="label-chip text-[color:var(--ink-soft)]">Change Order Tracker</p>
            <h1 className="headline mt-2 text-5xl text-foreground">Start 14-day trial</h1>
          </div>
        </div>

        <div className="section-card rounded-[1.9rem] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => patch("name", e.target.value)}
                  className="mt-2 bg-white/70"
                  placeholder="Shannon"
                />
              </div>
              <div>
                <Label htmlFor="companyName">Company name</Label>
                <Input
                  id="companyName"
                  required
                  value={form.companyName}
                  onChange={(e) => patch("companyName", e.target.value)}
                  className="mt-2 bg-white/70"
                  placeholder="Apex Plumbing LLC"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => patch("email", e.target.value)}
                className="mt-2 bg-white/70"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password <span className="text-[color:var(--ink-soft)]">(min 8 chars)</span></Label>
              <Input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => patch("password", e.target.value)}
                className="mt-2 bg-white/70"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-full text-sm font-semibold"
              style={{ backgroundColor: "var(--brand)", color: "var(--primary-foreground)" }}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {loading ? "Creating account…" : "Create free account"}
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-[color:var(--ink-soft)]">
            14-day free trial. No credit card required.
          </p>
          <p className="mt-4 text-center text-sm text-[color:var(--ink-soft)]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[color:var(--brand)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
