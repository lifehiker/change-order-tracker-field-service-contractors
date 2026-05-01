import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserWorkspace } from "@/lib/workspace";
import { prisma } from "@/lib/prisma";
import { Plus, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function JobsPage() {
  const wsData = await getUserWorkspace();
  if (!wsData) redirect("/login");

  const jobs = await prisma.job.findMany({
    where: { workspaceId: wsData.workspace.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { changeOrders: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-chip text-[color:var(--ink-soft)]">Field work</p>
          <h1 className="headline mt-1 text-5xl text-foreground">Jobs</h1>
        </div>
        <Button
          asChild
          className="h-11 rounded-full px-5 text-sm font-semibold"
          style={{ backgroundColor: "var(--brand)", color: "var(--primary-foreground)" }}
        >
          <Link href="/jobs/new">
            <Plus className="mr-1.5 h-4 w-4" />
            New job
          </Link>
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div className="section-card rounded-[1.9rem] p-10 text-center">
          <p className="label-chip text-[color:var(--ink-soft)]">Nothing here yet</p>
          <h2 className="headline mt-3 text-4xl text-foreground">Create your first job</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[color:var(--ink-soft)]">
            Jobs track the customer and site. Change orders track the extra work.
          </p>
          <Button
            asChild
            className="mt-6 h-11 rounded-full px-5 text-sm font-semibold"
            style={{ backgroundColor: "var(--brand)", color: "var(--primary-foreground)" }}
          >
            <Link href="/jobs/new">
              <Plus className="mr-1.5 h-4 w-4" />
              New job
            </Link>
          </Button>
        </div>
      ) : (
        <div className="section-card rounded-[1.9rem] p-4 space-y-2">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-[color:var(--line)] bg-white/55 px-5 py-4 hover:border-[color:var(--brand)] transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground">{job.customerName}</p>
                <div className="mt-1 flex flex-wrap gap-3 text-xs text-[color:var(--ink-soft)]">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.siteAddress}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Badge className="rounded-full bg-[color:var(--brand-soft)] px-3 py-0.5 text-xs text-[color:var(--brand-deep)]">
                  {job._count.changeOrders} CO{job._count.changeOrders !== 1 ? "s" : ""}
                </Badge>
                <ChevronRight className="h-4 w-4 text-[color:var(--ink-soft)]" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
