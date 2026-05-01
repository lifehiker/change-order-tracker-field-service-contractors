import Link from "next/link";
import { ArrowRight, ClipboardCheck, FileBadge2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteShell } from "@/components/site-shell";
import type { SeoPage } from "@/lib/site-data";

type SeoPageTemplateProps = {
  page: SeoPage;
};

function resolveCtaHref(page: SeoPage) {
  if (page.slug.join("/") === "client-approval/extra-work") return "/approve/demo";
  if (page.slug.join("/") === "use-cases/invoice-ready-job-documentation") {
    return "/docs/demo";
  }

  return "/studio";
}

export function SeoPageTemplate({ page }: SeoPageTemplateProps) {
  return (
    <SiteShell
      theme={page.theme}
      footerCtaHref={resolveCtaHref(page)}
      footerCtaLabel={page.ctaLabel}
    >
      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="section-card rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10">
          <p className="hero-kicker text-lg" style={{ color: page.theme.accent }}>
            {page.eyebrow}
          </p>
          <h1 className="headline mt-4 max-w-4xl text-6xl text-foreground sm:text-7xl">
            {page.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[color:var(--ink-soft)] sm:text-xl">
            {page.lead}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 rounded-full px-6 text-sm font-semibold text-[color:var(--primary-foreground)] hover:opacity-95"
              style={{ backgroundColor: page.theme.accent }}
            >
              <Link href={resolveCtaHref(page)}>
                {page.ctaLabel}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="h-12 rounded-full border border-[color:var(--line)] bg-white/55 px-6 text-sm font-semibold hover:bg-white"
            >
              <Link href="/studio">Open the full workflow</Link>
            </Button>
          </div>
        </div>
        <div className="blueprint-panel rounded-[2rem] p-6 text-[#f4eee4] sm:p-8">
          <div className="grid gap-4">
            {[
              {
                icon: ClipboardCheck,
                title: "Field capture",
                body: "Log the change while the crew is standing in front of the issue.",
              },
              {
                icon: ShieldCheck,
                title: "Client clarity",
                body: "Show the scope delta and price impact in one simple approval view.",
              },
              {
                icon: FileBadge2,
                title: "Billing backup",
                body: "Hand the office an invoice-ready summary instead of scattered proof.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[1.45rem] border border-white/12 bg-white/6 p-4"
              >
                <item.icon className="h-5 w-5 text-[#88c8ca]" />
                <p className="mt-3 text-xl font-semibold tracking-tight text-[#f4eee4]">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-7 text-white/70">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card className="rounded-[1.9rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]">
          <CardContent className="p-6 sm:p-8">
            <p className="label-chip" style={{ color: page.theme.accent }}>
              Why this matters
            </p>
            <div className="mt-5 grid gap-4">
              {page.proof.map((line) => (
                <div
                  key={line}
                  className="rounded-[1.35rem] border border-[color:var(--line)] bg-white/55 p-4"
                >
                  <p className="text-sm leading-7 text-[color:var(--ink-soft)]">{line}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[1.9rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]">
          <CardContent className="p-6 sm:p-8">
            <p className="label-chip" style={{ color: page.theme.accent }}>
              What teams actually need
            </p>
            <div className="mt-5 grid gap-4">
              {page.checkpoints.map((line, index) => (
                <div
                  key={line}
                  className="flex gap-4 rounded-[1.35rem] border border-[color:var(--line)] bg-white/55 p-4"
                >
                  <p className="headline text-3xl" style={{ color: page.theme.accent }}>
                    0{index + 1}
                  </p>
                  <p className="pt-1 text-sm leading-7 text-[color:var(--ink-soft)]">{line}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {page.table ? (
        <section className="section-card rounded-[2rem] p-6 sm:p-8">
          <p className="label-chip" style={{ color: page.theme.accent }}>
            Comparison Snapshot
          </p>
          <h2 className="headline mt-4 text-5xl text-foreground sm:text-6xl">
            Broad platform versus focused workflow.
          </h2>
          <div className="mt-8 overflow-hidden rounded-[1.7rem] border border-[color:var(--line)]">
            <table className="w-full border-collapse text-left">
              <thead className="bg-[color:var(--paper-tone)]">
                <tr>
                  {page.table.headers.map((header) => (
                    <th
                      key={header}
                      className="px-4 py-4 text-sm font-semibold tracking-tight text-foreground sm:px-6"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white/65">
                {page.table.rows.map((row) => (
                  <tr key={row[0]} className="border-t border-[color:var(--line)] align-top">
                    {row.map((cell, index) => (
                      <td
                        key={`${row[0]}-${index}`}
                        className="px-4 py-4 text-sm leading-7 text-[color:var(--ink-soft)] sm:px-6"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="section-card rounded-[2rem] p-6 sm:p-8">
          <p className="label-chip" style={{ color: page.theme.accent }}>
            Core Positioning
          </p>
          <h2 className="headline mt-4 text-5xl text-foreground sm:text-6xl">
            Purpose-built for scope changes, not everything else.
          </h2>
          <p className="mt-4 text-base leading-7 text-[color:var(--ink-soft)] sm:text-lg">
            The PRD is explicit about the wedge: this should not drift into generic CRM,
            generic quoting, or generic invoicing. The product earns attention by being the
            cleanest route from field surprise to approved documentation.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Mobile web speed",
              body: "Fewer clicks and clearer typography than broad service software.",
            },
            {
              title: "Client-facing clarity",
              body: "One summary view that reduces confusion and billing pushback.",
            },
            {
              title: "Back-office readiness",
              body: "Exportable, printable documentation instead of forensic reconstruction.",
            },
            {
              title: "Trade-specific fit",
              body: "Designed around the exact workflow small plumbing and AV shops described.",
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="rounded-[1.7rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]"
            >
              <CardContent className="p-5 sm:p-6">
                <p className="text-lg font-semibold tracking-tight text-foreground">
                  {item.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
                  {item.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
