import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoPageTemplate } from "@/components/seo-page-template";
import { getSeoPage, seoPages } from "@/lib/site-data";

type RouteProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  return seoPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPage(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${page.slug.join("/")}`,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `/${page.slug.join("/")}`,
      images: ["/og.svg"],
    },
  };
}

export default async function MarketingRoute({ params }: RouteProps) {
  const { slug } = await params;
  const page = getSeoPage(slug);

  if (!page) {
    notFound();
  }

  return <SeoPageTemplate page={page} />;
}
