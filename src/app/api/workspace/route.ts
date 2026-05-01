import { NextResponse } from "next/server";
import { getUserWorkspace } from "@/lib/workspace";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  const wsData = await getUserWorkspace();
  if (!wsData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(wsData.workspace);
}

const schema = z.object({
  name: z.string().min(1).optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  defaultTerms: z.string().optional(),
  taxRate: z.number().min(0).max(100).optional(),
  currency: z.string().length(3).optional(),
});

export async function PUT(req: Request) {
  const wsData = await getUserWorkspace();
  if (!wsData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = schema.parse(await req.json());
    const ws = await prisma.workspace.update({ where: { id: wsData.workspace.id }, data: body });
    return NextResponse.json(ws);
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
