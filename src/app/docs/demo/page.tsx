import type { Metadata } from "next";
import { DocumentScreen } from "@/components/document-screen";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Invoice-ready Document Demo",
  description:
    "Review the generated change-order documentation with totals, notes, photos, and client approval data.",
};

export default function DocsPage() {
  return (
    <SiteShell
      theme={{
        accent: "#4d7868",
        accentSoft: "rgba(77, 120, 104, 0.22)",
        accentDeep: "#1a342c",
        panel: "rgba(237, 247, 242, 0.84)",
      }}
      footerCtaHref="/studio"
      footerCtaLabel="Return to live workflow"
    >
      <DocumentScreen />
    </SiteShell>
  );
}
