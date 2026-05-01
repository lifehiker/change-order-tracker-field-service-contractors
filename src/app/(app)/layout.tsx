import type { CSSProperties, ReactNode } from "react";
import { auth } from "@/auth";
import { AppNav } from "@/components/app/app-nav";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    return <>{children}</>;
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
        } as CSSProperties
      }
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:gap-6 lg:px-8">
        <AppNav />
        <main className="min-w-0 flex-1 space-y-6">{children}</main>
      </div>
    </div>
  );
}
