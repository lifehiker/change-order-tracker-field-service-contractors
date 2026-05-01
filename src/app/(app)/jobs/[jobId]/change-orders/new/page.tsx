"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Props = { params: Promise<{ jobId: string }> };

function formatMoney(dollars: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(dollars);
}

export default function NewChangeOrderPage({ params }: Props) {
  const router = useRouter();
  const [jobId, setJobId] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    urgency: "NORMAL",
    laborHours: 0,
    laborRate: 0,
    materialCost: 0,
    otherCost: 0,
  });

  useEffect(() => {
    params.then(({ jobId: id }) => setJobId(id));
  }, [params]);

  function patch(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const laborTotal = form.laborHours * form.laborRate;
  const grandTotal = laborTotal + form.materialCost + form.otherCost;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!jobId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/change-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          urgency: form.urgency,
          laborImpactCents: Math.round(laborTotal * 100),
          materialImpactCents: Math.round(form.materialCost * 100),
          otherImpactCents: Math.round(form.otherCost * 100),
        }),
      });
      const data = await res.json() as { id?: string; error?: string };
      if (!res.ok) {
        toast.error(data.error ?? "Failed to create change order.");
        return;
      }
      toast.success("Change order created.");
      router.push(`/change-orders/${data.id}`);
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
          <Link href={jobId ? `/jobs/${jobId}` : "/jobs"}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <p className="label-chip text-[color:var(--ink-soft)]">New change order</p>
          <h1 className="headline mt-1 text-4xl text-foreground">Document the scope change</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="section-card rounded-[1.9rem] p-6 sm:p-8 space-y-5">
            <div>
              <Label htmlFor="title">Change title *</Label>
              <Input
                id="title"
                required
                value={form.title}
                onChange={(e) => patch("title", e.target.value)}
                className="mt-2 bg-white/70"
                placeholder="Add two hose bibs and reroute supply line"
              />
            </div>
            <div>
              <Label htmlFor="urgency">Urgency</Label>
              <select
                id="urgency"
                value={form.urgency}
                onChange={(e) => patch("urgency", e.target.value)}
                className="mt-2 flex h-11 w-full rounded-xl border border-[color:var(--line)] bg-white/70 px-3 text-sm"
              >
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
                <option value="SAME_DAY">Same day</option>
              </select>
            </div>
            <div>
              <Label htmlFor="description">Scope description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => patch("description", e.target.value)}
                className="mt-2 min-h-[140px] bg-white/70"
                placeholder="What changed, why, and what the crew found onsite…"
              />
            </div>
          </div>

          <div className="section-card rounded-[1.9rem] p-6 sm:p-8 space-y-5">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Cost impact</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="laborHours">Labor hours</Label>
                <Input
                  id="laborHours"
                  type="number"
                  min={0}
                  step="0.5"
                  value={form.laborHours || ""}
                  onChange={(e) => patch("laborHours", parseFloat(e.target.value) || 0)}
                  className="mt-2 bg-white/70"
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="laborRate">Hourly rate ($)</Label>
                <Input
                  id="laborRate"
                  type="number"
                  min={0}
                  value={form.laborRate || ""}
                  onChange={(e) => patch("laborRate", parseFloat(e.target.value) || 0)}
                  className="mt-2 bg-white/70"
                  placeholder="145"
                />
              </div>
              <div>
                <Label htmlFor="materialCost">Material cost ($)</Label>
                <Input
                  id="materialCost"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.materialCost || ""}
                  onChange={(e) => patch("materialCost", parseFloat(e.target.value) || 0)}
                  className="mt-2 bg-white/70"
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="otherCost">Other cost ($)</Label>
                <Input
                  id="otherCost"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.otherCost || ""}
                  onChange={(e) => patch("otherCost", parseFloat(e.target.value) || 0)}
                  className="mt-2 bg-white/70"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <Card className="rounded-[1.9rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]">
            <CardContent className="p-6 space-y-4">
              <p className="label-chip text-[color:var(--brand)]">Cost summary</p>
              {[
                ["Labor", formatMoney(laborTotal)],
                ["Materials", formatMoney(form.materialCost)],
                ["Other", formatMoney(form.otherCost)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-[color:var(--ink-soft)]">{label}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
              <Separator className="bg-[color:var(--line)]" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="headline text-4xl text-[color:var(--brand)]">{formatMoney(grandTotal)}</span>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={loading || !jobId}
            className="h-12 w-full rounded-full text-sm font-semibold"
            style={{ backgroundColor: "var(--brand)", color: "var(--primary-foreground)" }}
          >
            <FileText className="mr-1.5 h-4 w-4" />
            {loading ? "Creating…" : "Create change order"}
          </Button>
        </div>
      </form>
    </div>
  );
}
