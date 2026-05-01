import { NextResponse } from "next/server";
import { getUserWorkspace } from "@/lib/workspace";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const wsData = await getUserWorkspace();
  if (!wsData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const co = await prisma.changeOrder.findFirst({
    where: { id, workspaceId: wsData.workspace.id },
    include: { job: true, attachments: true, approvalRequests: { orderBy: { createdAt: "desc" }, take: 1 }, events: { orderBy: { createdAt: "desc" } } },
  });
  if (!co) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(co);
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  const wsData = await getUserWorkspace();
  if (!wsData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const co = await prisma.changeOrder.findFirst({ where: { id, workspaceId: wsData.workspace.id } });
  if (!co) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (co.status !== "DRAFT") return NextResponse.json({ error: "Only DRAFT orders can be edited" }, { status: 400 });
  const body = await req.json() as Record<string, unknown>;
  const allowed = ["title","description","urgency","laborImpactCents","materialImpactCents","otherImpactCents"];
  const data: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) data[k] = body[k];
  if ("laborImpactCents" in data || "materialImpactCents" in data || "otherImpactCents" in data) {
    data.totalCents = (Number(data.laborImpactCents ?? co.laborImpactCents) +
      Number(data.materialImpactCents ?? co.materialImpactCents) +
      Number(data.otherImpactCents ?? co.otherImpactCents));
  }
  const updated = await prisma.changeOrder.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  const wsData = await getUserWorkspace();
  if (!wsData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const co = await prisma.changeOrder.findFirst({ where: { id, workspaceId: wsData.workspace.id } });
  if (!co) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (co.status !== "DRAFT") return NextResponse.json({ error: "Only DRAFT orders can be deleted" }, { status: 400 });
  await prisma.changeOrder.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
