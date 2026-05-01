import type { Metadata } from "next";
import { ApprovalScreen } from "@/components/approval-screen";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Client Approval Demo",
  description:
    "Preview the simplified client approval experience for extra work and onsite scope changes.",
};

export default function ApprovalPage() {
  return (
    <SiteShell
      theme={{
        accent: "#5bb8bd",
        accentSoft: "rgba(91, 184, 189, 0.22)",
        accentDeep: "#12383d",
        panel: "rgba(237, 248, 248, 0.84)",
      }}
      footerCtaHref="/docs/demo"
      footerCtaLabel="Open invoice-ready packet"
    >
      <ApprovalScreen />
    </SiteShell>
  );
}
