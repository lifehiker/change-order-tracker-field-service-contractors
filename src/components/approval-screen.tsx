"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, MessageSquareText, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  calculateGrandTotal,
  calculateLaborTotal,
  calculateMaterialTotal,
  defaultDraft,
  DEMO_STORAGE_KEY,
  formatCurrency,
  formatTimestamp,
  type ChangeOrderDraft,
  type DecisionState,
} from "@/lib/demo-store";

function statusLabel(state: DecisionState) {
  switch (state) {
    case "approved":
      return "Approved";
    case "needs_changes":
      return "Needs changes";
    case "declined":
      return "Declined";
    default:
      return "Awaiting decision";
  }
}

export function ApprovalScreen() {
  const [draft, setDraft] = useState<ChangeOrderDraft>(defaultDraft);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);

    if (raw) {
      try {
        setDraft(JSON.parse(raw) as ChangeOrderDraft);
      } catch {
        setDraft(defaultDraft);
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(draft));
  }, [draft, hydrated]);

  const totals = useMemo(
    () => ({
      labor: calculateLaborTotal(draft),
      materials: calculateMaterialTotal(draft.materials),
      grand: calculateGrandTotal(draft),
    }),
    [draft],
  );

  function decide(state: DecisionState) {
    if (!draft.approval.signerName.trim()) {
      toast.error("Signer name is required for the demo approval flow.");
      return;
    }

    setDraft((current) => ({
      ...current,
      approval: {
        ...current.approval,
        state,
        respondedAt: new Date().toISOString(),
      },
    }));

    toast.success(`Change request marked as ${statusLabel(state).toLowerCase()}.`);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.86fr]">
      <div className="section-card rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="rounded-full bg-[color:var(--brand-soft)] px-3 py-1 text-[color:var(--brand-deep)]">
            Client approval
          </Badge>
          <span className="label-chip text-[color:var(--ink-soft)]">
            {draft.approvalSentAt
              ? `Prepared ${formatTimestamp(draft.approvalSentAt)}`
              : "Demo preview"}
          </span>
        </div>
        <h1 className="headline mt-5 text-6xl text-foreground sm:text-7xl">
          Review the scope delta and decide before work continues.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[color:var(--ink-soft)]">
          This screen is intentionally simple for the client: what changed, why it changed,
          what it costs, and a clear approval response.
        </p>

        <div className="mt-8 rounded-[1.6rem] border border-[color:var(--line)] bg-white/70 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="label-chip text-[color:var(--brand)]">{draft.trade}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                {draft.changeTitle}
              </p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
                {draft.jobName} • {draft.siteLocation}
              </p>
            </div>
            <Badge className="rounded-full bg-stone-200 px-3 py-1 text-stone-900">
              {statusLabel(draft.approval.state)}
            </Badge>
          </div>
          <Separator className="my-5 bg-[color:var(--line)]" />
          <p className="text-sm leading-7 text-[color:var(--ink-soft)]">{draft.scopeSummary}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.2rem] bg-[color:var(--brand-soft)] p-4">
              <p className="label-chip text-[color:var(--brand-deep)]">Labor</p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {draft.laborHours} hrs
              </p>
            </div>
            <div className="rounded-[1.2rem] bg-[color:var(--brand-soft)] p-4">
              <p className="label-chip text-[color:var(--brand-deep)]">Materials</p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {formatCurrency(totals.materials)}
              </p>
            </div>
            <div className="rounded-[1.2rem] bg-[color:var(--brand-soft)] p-4">
              <p className="label-chip text-[color:var(--brand-deep)]">Total</p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {formatCurrency(totals.grand)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {draft.photos.map((photo) => (
            <div
              key={photo.id}
              className="overflow-hidden rounded-[1.5rem] border border-[color:var(--line)] bg-white/70"
            >
              <Image
                src={photo.url}
                alt={photo.name}
                width={960}
                height={640}
                unoptimized
                className="h-56 w-full object-cover"
                sizes="(min-width: 640px) 50vw, 100vw"
              />
              <div className="p-4">
                <p className="text-sm text-[color:var(--ink-soft)]">{photo.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5">
        <Card className="blueprint-panel rounded-[2rem] border-0 text-[#f4eee4]">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#88c8ca]" />
              <p className="text-base font-semibold tracking-tight text-[#f4eee4]">
                Decision panel
              </p>
            </div>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="signerName" className="text-white/75">
                  Signer name
                </Label>
                <Input
                  id="signerName"
                  className="mt-2 border-white/12 bg-white/8 text-white placeholder:text-white/40"
                  value={draft.approval.signerName}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      approval: {
                        ...current.approval,
                        signerName: event.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="signerTitle" className="text-white/75">
                  Title
                </Label>
                <Input
                  id="signerTitle"
                  className="mt-2 border-white/12 bg-white/8 text-white placeholder:text-white/40"
                  value={draft.approval.signerTitle}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      approval: {
                        ...current.approval,
                        signerTitle: event.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="responseNote" className="text-white/75">
                  Note back to the crew
                </Label>
                <Textarea
                  id="responseNote"
                  className="mt-2 min-h-[130px] border-white/12 bg-white/8 text-white placeholder:text-white/40"
                  value={draft.approval.responseNote}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      approval: {
                        ...current.approval,
                        responseNote: event.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-3">
              <Button
                onClick={() => decide("approved")}
                className="h-12 rounded-full bg-[#88c8ca] text-sm font-semibold text-[#12383d] hover:bg-[#9cd5d7]"
              >
                Approve extra work
              </Button>
              <Button
                onClick={() => decide("needs_changes")}
                className="h-12 rounded-full border border-white/12 bg-white/8 text-sm font-semibold text-[#f4eee4] hover:bg-white/12"
              >
                Request revision
              </Button>
              <Button
                onClick={() => decide("declined")}
                className="h-12 rounded-full border border-white/12 bg-transparent text-sm font-semibold text-white/75 hover:bg-white/10"
              >
                Decline change
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[1.9rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]">
          <CardContent className="space-y-4 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <MessageSquareText className="h-5 w-5 text-[color:var(--brand)]" />
              <p className="text-base font-semibold tracking-tight text-foreground">
                Decision summary
              </p>
            </div>
            <div className="grid gap-3">
              {[
                ["Client", draft.clientName],
                ["Contact", draft.clientContact],
                ["Decision", statusLabel(draft.approval.state)],
                ["Responded", formatTimestamp(draft.approval.respondedAt)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-[1.2rem] border border-[color:var(--line)] bg-white/65 px-4 py-3"
                >
                  <p className="label-chip text-[color:var(--ink-soft)]">{label}</p>
                  <p className="text-sm font-medium text-foreground">{value}</p>
                </div>
              ))}
            </div>
            <p className="rounded-[1.25rem] border border-[color:var(--line)] bg-white/55 p-4 text-sm leading-7 text-[color:var(--ink-soft)]">
              {draft.approval.responseNote || "No note has been left yet."}
            </p>
            <Button
              asChild
              className="h-12 rounded-full text-sm font-semibold text-[color:var(--primary-foreground)] hover:opacity-95"
              style={{ backgroundColor: "var(--brand)" }}
            >
              <Link href="/docs/demo">
                View invoice-ready documentation
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
