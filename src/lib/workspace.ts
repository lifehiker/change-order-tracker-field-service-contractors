import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getUserWorkspace() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: { workspace: { include: { subscription: true } } },
    orderBy: { createdAt: "asc" },
  });

  return membership
    ? { workspace: membership.workspace, role: membership.role, userId: session.user.id }
    : null;
}
