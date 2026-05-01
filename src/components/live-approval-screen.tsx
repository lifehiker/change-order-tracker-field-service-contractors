"use client";

import Image from "next/image";
import { useState } from "react";
import { MessageSquareText, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { ApprovalRequestRecord } from "@/lib/approval";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type LiveApprovalScreenProps = {
  approvalRequest: ApprovalRequestRecord;
};

function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatTimestamp(value?: Date | null) {
  if (!value) return "Not yet recorded";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusLabel(status: string) {
  switch (status) {
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    case "VIEWED":
      return "Under review";
    default:
      return "Awaiting decision";
  }
}

function statusTone(status: string) {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-100 text-emerald-900";
    case "REJECTED":
      return "bg-rose-100 text-rose-900";
    case "VIEWED":
      return "bg-amber-100 text-amber-900";
    default:
      return "bg-stone-200 text-stone-900";
  }
}

export function LiveApprovalScreen({ approvalRequest }: LiveApprovalScreenProps) {
  const { changeOrder } = approvalRequest;
  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState(changeOrder.status);
  const [signerName, setSignerName] = useState(approvalRequest.signerName ?? approvalRequest.recipientName ?? "");
  const [signerTitle, setSignerTitle] = useState("");
  const [responseNote, setResponseNote] = useState("");

  const currency = changeOrder.workspace.currency || "USD";
  const isResolved = decision === "APPROVED" || decision === "REJECTED";

  async function submitDecision(action: "approve" | "reject") {
    if (!signerName.trim()) {
      toast.error("Signer name is required.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/approve/${approvalRequest.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          signerName: signerTitle.trim() ? `${signerName.trim()} — ${signerTitle.trim()}` : signerName.trim(),
          responseNote,
        }),
      });

      const data = (await res.json()) as { error?: string; status?: string };

      if (!res.ok) {
        toast.error(data.error ?? "The approval could not be recorded.");
        return;
      }

      setDecision(data.status ?? (action === "approve" ? "APPROVED" : "REJECTED"));
      toast.success(action === "approve" ? "Change order approved." : "Change order declined.");
    } catch {
      toast.error("The approval could not be recorded.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.86fr]">
      <div className="section-card rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="rounded-full bg-[color:var(--brand-soft)] px-3 py-1 text-[color:var(--brand-deep)]">
            Client approval
          </Badge>
          <span className="label-chip text-[color:var(--ink-soft)]">
            Opened {formatTimestamp(approvalRequest.viewedAt ?? new Date())}
          </span>
        </div>
        <h1 className="headline mt-5 text-6xl text-foreground sm:text-7xl">
          Review the scope delta before the crew proceeds.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[color:var(--ink-soft)]">
          {changeOrder.workspace.name} is requesting approval for added work at{" "}
          {changeOrder.job.siteAddress}. Review the reason, the cost impact, and any field
          documentation below.
        </p>

        <div className="mt-8 rounded-[1.6rem] border border-[color:var(--line)] bg-white/70 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="label-chip text-[color:var(--brand)]">Change order</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                {changeOrder.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
                {changeOrder.job.customerName} • {changeOrder.job.siteAddress}
              </p>
            </div>
            <Badge className={`rounded-full px-3 py-1 ${statusTone(decision)}`}>
              {statusLabel(decision)}
            </Badge>
          </div>
          <Separator className="my-5 bg-[color:var(--line)]" />
          <p className="text-sm leading-7 text-[color:var(--ink-soft)]">
            {changeOrder.description || approvalRequest.message || "Additional scope was recorded in the field and is ready for your review."}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <div className="rounded-[1.2rem] bg-[color:var(--brand-soft)] p-4">
              <p className="label-chip text-[color:var(--brand-deep)]">Status</p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {changeOrder.urgency === "SAME_DAY" ? "Same day" : changeOrder.urgency.toLowerCase().replace("_", " ")}
              </p>
            </div>
            <div className="rounded-[1.2rem] bg-[color:var(--brand-soft)] p-4">
              <p className="label-chip text-[color:var(--brand-deep)]">Labor</p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {formatMoney(changeOrder.laborImpactCents, currency)}
              </p>
            </div>
            <div className="rounded-[1.2rem] bg-[color:var(--brand-soft)] p-4">
              <p className="label-chip text-[color:var(--brand-deep)]">Materials</p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {formatMoney(changeOrder.materialImpactCents, currency)}
              </p>
            </div>
            <div className="rounded-[1.2rem] bg-[color:var(--brand-soft)] p-4">
              <p className="label-chip text-[color:var(--brand-deep)]">Total</p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {formatMoney(changeOrder.totalCents, currency)}
              </p>
            </div>
          </div>
        </div>

        {changeOrder.attachments.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {changeOrder.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="overflow-hidden rounded-[1.5rem] border border-[color:var(--line)] bg-white/70"
              >
                {attachment.fileType.startsWith("image/") ? (
                  <Image
                    src={attachment.dataUrl}
                    alt={attachment.fileName}
                    width={960}
                    height={640}
                    unoptimized
                    className="h-56 w-full object-cover"
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center text-sm text-[color:var(--ink-soft)]">
                    {attachment.fileName}
                  </div>
                )}
                <div className="p-4">
                  <p className="text-sm text-[color:var(--ink-soft)]">{attachment.fileName}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
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
                  value={signerName}
                  onChange={(event) => setSignerName(event.target.value)}
                  disabled={isResolved}
                />
              </div>
              <div>
                <Label htmlFor="signerTitle" className="text-white/75">
                  Title
                </Label>
                <Input
                  id="signerTitle"
                  className="mt-2 border-white/12 bg-white/8 text-white placeholder:text-white/40"
                  value={signerTitle}
                  onChange={(event) => setSignerTitle(event.target.value)}
                  disabled={isResolved}
                  placeholder="Project manager, owner rep, facilities lead…"
                />
              </div>
              <div>
                <Label htmlFor="responseNote" className="text-white/75">
                  Note back to the crew
                </Label>
                <Textarea
                  id="responseNote"
                  className="mt-2 min-h-[130px] border-white/12 bg-white/8 text-white placeholder:text-white/40"
                  value={responseNote}
                  onChange={(event) => setResponseNote(event.target.value)}
                  disabled={isResolved}
                  placeholder="Optional context, constraints, or clarifications."
                />
              </div>
            </div>
            <div className="grid gap-3">
              <Button
                onClick={() => submitDecision("approve")}
                disabled={loading || isResolved}
                className="h-12 rounded-full bg-[#88c8ca] text-sm font-semibold text-[#12383d] hover:bg-[#9cd5d7]"
              >
                {loading ? "Saving…" : "Approve extra work"}
              </Button>
              <Button
                onClick={() => submitDecision("reject")}
                disabled={loading || isResolved}
                className="h-12 rounded-full border border-white/12 bg-transparent text-sm font-semibold text-white/75 hover:bg-white/10"
              >
                {loading ? "Saving…" : "Decline change"}
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
            <div className="rounded-[1.35rem] border border-[color:var(--line)] bg-white p-5">
              <p className="label-chip text-[color:var(--brand)]">Requested by</p>
              <p className="mt-3 text-base font-semibold tracking-tight text-foreground">
                {changeOrder.workspace.name}
              </p>
              <p className="mt-1 text-sm text-[color:var(--ink-soft)]">
                Recipient: {approvalRequest.recipientName || approvalRequest.recipientEmail || "Client contact"}
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-[color:var(--line)] bg-white p-5">
              <p className="label-chip text-[color:var(--brand)]">Terms</p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
                {changeOrder.workspace.defaultTerms || "Approval authorizes the additional scope and its listed cost impact."}
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-[color:var(--line)] bg-white p-5">
              <p className="label-chip text-[color:var(--brand)]">Current state</p>
              <p className="mt-3 text-base font-semibold tracking-tight text-foreground">
                {statusLabel(decision)}
              </p>
              <p className="mt-1 text-sm text-[color:var(--ink-soft)]">
                Sent {formatTimestamp(changeOrder.sentAt)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
