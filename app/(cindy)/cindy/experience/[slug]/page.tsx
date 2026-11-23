import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EXPERIENCE_DATA } from "@/lib/experienceData";
import { siteOpenGraph } from "@/lib/siteMetadata";
import { cindySubpageViewport } from "@/lib/cindyRoutes";

export const viewport = cindySubpageViewport;
import ExperienceDetailClient from "./ExperienceDetailClient";

export const unstable_instant = { prefetch: "static", unstable_disableValidation: true };

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return EXPERIENCE_DATA.map((exp) => ({ slug: exp.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exp = EXPERIENCE_DATA.find((e) => e.slug === slug);
  if (!exp) return {};
  const url = `/experience/${exp.slug}`;
  return {
    alternates: { canonical: url },
    title: `${exp.company} — ${exp.role.en}`,
    description: exp.overview.en,
    openGraph: {
      ...siteOpenGraph,
      url,
      title: `${exp.company} — ${exp.role.en}`,
      description: exp.overview.en,
      type: "article",
    },
  };
}

export default function ExperienceDetailPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      {params.then(({ slug }) => (
        <Resolved slug={slug} />
      ))}
    </Suspense>
  );
}

async function Resolved({ slug }: { slug: string }) {
  "use cache";
  const exp = EXPERIENCE_DATA.find((e) => e.slug === slug);
  if (!exp) notFound();
  return <ExperienceDetailClient exp={exp} />;
}
