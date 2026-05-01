import { NextResponse } from "next/server";
import { getUserWorkspace } from "@/lib/workspace";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email().optional().or(z.literal("")),
  siteAddress: z.string().min(1),
  originalScope: z.string().optional(),
});

export async function GET() {
  const wsData = await getUserWorkspace();
  if (!wsData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const jobs = await prisma.job.findMany({
    where: { workspaceId: wsData.workspace.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { changeOrders: true } } },
  });
  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  const wsData = await getUserWorkspace();
  if (!wsData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = schema.parse(await req.json());
    const job = await prisma.job.create({
      data: { ...body, workspaceId: wsData.workspace.id, createdById: wsData.userId },
    });
    return NextResponse.json(job, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
