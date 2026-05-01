import { NextResponse } from "next/server";
import { getUserWorkspace } from "@/lib/workspace";
import { prisma } from "@/lib/prisma";

function fmt(d: Date | null) { return d ? new Date(d).toISOString().split("T")[0] : ""; }
function money(c: number) { return (c / 100).toFixed(2); }

export async function GET() {
  const wsData = await getUserWorkspace();
  if (!wsData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.changeOrder.findMany({
    where: { workspaceId: wsData.workspace.id },
    orderBy: { createdAt: "desc" },
    include: { job: { select: { customerName: true, siteAddress: true } } },
  });

  const header = ["ID","Title","Customer","Site Address","Status","Total ($)","Created","Sent","Approved","Rejected","Invoiced"];
  const rows = orders.map(co => [
    co.id, co.title, co.job.customerName, co.job.siteAddress, co.status,
    money(co.totalCents), fmt(co.createdAt), fmt(co.sentAt), fmt(co.approvedAt), fmt(co.rejectedAt), fmt(co.invoicedAt),
  ].map(v => `"${String(v ?? "").replace(/"/g, "\"")}"`).join(","));

  const csv = [header.join(","), ...rows].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=change-orders.csv",
    },
  });
}
