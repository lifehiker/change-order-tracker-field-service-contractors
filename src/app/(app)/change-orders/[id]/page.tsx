import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getUserWorkspace } from "@/lib/workspace";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SendApprovalForm } from "./send-approval-form";

type Props = { params: Promise<{ id: string }> };

function statusColor(s: string) {
  const map: Record<string, string> = {
    APPROVED: "bg-emerald-100 text-emerald-900",
    REJECTED: "bg-rose-100 text-rose-900",
    SENT: "bg-blue-100 text-blue-900",
    VIEWED: "bg-amber-100 text-amber-900",
    INVOICED: "bg-violet-100 text-violet-900",
  };
  return map[s] ?? "bg-stone-100 text-stone-700";
}

function fmt(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
}

export default async function ChangeOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const wsData = await getUserWorkspace();
  if (!wsData) redirect("/login");

  const co = await prisma.changeOrder.findFirst({
    where: { id, workspaceId: wsData.workspace.id },
    include: {
      job: true,
      attachments: true,
      approvalRequests: { orderBy: { createdAt: "desc" }, take: 1 },
      events: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!co) notFound();
  const ap = co.approvalRequests[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Button asChild className="rounded-full border border-[color:var(--line)] bg-white/65 text-foreground hover:bg-white">
          <Link href={"/jobs/" + co.job.id}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="label-chip text-[color:var(--ink-soft)]">Change order</p>
            <Badge className={"rounded-full px-3 py-0.5 text-xs font-medium " + statusColor(co.status)}>{co.status}</Badge>
          </div>
          <h1 className="headline mt-1 text-4xl text-foreground">{co.title}</h1>
          <p className="mt-1 text-sm text-[color:var(--ink-soft)]">{co.job.customerName} · {co.job.siteAddress}</p>
        </div>
        <Button asChild className="rounded-full border border-[color:var(--line)] bg-white/65 text-sm text-foreground hover:bg-white">
          <a href={"/api/change-orders/" + co.id + "/pdf"} target="_blank" rel="noreferrer">
            <Download className="mr-1.5 h-4 w-4" />PDF
          </a>
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="section-card rounded-[1.9rem] p-6 space-y-4">
            {co.urgency !== "NORMAL" && (
              <Badge className="rounded-full bg-rose-100 px-3 py-1 text-sm text-rose-900">
                {co.urgency === "SAME_DAY" ? "Same day" : "High urgency"}
              </Badge>
            )}
            {co.description && (
              <div>
                <p className="label-chip text-[color:var(--ink-soft)]">Scope description</p>
                <p className="mt-2 text-sm leading-7 text-foreground">{co.description}</p>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-3">
              {[["Labor", co.laborImpactCents], ["Materials", co.materialImpactCents], ["Total", co.totalCents]].map(([lbl, v]) => (
                <div key={lbl as string} className="rounded-[1.2rem] bg-[color:var(--brand-soft)] p-4">
                  <p className="label-chip text-[color:var(--brand-deep)]">{lbl}</p>
                  <p className="mt-2 text-xl font-semibold text-foreground">{fmt(v as number)}</p>
                </div>
              ))}
            </div>
          </div>

          {co.attachments.length > 0 && (
            <div className="section-card rounded-[1.9rem] p-6">
              <p className="label-chip mb-4 text-[color:var(--ink-soft)]">Attachments</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {co.attachments.map((att) => (
                  <div key={att.id} className="overflow-hidden rounded-[1.2rem] border border-[color:var(--line)] bg-white/70">
                    {att.fileType.startsWith("image/") ? (
                      <Image
                        src={att.dataUrl}
                        alt={att.fileName}
                        width={960}
                        height={528}
                        unoptimized
                        className="h-44 w-full object-cover"
                        sizes="(min-width: 640px) 50vw, 100vw"
                      />
                    ) : (
                      <div className="flex h-32 items-center justify-center text-sm text-[color:var(--ink-soft)]">{att.fileName}</div>
                    )}
                    <p className="p-3 text-xs text-[color:var(--ink-soft)]">{att.fileName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {co.events.length > 0 && (
            <div className="section-card rounded-[1.9rem] p-6">
              <p className="label-chip mb-4 text-[color:var(--ink-soft)]">Activity</p>
              <div className="space-y-3">
                {co.events.map((ev) => (
                  <div key={ev.id} className="flex items-start gap-3">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[color:var(--brand)]" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{ev.type.replace(/_/g, " ")}</p>
                      <p className="text-xs text-[color:var(--ink-soft)]">{new Date(ev.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Card className="rounded-[1.9rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]">
            <CardContent className="p-6 space-y-3">
              <p className="label-chip text-[color:var(--brand)]">Cost breakdown</p>
              {[["Labor", co.laborImpactCents], ["Materials", co.materialImpactCents], ["Other", co.otherImpactCents]].map(([lbl, v]) => (
                <div key={lbl as string} className="flex items-center justify-between text-sm">
                  <span className="text-[color:var(--ink-soft)]">{lbl}</span>
                  <span className="font-medium text-foreground">{fmt(v as number)}</span>
                </div>
              ))}
              <Separator className="bg-[color:var(--line)]" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="headline text-4xl text-[color:var(--brand)]">{fmt(co.totalCents)}</span>
              </div>
            </CardContent>
          </Card>

          {ap && (
            <Card className="rounded-[1.9rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]">
              <CardContent className="p-6 space-y-2">
                <p className="label-chip mb-2 text-[color:var(--ink-soft)]">Approval details</p>
                {[["Recipient", ap.recipientName ?? "—"], ["Email", ap.recipientEmail ?? "—"],
                  ["Signer", ap.signerName ?? "Pending"],
                  ["Link", `/approve/${ap.token}`]].map(([lbl, v]) => (
                  <div key={lbl} className="flex items-start justify-between gap-3 text-sm">
                    <span className="shrink-0 text-[color:var(--ink-soft)]">{lbl}</span>
                    {lbl === "Link" ? (
                      <a href={v} target="_blank" className="truncate text-xs text-[color:var(--brand)] hover:underline">{v}</a>
                    ) : (
                      <span className="text-right font-medium text-foreground">{v}</span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {(co.status === "DRAFT" || co.status === "SENT" || co.status === "VIEWED") && (
            <SendApprovalForm
              changeOrderId={co.id}
              jobSiteAddress={co.job.siteAddress}
              defaultTitle={co.title}
              currentStatus={co.status}
              defaultEmail={co.job.customerEmail ?? ""}
              defaultName={co.job.customerName}
            />
          )}
        </div>
      </div>
    </div>
  );
}
