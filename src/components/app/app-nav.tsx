"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  ClipboardPlus,
  LayoutDashboard,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/change-orders", label: "Change Orders", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col lg:flex">
        <div className="sticky top-4 space-y-2">
          <div className="blueprint-panel rounded-[1.7rem] p-5">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#88c8ca]/20">
                <ClipboardPlus className="h-5 w-5 text-[#88c8ca]" />
              </div>
              <div>
                <p className="label-chip text-[#88c8ca] text-[0.6rem]">Field Service</p>
                <p className="text-sm font-semibold text-[#f4eee4]">Change Orders</p>
              </div>
            </Link>
          </div>

          <nav className="section-card rounded-[1.7rem] p-3 space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-[1.2rem] px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]"
                    : "text-[color:var(--ink-soft)] hover:bg-white/60 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="section-card rounded-[1.7rem] p-3">
            <Button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full justify-start rounded-[1.2rem] bg-transparent px-4 text-sm font-medium text-[color:var(--ink-soft)] hover:bg-white/60 hover:text-foreground"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex items-center justify-between lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl blueprint-panel">
            <ClipboardPlus className="h-4 w-4 text-[#88c8ca]" />
          </div>
          <span className="text-sm font-semibold text-foreground">Change Orders</span>
        </Link>
        <Button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-xl border border-[color:var(--line)] bg-white/60 text-foreground"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 section-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <ClipboardPlus className="h-5 w-5 text-[color:var(--brand)]" />
                <span className="font-semibold">Change Orders</span>
              </Link>
              <Button
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-[color:var(--line)] bg-white/60 text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="space-y-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-sm font-medium ${
                    isActive(href)
                      ? "bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]"
                      : "text-[color:var(--ink-soft)] hover:bg-white/60"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
            <Button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full justify-start rounded-[1.2rem] bg-transparent px-4 text-sm font-medium text-[color:var(--ink-soft)]"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
