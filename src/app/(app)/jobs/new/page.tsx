"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    siteAddress: "",
    originalScope: "",
  });

  function patch(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { id?: string; error?: string };
      if (!res.ok) {
        toast.error(data.error ?? "Failed to create job.");
        return;
      }
      toast.success("Job created.");
      router.push(`/jobs/${data.id}`);
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild className="rounded-full border border-[color:var(--line)] bg-white/65 text-foreground hover:bg-white">
          <Link href="/jobs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <p className="label-chip text-[color:var(--ink-soft)]">New job</p>
          <h1 className="headline mt-1 text-4xl text-foreground">Create a job</h1>
        </div>
      </div>

      <div className="section-card rounded-[1.9rem] p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="customerName">Customer / company name *</Label>
              <Input
                id="customerName"
                required
                value={form.customerName}
                onChange={(e) => patch("customerName", e.target.value)}
                className="mt-2 bg-white/70"
                placeholder="Alder & Pike Properties"
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">Customer email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={form.customerEmail}
                onChange={(e) => patch("customerEmail", e.target.value)}
                className="mt-2 bg-white/70"
                placeholder="marissa@client.com"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="siteAddress">Site address *</Label>
            <Input
              id="siteAddress"
              required
              value={form.siteAddress}
              onChange={(e) => patch("siteAddress", e.target.value)}
              className="mt-2 bg-white/70"
              placeholder="1127 Fremont Ave, Bellevue, WA"
            />
          </div>
          <div>
            <Label htmlFor="originalScope">Original scope <span className="text-[color:var(--ink-soft)]">(optional)</span></Label>
            <Textarea
              id="originalScope"
              value={form.originalScope}
              onChange={(e) => patch("originalScope", e.target.value)}
              className="mt-2 min-h-[120px] bg-white/70"
              placeholder="Describe the original job scope…"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="h-11 rounded-full px-6 text-sm font-semibold"
              style={{ backgroundColor: "var(--brand)", color: "var(--primary-foreground)" }}
            >
              <Briefcase className="mr-1.5 h-4 w-4" />
              {loading ? "Creating…" : "Create job"}
            </Button>
            <Button asChild className="h-11 rounded-full border border-[color:var(--line)] bg-white/65 text-sm text-foreground hover:bg-white">
              <Link href="/jobs">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
