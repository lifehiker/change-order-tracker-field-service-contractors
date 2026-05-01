import { NextResponse } from "next/server";
import { getUserWorkspace } from "@/lib/workspace";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };
const schema = z.object({ status: z.enum(["INVOICED"]) });

export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params;
  const wsData = await getUserWorkspace();
  if (!wsData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const co = await prisma.changeOrder.findFirst({ where: { id, workspaceId: wsData.workspace.id } });
  if (!co) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    const { status } = schema.parse(await req.json());
    const data: Record<string, unknown> = { status };
    if (status === "INVOICED") data.invoicedAt = new Date();
    const updated = await prisma.changeOrder.update({ where: { id }, data });
    await prisma.approvalEvent.create({
      data: { changeOrderId: id, type: status, actorType: "USER", actorUserId: wsData.userId },
    });
    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
