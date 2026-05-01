import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getUserWorkspace } from "@/lib/workspace";
import { ChangeOrdersLanding } from "@/components/change-orders-landing";
import { FileText, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Change Orders",
  description:
    "See how field-service contractors capture scope changes, request approval, and keep invoice-ready documentation organized.",
};

function statusColor(s: string) {
  const m: Record<string, string> = {
    APPROVED: "bg-emerald-100 text-emerald-900",
    REJECTED: "bg-rose-100 text-rose-900",
    SENT: "bg-blue-100 text-blue-900",
    VIEWED: "bg-amber-100 text-amber-900",
    INVOICED: "bg-violet-100 text-violet-900",
  };
  return m[s] ?? "bg-stone-100 text-stone-700";
}

function fmt(c: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(c / 100);
}

export default async function ChangeOrdersPage() {
  const wsData = await getUserWorkspace();

  if (!wsData) {
    return <ChangeOrdersLanding />;
  }

  const orders = await prisma.changeOrder.findMany({
    where: { workspaceId: wsData.workspace.id },
    orderBy: { createdAt: "desc" },
    include: { job: { select: { customerName: true, siteAddress: true } } },
  });

  if (!wsData.workspace) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-chip text-[color:var(--ink-soft)]">All work</p>
          <h1 className="headline mt-1 text-5xl text-foreground">Change Orders</h1>
        </div>
        <form action="/api/change-orders/export" method="get">
          <Button
            type="submit"
            className="rounded-full border border-[color:var(--line)] bg-white/65 text-sm text-foreground hover:bg-white"
          >
            <Download className="mr-1.5 h-4 w-4" />
            CSV Export
          </Button>
        </form>
      </div>

      {orders.length === 0 ? (
        <div className="section-card rounded-[1.9rem] p-10 text-center">
          <FileText className="mx-auto h-10 w-10 text-[color:var(--brand)]" />
          <h2 className="headline mt-4 text-4xl text-foreground">No change orders yet</h2>
          <p className="mt-3 text-sm text-[color:var(--ink-soft)]">
            Create a job first, then add change orders from the job detail page.
          </p>
          <Button
            asChild
            className="mt-6 h-11 rounded-full px-5 text-sm font-semibold"
            style={{ backgroundColor: "var(--brand)", color: "var(--primary-foreground)" }}
          >
            <Link href="/jobs/new">Create a job</Link>
          </Button>
        </div>
      ) : (
        <div className="section-card space-y-2 rounded-[1.9rem] p-4">
          {orders.map((co) => (
            <Link
              key={co.id}
              href={`/change-orders/${co.id}`}
              className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-[color:var(--line)] bg-white/55 px-5 py-4 transition-colors hover:border-[color:var(--brand)]"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{co.title}</p>
                <p className="mt-0.5 text-xs text-[color:var(--ink-soft)]">
                  {co.job.customerName} · {co.job.siteAddress}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm font-semibold text-foreground">
                  {fmt(co.totalCents)}
                </span>
                <Badge
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(co.status)}`}
                >
                  {co.status}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
