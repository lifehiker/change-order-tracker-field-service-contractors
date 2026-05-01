"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Copy, Printer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  calculateGrandTotal,
  calculateLaborTotal,
  calculateMarkupTotal,
  calculateMaterialTotal,
  calculateSubtotal,
  defaultDraft,
  DEMO_STORAGE_KEY,
  formatCurrency,
  formatTimestamp,
  type ChangeOrderDraft,
} from "@/lib/demo-store";

export function DocumentScreen() {
  const [draft, setDraft] = useState<ChangeOrderDraft>(defaultDraft);

  useEffect(() => {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);

    if (raw) {
      try {
        setDraft(JSON.parse(raw) as ChangeOrderDraft);
      } catch {
        setDraft(defaultDraft);
      }
    }
  }, []);

  const totals = useMemo(
    () => ({
      labor: calculateLaborTotal(draft),
      materials: calculateMaterialTotal(draft.materials),
      subtotal: calculateSubtotal(draft),
      markup: calculateMarkupTotal(draft),
      grand: calculateGrandTotal(draft),
    }),
    [draft],
  );

  function copySummary() {
    const summary = [
      `Change: ${draft.changeTitle}`,
      `Job: ${draft.jobName}`,
      `Client: ${draft.clientName}`,
      `Labor: ${draft.laborHours} hrs @ ${formatCurrency(draft.laborRate)}`,
      `Materials: ${formatCurrency(totals.materials)}`,
      `Total: ${formatCurrency(totals.grand)}`,
      `Approval: ${draft.approval.state}`,
    ].join("\n");

    navigator.clipboard.writeText(summary);
    toast.success("Documentation summary copied.");
  }

  return (
    <div className="grid gap-5">
      <section className="section-card rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="hero-kicker text-lg text-[color:var(--brand)]">Invoice-ready documentation</p>
            <h1 className="headline mt-4 text-6xl text-foreground sm:text-7xl">
              The clean packet the office can bill from.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[color:var(--ink-soft)]">
              Scope narrative, labor, materials, timestamps, photos, and client response are
              all held in one printable change-order document.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => window.print()}
              className="h-12 rounded-full text-sm font-semibold text-[color:var(--primary-foreground)] hover:opacity-95"
              style={{ backgroundColor: "var(--brand)" }}
            >
              <Printer className="mr-1.5 h-4 w-4" />
              Print document
            </Button>
            <Button
              onClick={copySummary}
              className="h-12 rounded-full border border-[color:var(--line)] bg-white/65 text-sm font-semibold text-foreground hover:bg-white"
            >
              <Copy className="mr-1.5 h-4 w-4" />
              Copy summary
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <Card className="rounded-[2rem] border-[color:var(--line)] bg-[#fffaf2] print:shadow-none">
          <CardContent className="space-y-8 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-5 border-b border-dashed border-[color:var(--line)] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="label-chip text-[color:var(--brand)]">Change Order Record</p>
                <h2 className="headline mt-3 text-5xl text-foreground sm:text-6xl">
                  {draft.changeTitle}
                </h2>
              </div>
              <div className="space-y-2 text-sm text-[color:var(--ink-soft)]">
                <p>{draft.trade}</p>
                <p>{draft.jobName}</p>
                <p>{draft.siteLocation}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Client", draft.clientName],
                ["Contact", draft.clientContact],
                ["Approval sent", formatTimestamp(draft.approvalSentAt)],
                ["Decision", draft.approval.state.replace("_", " ")],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[1.25rem] border border-[color:var(--line)] bg-white p-4"
                >
                  <p className="label-chip text-[color:var(--ink-soft)]">{label}</p>
                  <p className="mt-2 text-base leading-7 text-foreground">{value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="label-chip text-[color:var(--brand)]">Scope narrative</p>
              <p className="text-base leading-8 text-[color:var(--ink-soft)]">
                {draft.scopeSummary}
              </p>
            </div>

            <div className="space-y-4">
              <p className="label-chip text-[color:var(--brand)]">Line items</p>
              <div className="overflow-hidden rounded-[1.5rem] border border-[color:var(--line)]">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-[color:var(--brand-soft)]">
                    <tr>
                      <th className="px-4 py-4 text-sm font-semibold text-foreground sm:px-6">
                        Item
                      </th>
                      <th className="px-4 py-4 text-sm font-semibold text-foreground sm:px-6">
                        Qty / Hours
                      </th>
                      <th className="px-4 py-4 text-sm font-semibold text-foreground sm:px-6">
                        Unit
                      </th>
                      <th className="px-4 py-4 text-sm font-semibold text-foreground sm:px-6">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="border-t border-[color:var(--line)]">
                      <td className="px-4 py-4 text-sm text-[color:var(--ink-soft)] sm:px-6">
                        Field labor
                      </td>
                      <td className="px-4 py-4 text-sm text-[color:var(--ink-soft)] sm:px-6">
                        {draft.laborHours}
                      </td>
                      <td className="px-4 py-4 text-sm text-[color:var(--ink-soft)] sm:px-6">
                        {formatCurrency(draft.laborRate)}
                      </td>
                      <td className="px-4 py-4 text-sm text-[color:var(--ink-soft)] sm:px-6">
                        {formatCurrency(totals.labor)}
                      </td>
                    </tr>
                    {draft.materials.map((item) => (
                      <tr key={item.id} className="border-t border-[color:var(--line)]">
                        <td className="px-4 py-4 text-sm text-[color:var(--ink-soft)] sm:px-6">
                          {item.label}
                        </td>
                        <td className="px-4 py-4 text-sm text-[color:var(--ink-soft)] sm:px-6">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-4 text-sm text-[color:var(--ink-soft)] sm:px-6">
                          {formatCurrency(item.unitCost)}
                        </td>
                        <td className="px-4 py-4 text-sm text-[color:var(--ink-soft)] sm:px-6">
                          {formatCurrency(item.quantity * item.unitCost)}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t border-[color:var(--line)] bg-[color:var(--paper-tone)]">
                      <td className="px-4 py-4 text-sm font-semibold text-foreground sm:px-6">
                        Subtotal
                      </td>
                      <td />
                      <td />
                      <td className="px-4 py-4 text-sm font-semibold text-foreground sm:px-6">
                        {formatCurrency(totals.subtotal)}
                      </td>
                    </tr>
                    <tr className="border-t border-[color:var(--line)] bg-[color:var(--paper-tone)]">
                      <td className="px-4 py-4 text-sm font-semibold text-foreground sm:px-6">
                        Markup ({draft.markupRate}%)
                      </td>
                      <td />
                      <td />
                      <td className="px-4 py-4 text-sm font-semibold text-foreground sm:px-6">
                        {formatCurrency(totals.markup)}
                      </td>
                    </tr>
                    <tr className="border-t border-[color:var(--line)] bg-[color:var(--brand-soft)]">
                      <td className="px-4 py-4 text-base font-semibold text-foreground sm:px-6">
                        Change order total
                      </td>
                      <td />
                      <td />
                      <td className="px-4 py-4 text-base font-semibold text-foreground sm:px-6">
                        {formatCurrency(totals.grand)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.35rem] border border-[color:var(--line)] bg-white p-5">
                <p className="label-chip text-[color:var(--brand)]">Client response</p>
                <p className="mt-3 text-base font-semibold tracking-tight text-foreground">
                  {draft.approval.signerName || "Awaiting signer"}
                </p>
                <p className="mt-1 text-sm text-[color:var(--ink-soft)]">
                  {draft.approval.signerTitle || "No title entered"}
                </p>
                <p className="mt-4 text-sm leading-7 text-[color:var(--ink-soft)]">
                  {draft.approval.responseNote || "No response note has been recorded."}
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-[color:var(--line)] bg-white p-5">
                <p className="label-chip text-[color:var(--brand)]">Office note</p>
                <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
                  {draft.officeNote}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-[1.9rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]">
            <CardContent className="space-y-4 p-6 sm:p-8">
              <p className="label-chip text-[color:var(--brand)]">Attachment strip</p>
              <div className="grid gap-3">
                {draft.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="overflow-hidden rounded-[1.35rem] border border-[color:var(--line)] bg-white"
                  >
                    <Image
                      src={photo.url}
                      alt={photo.name}
                      width={960}
                      height={576}
                      unoptimized
                      className="h-48 w-full object-cover"
                      sizes="(min-width: 1280px) 30vw, 100vw"
                    />
                    <div className="p-4">
                      <p className="text-sm text-[color:var(--ink-soft)]">{photo.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[1.9rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]">
            <CardContent className="space-y-4 p-6 sm:p-8">
              <p className="label-chip text-[color:var(--brand)]">Quick actions</p>
              <Button
                asChild
                className="h-12 w-full rounded-full text-sm font-semibold text-[color:var(--primary-foreground)] hover:opacity-95"
                style={{ backgroundColor: "var(--brand)" }}
              >
                <Link href="/studio">Edit the live request</Link>
              </Button>
              <Button
                asChild
                className="h-12 w-full rounded-full border border-[color:var(--line)] bg-white/65 text-sm font-semibold text-foreground hover:bg-white"
              >
                <Link href="/approve/demo">Return to client approval</Link>
              </Button>
              <Separator className="bg-[color:var(--line)]" />
              <div className="grid gap-3">
                {[
                  ["Prepared", formatTimestamp(draft.approvalSentAt)],
                  ["Responded", formatTimestamp(draft.approval.respondedAt)],
                  ["Grand total", formatCurrency(totals.grand)],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-[color:var(--ink-soft)]">{label}</span>
                    <span className="font-semibold text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
