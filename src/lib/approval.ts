import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const approvalRequestInclude = {
  changeOrder: {
    include: {
      job: true,
      attachments: true,
      workspace: {
        select: {
          name: true,
          logoUrl: true,
          defaultTerms: true,
          currency: true,
        },
      },
    },
  },
} satisfies Prisma.ApprovalRequestInclude;

export async function getApprovalRequestByToken(token: string) {
  return prisma.approvalRequest.findUnique({
    where: { token },
    include: approvalRequestInclude,
  });
}

export type ApprovalRequestRecord = NonNullable<
  Awaited<ReturnType<typeof getApprovalRequestByToken>>
>;

export async function markApprovalRequestViewed(approvalRequest: ApprovalRequestRecord) {
  if (approvalRequest.viewedAt) return approvalRequest;

  await prisma.approvalRequest.update({
    where: { token: approvalRequest.token },
    data: { viewedAt: new Date() },
  });

  if (approvalRequest.changeOrder.status === "SENT") {
    await prisma.changeOrder.update({
      where: { id: approvalRequest.changeOrderId },
      data: { status: "VIEWED" },
    });
    await prisma.approvalEvent.create({
      data: {
        changeOrderId: approvalRequest.changeOrderId,
        type: "VIEWED",
        actorType: "CLIENT",
      },
    });
  }

  return (await getApprovalRequestByToken(approvalRequest.token)) as ApprovalRequestRecord;
}
