import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LiveApprovalScreen } from "@/components/live-approval-screen";
import { SiteShell } from "@/components/site-shell";
import {
  getApprovalRequestByToken,
  markApprovalRequestViewed,
} from "@/lib/approval";

type Props = {
  params: Promise<{ token: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const approvalRequest = await getApprovalRequestByToken(token);

  if (!approvalRequest) {
    return {
      title: "Approval Link Not Found",
    };
  }

  return {
    title: `${approvalRequest.changeOrder.title} Approval`,
    description: `Review and approve the change order for ${approvalRequest.changeOrder.job.siteAddress}.`,
  };
}

export default async function ApprovalTokenPage({ params }: Props) {
  const { token } = await params;
  const approvalRequest = await getApprovalRequestByToken(token);

  if (!approvalRequest) notFound();

  const viewedApprovalRequest = await markApprovalRequestViewed(approvalRequest);

  return (
    <SiteShell
      theme={{
        accent: "#5bb8bd",
        accentSoft: "rgba(91, 184, 189, 0.22)",
        accentDeep: "#12383d",
        panel: "rgba(237, 248, 248, 0.84)",
      }}
      footerCtaHref={`/api/change-orders/${viewedApprovalRequest.changeOrderId}/pdf`}
      footerCtaLabel="Open printable PDF"
    >
      <LiveApprovalScreen approvalRequest={viewedApprovalRequest} />
    </SiteShell>
  );
}
