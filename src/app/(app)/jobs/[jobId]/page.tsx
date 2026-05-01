import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getUserWorkspace } from "@/lib/workspace";
import { prisma } from "@/lib/prisma";
import { Plus, MapPin, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Props = { params: Promise<{ jobId: string }> };

function statusColor(status: string) {
  switch (status) {
    case "APPROVED": return "bg-emerald-100 text-emerald-900";
    case "REJECTED": return "bg-rose-100 text-rose-900";
    case "SENT": return "bg-blue-100 text-blue-900";
    case "VIEWED": return "bg-amber-100 text-amber-900";
    case "INVOICED": return "bg-violet-100 text-violet-900";
    default: return "bg-stone-100 text-stone-700";
  }
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
}

export default async function JobDetailPage({ params }: Props) {
  const { jobId } = await params;
  const wsData = await getUserWorkspace();
  if (!wsData) redirect("/login");

  const job = await prisma.job.findFirst({
    where: { id: jobId, workspaceId: wsData.workspace.id },
    include: {
      changeOrders: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!job) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild className="rounded-full border border-[color:var(--line)] bg-white/65 text-foreground hover:bg-white">
          <Link href="/jobs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <p className="label-chip text-[color:var(--ink-soft)]">Job</p>
          <h1 className="headline mt-1 text-4xl text-foreground truncate">{job.customerName}</h1>
        </div>
        <Button
          asChild
          className="h-11 rounded-full px-5 text-sm font-semibold shrink-0"
          style={{ backgroundColor: "var(--brand)", color: "var(--primary-foreground)" }}
        >
          <Link href={`/jobs/${job.id}/change-orders/new`}>
            <Plus className="mr-1.5 h-4 w-4" />
            New change order
          </Link>
        </Button>
      </div>

      <div className="section-card rounded-[1.9rem] p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="label-chip text-[color:var(--ink-soft)]">Site address</p>
            <p className="mt-2 flex items-center gap-2 text-foreground">
              <MapPin className="h-4 w-4 text-[color:var(--brand)]" />
              {job.siteAddress}
            </p>
          </div>
          {job.customerEmail && (
            <div>
              <p className="label-chip text-[color:var(--ink-soft)]">Customer email</p>
              <p className="mt-2 text-foreground">{job.customerEmail}</p>
            </div>
          )}
          {job.originalScope && (
            <div className="sm:col-span-2">
              <p className="label-chip text-[color:var(--ink-soft)]">Original scope</p>
              <p className="mt-2 text-sm leading-7 text-foreground">{job.originalScope}</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Change orders</h2>
          <Badge className="rounded-full bg-[color:var(--brand-soft)] px-3 py-0.5 text-xs text-[color:var(--brand-deep)]">
            {job.changeOrders.length}
          </Badge>
        </div>

        {job.changeOrders.length === 0 ? (
          <Card className="rounded-[1.9rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]">
            <CardContent className="p-8 text-center">
              <p className="text-sm text-[color:var(--ink-soft)]">No change orders yet for this job.</p>
              <Button
                asChild
                className="mt-4 h-10 rounded-full px-4 text-sm font-semibold"
                style={{ backgroundColor: "var(--brand)", color: "var(--primary-foreground)" }}
              >
                <Link href={`/jobs/${job.id}/change-orders/new`}>
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add first change order
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="section-card rounded-[1.9rem] p-4 space-y-2">
            {job.changeOrders.map((co) => (
              <Link
                key={co.id}
                href={`/change-orders/${co.id}`}
                className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-[color:var(--line)] bg-white/55 px-5 py-4 hover:border-[color:var(--brand)] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{co.title}</p>
                  <p className="mt-1 text-xs text-[color:var(--ink-soft)]">
                    {co.urgency !== "NORMAL" && <span className="mr-2 font-semibold text-rose-700">{co.urgency}</span>}
                    {new Date(co.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">{formatMoney(co.totalCents)}</span>
                  <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(co.status)}`}>
                    {co.status}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-[color:var(--ink-soft)]" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
