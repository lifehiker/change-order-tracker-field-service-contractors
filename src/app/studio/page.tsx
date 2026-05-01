import type { Metadata } from "next";
import { ChangeOrderStudio } from "@/components/change-order-studio";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Live Workflow Studio",
  description:
    "A working demo for capturing field scope changes, pricing labor and materials, and preparing a client approval packet.",
};

export default function StudioPage() {
  return (
    <SiteShell footerCtaHref="/approve/demo" footerCtaLabel="Open client approval">
      <ChangeOrderStudio />
    </SiteShell>
  );
}
