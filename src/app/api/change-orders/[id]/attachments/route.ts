import { NextResponse } from "next/server";
import { getUserWorkspace } from "@/lib/workspace";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const wsData = await getUserWorkspace();
  if (!wsData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const co = await prisma.changeOrder.findFirst({ where: { id, workspaceId: wsData.workspace.id } });
  if (!co) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const atts = await prisma.changeOrderAttachment.findMany({ where: { changeOrderId: id } });
  return NextResponse.json(atts);
}

const schema = z.object({ fileName: z.string(), fileType: z.string(), dataUrl: z.string() });

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  const wsData = await getUserWorkspace();
  if (!wsData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const co = await prisma.changeOrder.findFirst({ where: { id, workspaceId: wsData.workspace.id } });
  if (!co) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const body = schema.parse(await req.json());
    const att = await prisma.changeOrderAttachment.create({ data: { changeOrderId: id, ...body } });
    return NextResponse.json(att, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  await params;
  const wsData = await getUserWorkspace();
  if (!wsData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const attId = url.searchParams.get("attachmentId");
  if (!attId) return NextResponse.json({ error: "attachmentId required" }, { status: 400 });
  const att = await prisma.changeOrderAttachment.findFirst({
    where: { id: attId, changeOrder: { workspaceId: wsData.workspace.id } },
  });
  if (!att) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.changeOrderAttachment.delete({ where: { id: attId } });
  return NextResponse.json({ ok: true });
}
