import { NextResponse } from "next/server";
import { getUserWorkspace } from "@/lib/workspace";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ jobId: string }> };

export async function GET(_: Request, { params }: Params) {
  const { jobId } = await params;
  const wsData = await getUserWorkspace();
  if (!wsData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const job = await prisma.job.findFirst({
    where: { id: jobId, workspaceId: wsData.workspace.id },
    include: { changeOrders: { orderBy: { createdAt: "desc" } } },
  });
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(job);
}

export async function PUT(req: Request, { params }: Params) {
  const { jobId } = await params;
  const wsData = await getUserWorkspace();
  if (!wsData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const job = await prisma.job.findFirst({ where: { id: jobId, workspaceId: wsData.workspace.id } });
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json() as Record<string, unknown>;
  const updated = await prisma.job.update({ where: { id: jobId }, data: body });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Params) {
  const { jobId } = await params;
  const wsData = await getUserWorkspace();
  if (!wsData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const job = await prisma.job.findFirst({ where: { id: jobId, workspaceId: wsData.workspace.id } });
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.job.delete({ where: { id: jobId } });
  return NextResponse.json({ ok: true });
}
