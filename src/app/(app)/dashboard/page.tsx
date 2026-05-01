import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserWorkspace } from "@/lib/workspace";
import { prisma } from "@/lib/prisma";
import {
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Plus,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

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

export default async function DashboardPage() {
  const wsData = await getUserWorkspace();
  if (!wsData) redirect("/login");

  const { workspace } = wsData;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [awaitingCount, approvedNotInvoiced, rejectedCount, monthlyCount, recentOrders, jobCount] =
    await Promise.all([
      prisma.changeOrder.count({
        where: { workspaceId: workspace.id, status: { in: ["SENT", "VIEWED"] } },
      }),
      prisma.changeOrder.count({
        where: { workspaceId: workspace.id, status: "APPROVED" },
      }),
      prisma.changeOrder.count({
        where: { workspaceId: workspace.id, status: "REJECTED", rejectedAt: { gte: startOfMonth } },
      }),
      prisma.changeOrder.count({
        where: { workspaceId: workspace.id, createdAt: { gte: startOfMonth } },
      }),
      prisma.changeOrder.findMany({
        where: { workspaceId: workspace.id },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { job: { select: { customerName: true, siteAddress: true } } },
      }),
      prisma.job.count({ where: { workspaceId: workspace.id } }),
    ]);

  const stats = [
    { label: "Awaiting approval", value: awaitingCount, icon: Clock, color: "text-blue-600" },
    { label: "Approved, not invoiced", value: approvedNotInvoiced, icon: CheckCircle2, color: "text-emerald-600" },
    { label: "Rejected this month", value: rejectedCount, icon: XCircle, color: "text-rose-600" },
    { label: "Change orders this month", value: monthlyCount, icon: FileText, color: "text-[color:var(--brand)]" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="label-chip text-[color:var(--ink-soft)]">{workspace.name}</p>
          <h1 className="headline mt-1 text-5xl text-foreground">Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <Button asChild className="rounded-full border border-[color:var(--line)] bg-white/65 text-sm text-foreground hover:bg-white">
            <Link href="/jobs/new">
              <Briefcase className="mr-1.5 h-4 w-4" />
              New Job
            </Link>
          </Button>
        </div>
      </div>

      {jobCount === 0 ? (
        <div className="section-card rounded-[1.9rem] p-10 text-center">
          <ClipboardPlusIcon />
          <h2 className="headline mt-4 text-4xl text-foreground">Welcome to Change Order Tracker</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[color:var(--ink-soft)]">
            Start by creating your first job. From there, you can add change orders, send approval links, and generate invoice-ready documentation.
          </p>
          <Button
            asChild
            className="mt-6 h-12 rounded-full px-6 text-sm font-semibold"
            style={{ backgroundColor: "var(--brand)", color: "var(--primary-foreground)" }}
          >
            <Link href="/jobs/new">
              <Plus className="mr-1.5 h-4 w-4" />
              Create your first job
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="rounded-[1.7rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="label-chip text-[color:var(--ink-soft)]">{stat.label}</p>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <p className="headline mt-3 text-5xl text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="section-card rounded-[1.9rem] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Recent change orders</h2>
              <Link href="/change-orders" className="label-chip text-[color:var(--brand)] hover:underline">
                View all <ArrowRight className="inline h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {recentOrders.length === 0 ? (
                <p className="py-8 text-center text-sm text-[color:var(--ink-soft)]">No change orders yet.</p>
              ) : (
                recentOrders.map((co) => (
                  <Link
                    key={co.id}
                    href={`/change-orders/${co.id}`}
                    className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-[color:var(--line)] bg-white/55 px-4 py-3 hover:border-[color:var(--brand)] transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{co.title}</p>
                      <p className="truncate text-xs text-[color:var(--ink-soft)]">{co.job.customerName} · {co.job.siteAddress}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-sm font-semibold text-foreground">{formatMoney(co.totalCents)}</span>
                      <Badge className={`rounded-full px-3 py-0.5 text-xs font-medium ${statusColor(co.status)}`}>
                        {co.status}
                      </Badge>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ClipboardPlusIcon() {
  return (
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl blueprint-panel">
      <FileText className="h-8 w-8 text-[#88c8ca]" />
    </div>
  );
}
