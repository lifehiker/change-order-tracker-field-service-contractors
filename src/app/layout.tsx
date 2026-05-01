import type { Metadata } from "next";
import { Azeret_Mono, Public_Sans, Teko } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const teko = Teko({
  variable: "--font-teko",
  subsets: ["latin"],
});

const azeretMono = Azeret_Mono({
  variable: "--font-azeret-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Change Order Tracker for Field Service Contractors",
    template: "%s | Change Order Tracker",
  },
  description:
    "Capture onsite scope changes, send a client approval link, and generate invoice-ready documentation without the overhead of full FSM software.",
  keywords: [
    "change order software for plumbers",
    "field service change order software",
    "scope change approval app",
    "client approval for extra work",
    "invoice-ready job documentation",
  ],
  openGraph: {
    title: "Change Order Tracker for Field Service Contractors",
    description:
      "A lightweight field-first workflow for extra work approvals and invoice-ready documentation.",
    type: "website",
    images: ["/og.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Change Order Tracker for Field Service Contractors",
    description:
      "Scope changed. Margin should not. Capture, approve, and document field changes in one flow.",
    images: ["/og.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${teko.variable} ${azeretMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster
          theme="light"
          position="top-right"
          toastOptions={{
            classNames: {
              toast:
                "border border-[color:var(--line)] bg-[color:var(--card)] text-foreground shadow-[0_16px_40px_rgba(17,24,39,0.14)]",
            },
          }}
        />
      </body>
    </html>
  );
}
