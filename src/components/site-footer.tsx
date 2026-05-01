import Link from "next/link";
import { Button } from "@/components/ui/button";

type SiteFooterProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

export function SiteFooter({
  ctaHref = "/studio",
  ctaLabel = "Launch the live workflow",
}: SiteFooterProps) {
  return (
    <footer className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <div className="section-card rounded-[2rem] p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-end">
          <div className="space-y-4">
            <p className="label-chip text-[color:var(--brand)]">Field Margin Protection</p>
            <h2 className="headline max-w-3xl text-4xl text-foreground sm:text-5xl">
              Scope changed. Margin should not.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-[color:var(--ink-soft)] sm:text-lg">
              Change Order Tracker stays narrow on purpose: capture onsite scope changes,
              get approval, and hand the office a billable record without dragging crews
              through a giant field service platform.
            </p>
          </div>
          <div className="flex flex-col gap-4 lg:items-end">
            <Button
              asChild
              className="h-12 rounded-full px-6 text-sm font-semibold text-[color:var(--primary-foreground)] shadow-[0_14px_34px_rgba(201,107,51,0.24)] hover:opacity-95"
              style={{ backgroundColor: "var(--brand)" }}
            >
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
            <div className="flex flex-wrap gap-4 text-sm text-[color:var(--ink-soft)]">
              <Link href="/plumbers/change-order-software" className="hover:text-foreground">
                Plumbers
              </Link>
              <Link href="/av-installers/change-order-software" className="hover:text-foreground">
                AV Installers
              </Link>
              <Link href="/client-approval/extra-work" className="hover:text-foreground">
                Client Approval
              </Link>
              <Link href="/docs/demo" className="hover:text-foreground">
                Invoice-ready Docs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
