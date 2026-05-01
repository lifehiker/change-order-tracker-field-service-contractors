import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  MessageSquareQuote,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  featureDeck,
  homeStats,
  seoPages,
  testimonials,
  workflowSteps,
} from "@/lib/site-data";
import { SiteShell } from "@/components/site-shell";

export function HomePage() {
  return (
    <SiteShell footerCtaHref="/studio" footerCtaLabel="Open the live workflow">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        <div className="section-card hazard-stripe reveal-up rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10">
          <div className="max-w-3xl space-y-6">
            <p className="hero-kicker text-lg text-[color:var(--brand)]">
              Change order software for field service contractors
            </p>
            <div className="space-y-4">
              <h1 className="headline ledger-rule max-w-4xl text-6xl text-foreground sm:text-7xl lg:text-[6.7rem]">
                Capture the extra work before it eats the job.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[color:var(--ink-soft)] sm:text-xl">
                A field-first workflow for plumbers, AV installers, and small contractor
                teams who need onsite scope changes documented, approved, and ready for
                invoicing without buying a full FSM operating system.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-full px-6 text-sm font-semibold text-[color:var(--primary-foreground)] shadow-[0_16px_36px_rgba(201,107,51,0.26)] hover:opacity-95"
                style={{ backgroundColor: "var(--brand)" }}
              >
                <Link href="/studio">
                  Open live workflow
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="h-12 rounded-full border border-[color:var(--line)] bg-white/55 px-6 text-sm font-semibold hover:bg-white"
              >
                <Link href="/field-service/change-order-template">See the template structure</Link>
              </Button>
            </div>
            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {homeStats.map((stat, index) => (
                <Card
                  key={stat.value}
                  className={`reveal-up rounded-[1.5rem] border-[color:var(--line)] bg-[color:var(--paper-tone)] delay-${Math.min(
                    index + 1,
                    3,
                  )}`}
                >
                  <CardContent className="space-y-2 p-4">
                    <p className="headline text-3xl text-[color:var(--brand)]">{stat.value}</p>
                    <p className="text-sm leading-6 text-[color:var(--ink-soft)]">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-5">
          <div className="section-card-dark reveal-up delay-1 rounded-[2rem] p-6 text-white">
            <div className="flex items-center justify-between">
              <p className="label-chip text-[#88c8ca]">Field Capture</p>
              <Smartphone className="h-5 w-5 text-[#88c8ca]" />
            </div>
            <h2 className="headline mt-5 text-4xl text-[#f4eee4] sm:text-5xl">
              Three panels. One clear yes.
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-white/78">
              <p>
                The product experience is intentionally narrow: log the change, price the
                delta, send the approval, and move on.
              </p>
              <div className="grid gap-3">
                {[
                  ["Scope note", "Existing gas run blocks original supply route."],
                  ["Price impact", "+6 labor hours, hose bib hardware, markup."],
                  ["Client decision", "Approve before crews continue work."],
                ].map(([label, body]) => (
                  <div
                    key={label}
                    className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4"
                  >
                    <p className="label-chip text-white/55">{label}</p>
                    <p className="mt-2 text-base text-[#f4eee4]">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Card className="blueprint-panel reveal-up delay-2 rounded-[1.7rem] border-0 text-[#f1fbfb]">
              <CardContent className="space-y-3 p-5">
                <Camera className="h-5 w-5 text-[#88c8ca]" />
                <p className="headline text-3xl">Photo backup</p>
                <p className="text-sm leading-6 text-white/72">
                  Attach site conditions to the same record so the office is not chasing
                  phone galleries later.
                </p>
              </CardContent>
            </Card>
            <Card className="reveal-up delay-3 rounded-[1.7rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]">
              <CardContent className="space-y-3 p-5">
                <FileText className="h-5 w-5 text-[color:var(--brand)]" />
                <p className="headline text-3xl text-foreground">Invoice packet</p>
                <p className="text-sm leading-6 text-[color:var(--ink-soft)]">
                  Labor, materials, signature, and notes land in one printable summary.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="section-card rounded-[2rem] p-6 sm:p-8">
          <p className="label-chip text-[color:var(--brand)]">Why It Works</p>
          <h2 className="headline mt-4 text-5xl text-foreground sm:text-6xl">
            Narrow beats broad when the problem is extra work.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-[color:var(--ink-soft)] sm:text-lg">
            Jobber, Housecall Pro, and Buildertrend prove contractors buy workflow
            software. This product wins by refusing to become another scheduling,
            dispatch, or CRM suite on day one.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {featureDeck.map((feature) => (
            <Card
              key={feature.title}
              className="rounded-[1.7rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]"
            >
              <CardContent className="p-5 sm:p-6">
                <p className="headline text-3xl text-foreground">{feature.title}</p>
                <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
                  {feature.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-card rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label-chip text-[color:var(--brand)]">Workflow</p>
            <h2 className="headline mt-4 text-5xl text-foreground sm:text-6xl">
              Fast enough for the field.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-[color:var(--ink-soft)] sm:text-lg">
            The flow is built for driveway, jobsite, rack room, or mechanical room use.
            Big type, immediate totals, and one summary that the client can actually read.
          </p>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {workflowSteps.map((item) => (
            <Card
              key={item.step}
              className="rounded-[1.7rem] border-[color:var(--line)] bg-white/65"
            >
              <CardContent className="p-5 sm:p-6">
                <p className="headline text-4xl text-[color:var(--brand)]">{item.step}</p>
                <p className="mt-3 text-xl font-semibold tracking-tight text-foreground">
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

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="blueprint-panel rounded-[2rem] p-6 sm:p-8">
          <p className="label-chip text-[#88c8ca]">Trade Landing Pages</p>
          <h2 className="headline mt-4 text-5xl text-[#f4eee4] sm:text-6xl">
            Built to rank for the exact pain, not broad FSM fluff.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/72 sm:text-lg">
            The PRD calls for narrow, high-intent pages by trade, use case, comparison,
            and template search intent. Those routes are all live below.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {seoPages.map((page) => (
            <Link
              key={page.slug.join("/")}
              href={`/${page.slug.join("/")}`}
              className="rounded-[1.7rem] border border-[color:var(--line)] bg-[color:var(--paper-tone)] p-5 transition-transform duration-200 hover:-translate-y-1 hover:border-[color:var(--brand)]"
            >
              <p className="label-chip" style={{ color: page.theme.accent }}>
                {page.eyebrow}
              </p>
              <p className="mt-3 text-xl font-semibold tracking-tight text-foreground">
                {page.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--ink-soft)]">
                {page.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        {testimonials.map((item) => (
          <Card
            key={item.person}
            className="rounded-[1.8rem] border-[color:var(--line)] bg-[color:var(--paper-tone)]"
          >
            <CardContent className="space-y-4 p-6 sm:p-8">
              <MessageSquareQuote className="h-6 w-6 text-[color:var(--brand)]" />
              <p className="text-xl leading-8 tracking-tight text-foreground">{item.quote}</p>
              <p className="label-chip text-[color:var(--ink-soft)]">{item.person}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="section-card rounded-[2rem] p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="label-chip text-[color:var(--brand)]">Core Promise</p>
            <h2 className="headline mt-4 text-5xl text-foreground sm:text-6xl">
              Capture. approve. document. bill.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: ClipboardCheck,
                title: "Capture the change",
                body: "What happened, why it matters, and what it will cost.",
              },
              {
                icon: CheckCircle2,
                title: "Get client approval",
                body: "A clean answer before scope expands on site.",
              },
              {
                icon: FileText,
                title: "Create job documentation",
                body: "One packet the office can actually invoice from.",
              },
              {
                icon: Smartphone,
                title: "Keep it mobile",
                body: "Built for one-handed use in the field, not a desktop back office.",
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="rounded-[1.7rem] border-[color:var(--line)] bg-white/65"
              >
                <CardContent className="space-y-3 p-5">
                  <item.icon className="h-5 w-5 text-[color:var(--brand)]" />
                  <p className="text-lg font-semibold tracking-tight text-foreground">
                    {item.title}
                  </p>
                  <p className="text-sm leading-7 text-[color:var(--ink-soft)]">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
