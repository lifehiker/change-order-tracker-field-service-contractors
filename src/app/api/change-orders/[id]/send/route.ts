import { NextResponse } from "next/server";
import { getUserWorkspace } from "@/lib/workspace";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

type Params = { params: Promise<{ id: string }> };

const schema = z.object({
  recipientName: z.string().min(1),
  recipientEmail: z.string().email(),
  message: z.string().optional(),
});

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  const wsData = await getUserWorkspace();
  if (!wsData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const co = await prisma.changeOrder.findFirst({
    where: { id, workspaceId: wsData.workspace.id },
    include: { job: true },
  });
  if (!co) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = schema.parse(await req.json());
    const approval = await prisma.approvalRequest.create({
      data: {
        changeOrderId: id,
        recipientName: body.recipientName,
        recipientEmail: body.recipientEmail,
        message: body.message,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    await prisma.changeOrder.update({
      where: { id },
      data: { status: "SENT", sentAt: new Date() },
    });
    await prisma.approvalEvent.create({
      data: { changeOrderId: id, type: "SENT", actorType: "USER", actorUserId: wsData.userId },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const approvalUrl = `${appUrl}/approve/${approval.token}`;

    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.EMAIL_FROM ?? "noreply@changeordertracker.com",
          to: body.recipientEmail,
          subject: `Approval needed for extra work at ${co.job.siteAddress}`,
          html: `<p>Hi ${body.recipientName},</p><p>${body.message ?? "Please review the change order below."}</p><p><strong>Change:</strong> ${co.title}</p><p><strong>Total:</strong> $${(co.totalCents / 100).toFixed(2)}</p><p><a href="${approvalUrl}">Review and Approve</a></p>`,
        });
      } catch (emailErr) {
        console.error("[email] Failed to send approval email:", emailErr);
      }
    }

    return NextResponse.json({ ok: true, approvalUrl, token: approval.token });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
