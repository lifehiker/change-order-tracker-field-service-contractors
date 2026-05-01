import type { CSSProperties, ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { AccentTheme } from "@/lib/site-data";

const defaultTheme: AccentTheme = {
  accent: "#c96b33",
  accentSoft: "rgba(201, 107, 51, 0.22)",
  accentDeep: "#5b311c",
  panel: "rgba(255, 250, 243, 0.84)",
};

type SiteShellProps = {
  children: ReactNode;
  theme?: AccentTheme;
  footerCtaHref?: string;
  footerCtaLabel?: string;
};

export function SiteShell({
  children,
  theme = defaultTheme,
  footerCtaHref,
  footerCtaLabel,
}: SiteShellProps) {
  const style = {
    "--brand": theme.accent,
    "--brand-soft": theme.accentSoft,
    "--brand-deep": theme.accentDeep,
    "--paper-tone": theme.panel,
  } as CSSProperties;

  return (
    <div className="page-frame min-h-screen" style={style}>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <SiteFooter ctaHref={footerCtaHref} ctaLabel={footerCtaLabel} />
    </div>
  );
}
