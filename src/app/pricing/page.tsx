import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pricing | Change Order Tracker for Field Service Contractors",
  description: "Simple subscription pricing for field service contractors. 14-day free trial. No credit card required.",
};

const plans = [
  {
    name: "Solo",
    price: 39,
    description: "For owner-operators running their own jobs.",
    features: [
      "1 user",
      "Unlimited jobs",
      "Up to 30 change orders/month",
      "Approval links",
      "PDF exports",
    ],
    cta: "Start free trial",
    highlight: false,
  },
  {
    name: "Small Team",
    price: 79,
    description: "For small crews with an office coordinator.",
    features: [
      "Up to 3 users",
      "Unlimited change orders",
      "Branded PDFs",
      "Email reminders",
      "Activity log",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Office",
    price: 149,
    description: "For shops with multiple field techs and admin staff.",
    features: [
      "Up to 8 users",
      "Everything in Small Team",
      "Admin controls",
      "CSV exports",
      "Custom approval terms",
      "Priority support",
    ],
    cta: "Start free trial",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <SiteShell footerCtaHref="/register" footerCtaLabel="Start your free trial">
      <section className="mx-auto max-w-2xl text-center">
        <p className="label-chip text-[color:var(--brand)]">Pricing</p>
        <h1 className="headline mt-4 text-6xl text-foreground sm:text-7xl">
          Simple, honest pricing.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[color:var(--ink-soft)]">
          14-day free trial on every plan. No credit card required. Cancel anytime.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={
              "rounded-[2rem] p-6 sm:p-8 flex flex-col gap-6 " +
              (plan.highlight
                ? "section-card-dark text-[#f4eee4]"
                : "section-card")
            }
          >
            <div>
              <p className={"label-chip " + (plan.highlight ? "text-[#88c8ca]" : "text-[color:var(--brand)]")}>{plan.name}</p>
              <div className="mt-3 flex items-end gap-1">
                <span className="headline text-6xl">${plan.price}</span>
                <span className={"mb-2 text-sm " + (plan.highlight ? "text-white/60" : "text-[color:var(--ink-soft)]")}>/month</span>
              </div>
              <p className={"mt-2 text-sm leading-7 " + (plan.highlight ? "text-white/72" : "text-[color:var(--ink-soft)]")}>{plan.description}</p>
            </div>

            <ul className="flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check className={"mt-0.5 h-4 w-4 shrink-0 " + (plan.highlight ? "text-[#88c8ca]" : "text-[color:var(--brand)]")} />
                  <span className={plan.highlight ? "text-white/88" : "text-foreground"}>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              className={
                "h-12 w-full rounded-full text-sm font-semibold " +
                (plan.highlight
                  ? "bg-[#88c8ca] text-[#112d2e] hover:bg-[#9dd2d5]"
                  : "")
              }
              style={plan.highlight ? {} : { backgroundColor: "var(--brand)", color: "var(--primary-foreground)" }}
            >
              <Link href="/register">
                {plan.cta}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ))}
      </section>

      <section className="section-card rounded-[2rem] p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="label-chip text-[color:var(--brand)]">All plans include</p>
            <h2 className="headline mt-4 text-4xl text-foreground sm:text-5xl">
              Everything you need to stop losing margin.
            </h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Scope change capture",
              "Client approval links",
              "Invoice-ready documentation",
              "Photo/document attachments",
              "Status tracking (Draft to Invoiced)",
              "Activity log",
              "Mobile-responsive field UI",
              "PDF export per change order",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand)]" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-xl text-center space-y-4">
        <h2 className="headline text-4xl text-foreground">Not sure? Try it free.</h2>
        <p className="text-[color:var(--ink-soft)] leading-7">
          Every plan starts with a 14-day free trial. No credit card required. If it does not save you at least one disputed invoice in the first week, cancel with one click.
        </p>
        <Button
          asChild
          className="h-12 rounded-full px-8 text-sm font-semibold"
          style={{ backgroundColor: "var(--brand)", color: "var(--primary-foreground)" }}
        >
          <Link href="/register">Start free trial</Link>
        </Button>
      </section>
    </SiteShell>
  );
}
