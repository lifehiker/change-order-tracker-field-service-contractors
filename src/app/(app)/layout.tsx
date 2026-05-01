import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppNav } from "@/components/app/app-nav";
import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div
      className="page-frame min-h-screen"
      style={
        {
          "--brand": "#c96b33",
          "--brand-soft": "rgba(201, 107, 51, 0.22)",
          "--brand-deep": "#5b311c",
          "--paper-tone": "rgba(255, 250, 243, 0.84)",
        } as React.CSSProperties
      }
    >
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <AppNav />
        <main className="flex-1 min-w-0 space-y-6">
          {children}
        </main>
      </div>
      <Toaster theme="light" position="top-right" />
    </div>
  );
}
