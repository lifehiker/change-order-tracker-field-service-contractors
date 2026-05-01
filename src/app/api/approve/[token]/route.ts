import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  getApprovalRequestByToken,
  markApprovalRequestViewed,
} from "@/lib/approval";

type Params = { params: Promise<{ token: string }> };

export async function GET(_: Request, { params }: Params) {
  const { token } = await params;
  const approvalRequest = await getApprovalRequestByToken(token);
  if (!approvalRequest) return NextResponse.json({ error: "Link not found" }, { status: 404 });

  const viewedApprovalRequest = await markApprovalRequestViewed(approvalRequest);

  return NextResponse.json(viewedApprovalRequest);
}

const schema = z.object({
  action: z.enum(["approve", "reject"]),
  signerName: z.string().min(1),
  responseNote: z.string().optional(),
});

export async function POST(req: Request, { params }: Params) {
  const { token } = await params;
  const ap = await prisma.approvalRequest.findUnique({ where: { token } });
  if (!ap) return NextResponse.json({ error: "Link not found" }, { status: 404 });
  if (ap.approvedAt || ap.rejectedAt) return NextResponse.json({ error: "Already decided" }, { status: 400 });

  try {
    const body = schema.parse(await req.json());
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0]?.trim() : "unknown";
    const now = new Date();

    const approved = body.action === "approve";
    await prisma.approvalRequest.update({
      where: { token },
      data: {
        signerName: body.signerName,
        signerIp: ip,
        ...(approved ? { approvedAt: now } : { rejectedAt: now }),
      },
    });
    await prisma.changeOrder.update({
      where: { id: ap.changeOrderId },
      data: {
        status: approved ? "APPROVED" : "REJECTED",
        ...(approved ? { approvedAt: now } : { rejectedAt: now }),
      },
    });
    await prisma.approvalEvent.create({
      data: {
        changeOrderId: ap.changeOrderId,
        type: approved ? "APPROVED" : "REJECTED",
        actorType: "CLIENT",
        metadataJson: JSON.stringify({ signerName: body.signerName, note: body.responseNote }),
      },
    });
    return NextResponse.json({ ok: true, status: approved ? "APPROVED" : "REJECTED" });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
