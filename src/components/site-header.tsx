import Link from "next/link";
import { ArrowUpRight, ClipboardPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteLinks } from "@/lib/site-data";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
      <div className="section-card flex items-center justify-between gap-4 rounded-[1.6rem] px-4 py-3 backdrop-blur sm:px-5">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl blueprint-panel text-[color:var(--brand)]">
            <ClipboardPlus className="h-5 w-5 text-[#f4eee4]" />
          </div>
          <div>
            <p className="hero-kicker text-sm text-[color:var(--ink-soft)]">
              Change Order Tracker
            </p>
            <p className="text-sm font-semibold tracking-tight text-foreground">
              Field service approval workflow
            </p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {siteLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="label-chip text-[color:var(--ink-soft)] hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            className="hidden rounded-full border border-[color:var(--line)] bg-white/55 px-4 text-sm text-foreground hover:bg-white sm:inline-flex"
          >
            <Link href="/field-service/change-order-template">Template</Link>
          </Button>
          <Button
            asChild
            className="rounded-full px-4 text-sm font-semibold text-[color:var(--primary-foreground)] shadow-[0_12px_32px_rgba(201,107,51,0.25)] hover:opacity-95"
            style={{ backgroundColor: "var(--brand)" }}
          >
            <Link href="/studio">
              Open Workflow
              <ArrowUpRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
