import { NextResponse } from "next/server";
import { getUserWorkspace } from "@/lib/workspace";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

type Params = { params: Promise<{ jobId: string }> };

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  urgency: z.enum(["NORMAL", "HIGH", "SAME_DAY"]).default("NORMAL"),
  laborImpactCents: z.number().int().min(0).default(0),
  materialImpactCents: z.number().int().min(0).default(0),
  otherImpactCents: z.number().int().min(0).default(0),
});

export async function GET(_: Request, { params }: Params) {
  const { jobId } = await params;
  const wsData = await getUserWorkspace();
  if (!wsData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const orders = await prisma.changeOrder.findMany({
    where: { jobId, workspaceId: wsData.workspace.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function POST(req: Request, { params }: Params) {
  const { jobId } = await params;
  const wsData = await getUserWorkspace();
  if (!wsData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const job = await prisma.job.findFirst({ where: { id: jobId, workspaceId: wsData.workspace.id } });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  try {
    const body = schema.parse(await req.json());
    const totalCents = body.laborImpactCents + body.materialImpactCents + body.otherImpactCents;
    const co = await prisma.changeOrder.create({
      data: {
        ...body,
        totalCents,
        jobId,
        workspaceId: wsData.workspace.id,
        createdById: wsData.userId,
        events: { create: { type: "CREATED", actorType: "USER", actorUserId: wsData.userId } },
      },
    });
    return NextResponse.json(co, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
