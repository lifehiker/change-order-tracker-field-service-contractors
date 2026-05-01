import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ClipboardList,
  FileText,
  Link2,
} from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  calculateGrandTotal,
  calculateLaborTotal,
  calculateMaterialTotal,
  defaultDraft,
  formatCurrency,
} from "@/lib/demo-store";

const previewSteps = [
  {
    title: "Capture the scope drift",
    body: "Log what changed while the crew is standing in front of the issue, not after the phone thread starts.",
    icon: ClipboardList,
  },
  {
    title: "Send the approval link",
    body: "Give the client one clean decision surface with the labor, material, and markup impact already framed.",
    icon: Link2,
  },
  {
    title: "Bill from a defensible record",
    body: "Hand the office a packet with price delta, photos, timestamps, and decision history already attached.",
    icon: FileText,
  },
];

export function ChangeOrdersLanding() {
  const labor = calculateLaborTotal(defaultDraft);
  const materials = calculateMaterialTotal(defaultDraft.materials);
  const total = calculateGrandTotal(defaultDraft);

  return (
    <SiteShell footerCtaHref="/register" footerCtaLabel="Create a contractor workspace">
      <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="section-card hazard-stripe rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10">
          <div className="max-w-3xl space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="rounded-full bg-[color:var(--brand-soft)] px-3 py-1 text-[color:var(--brand-deep)]">
                Public route health fixed
              </Badge>
              <span className="label-chip text-[color:var(--ink-soft)]">
                `/change-orders` now resolves to a real product page
              </span>
            </div>
            <div className="space-y-4">
              <p className="hero-kicker text-lg text-[color:var(--brand)]">
                Change order command center
              </p>
              <h1 className="headline ledger-rule max-w-4xl text-6xl text-foreground sm:text-7xl lg:text-[6.4rem]">
                Stop routing margin-critical work through a login wall.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[color:var(--ink-soft)] sm:text-xl">
                This page explains the exact workflow the app manages: field capture,
                client approval, and invoice-ready documentation for extra work that
                appears after the original scope is already moving.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-full px-6 text-sm font-semibold text-[color:var(--primary-foreground)] shadow-[0_16px_36px_rgba(201,107,51,0.26)] hover:opacity-95"
                style={{ backgroundColor: "var(--brand)" }}
              >
                <Link href="/studio">
                  Open the live workflow
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="h-12 rounded-full border border-[color:var(--line)] bg-white/55 px-6 text-sm font-semibold hover:bg-white"
              >
                <Link href="/login">Sign in to your workspace</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="blueprint-panel rounded-[2rem] p-6 text-[#f4eee4] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="label-chip text-[#88c8ca]">Sample change event</p>
              <h2 className="headline mt-4 text-4xl text-[#f4eee4] sm:text-5xl">
                {defaultDraft.changeTitle}
              </h2>
            </div>
            <Camera className="h-5 w-5 shrink-0 text-[#88c8ca]" />
          </div>
          <p className="mt-4 text-sm leading-7 text-white/74">
            {defaultDraft.scopeSummary}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["Labor", formatCurrency(labor)],
              ["Materials", formatCurrency(materials)],
              ["Total", formatCurrency(total)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[1.35rem] border border-white/10 bg-white/6 p-4"
              >
                <p className="label-chip text-white/55">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-[#f4eee4]">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[1.35rem] border border-white/10 bg-white/6 p-4">
            <p className="label-chip text-white/55">What makes this memorable</p>
            <p className="mt-2 text-base leading-7 text-white/78">
              The route itself acts like a live proof point instead of collapsing into an
              auth screen. Prospects, crawlers, and deployment checks all see the product
              narrative before any sign-in requirement.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {previewSteps.map((step) => (
          <Card
            key={step.title}
            className="rounded-[1.7rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]"
          >
            <CardContent className="space-y-3 p-5 sm:p-6">
              <step.icon className="h-5 w-5 text-[color:var(--brand)]" />
              <p className="headline text-3xl text-foreground">{step.title}</p>
              <p className="text-sm leading-7 text-[color:var(--ink-soft)]">{step.body}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="section-card rounded-[2rem] p-6 sm:p-8">
          <p className="label-chip text-[color:var(--brand)]">Access model</p>
          <h2 className="headline mt-4 text-5xl text-foreground sm:text-6xl">
            Public overview. Protected records.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--ink-soft)] sm:text-lg">
            The collection route is safe for product discovery and health checks. Actual
            workspace data, record detail, and send actions remain behind authentication.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Explore the field workflow",
              body: "Use the seeded interactive studio to test pricing, attachments, and approval preparation without an account.",
              href: "/studio",
              label: "Open studio",
            },
            {
              title: "Preview the client decision screen",
              body: "Open the approval experience the customer sees before the crew proceeds with added work.",
              href: "/approve/demo",
              label: "Open approval demo",
            },
            {
              title: "Read the invoice-ready packet",
              body: "Inspect the documentation view the office can print, attach, or export for billing backup.",
              href: "/docs/demo",
              label: "Open packet preview",
            },
            {
              title: "Create a real workspace",
              body: "Register to manage live jobs, create actual change orders, and send production approval links.",
              href: "/register",
              label: "Create account",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-[1.7rem] border border-[color:var(--line)] bg-white/60 p-5 transition-transform duration-200 hover:-translate-y-1 hover:border-[color:var(--brand)]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xl font-semibold tracking-tight text-foreground">
                  {item.title}
                </p>
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[color:var(--brand)]" />
              </div>
              <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
                {item.body}
              </p>
              <p className="label-chip mt-4 text-[color:var(--brand)]">{item.label}</p>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
