"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Workspace = {
  id: string; name: string; slug: string; logoUrl: string | null;
  defaultTerms: string | null; taxRate: number; currency: string;
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({ name: "", logoUrl: "", defaultTerms: "", taxRate: "0", currency: "USD" });

  useEffect(() => {
    fetch("/api/workspace").then(r => r.json()).then((ws: Workspace) => {
      setForm({ name: ws.name, logoUrl: ws.logoUrl ?? "", defaultTerms: ws.defaultTerms ?? "", taxRate: String(ws.taxRate), currency: ws.currency });
    }).finally(() => setFetching(false));
  }, []);

  function patch(f: string, v: string) { setForm(p => ({ ...p, [f]: v })); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/workspace", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, taxRate: parseFloat(form.taxRate) || 0 }),
      });
      if (res.ok) toast.success("Settings saved.");
      else toast.error("Failed to save settings.");
    } catch { toast.error("Something went wrong."); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="label-chip text-[color:var(--ink-soft)]">Workspace</p>
        <h1 className="headline mt-1 text-5xl text-foreground">Settings</h1>
      </div>
      {fetching ? (
        <div className="section-card rounded-[1.9rem] p-6 sm:p-8 space-y-5 max-w-xl animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3.5 w-32 rounded bg-stone-200" />
              <div className="h-11 w-full rounded-xl bg-stone-100" />
            </div>
          ))}
        </div>
      ) : (
      <div className="section-card rounded-[1.9rem] p-6 sm:p-8">
        <form onSubmit={handleSave} className="space-y-5 max-w-xl">
          <div>
            <Label htmlFor="name">Company name</Label>
            <Input id="name" required value={form.name} onChange={e => patch("name", e.target.value)} className="mt-2 bg-white/70" />
          </div>
          <div>
            <Label htmlFor="logoUrl">Logo URL <span className="text-[color:var(--ink-soft)]">(optional)</span></Label>
            <Input id="logoUrl" type="url" value={form.logoUrl} onChange={e => patch("logoUrl", e.target.value)} className="mt-2 bg-white/70" placeholder="https://…" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="taxRate">Tax rate (%)</Label>
              <Input id="taxRate" type="number" min={0} max={100} step="0.01" value={form.taxRate} onChange={e => patch("taxRate", e.target.value)} className="mt-2 bg-white/70" />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <select id="currency" value={form.currency} onChange={e => patch("currency", e.target.value)}
                className="mt-2 flex h-11 w-full rounded-xl border border-[color:var(--line)] bg-white/70 px-3 text-sm">
                <option value="USD">USD — US Dollar</option>
                <option value="CAD">CAD — Canadian Dollar</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="EUR">EUR — Euro</option>
                <option value="AUD">AUD — Australian Dollar</option>
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="defaultTerms">Default approval terms <span className="text-[color:var(--ink-soft)]">(shown on approval page)</span></Label>
            <Textarea id="defaultTerms" value={form.defaultTerms} onChange={e => patch("defaultTerms", e.target.value)}
              className="mt-2 min-h-[120px] bg-white/70"
              placeholder="By approving this change order, the client authorizes the additional work and associated costs…" />
          </div>
          <Button type="submit" disabled={loading} className="h-11 rounded-full px-6 text-sm font-semibold"
            style={{ backgroundColor: "var(--brand)", color: "var(--primary-foreground)" }}>
            <Save className="mr-1.5 h-4 w-4" />
            {loading ? "Saving…" : "Save settings"}
          </Button>
        </form>
      </div>
      )}
    </div>
  );
}
