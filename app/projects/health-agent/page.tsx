import type { Metadata } from "next";
import ScrollStory from "@/components/projects/ScrollStory";
import { healthAgentStory } from "@/lib/projectData/healthAgentStory";
import { siteOpenGraph } from "@/lib/siteMetadata";

const url = "/projects/health-agent";
const title = healthAgentStory.title.en;
const description = healthAgentStory.subtitle.en;
const image = {
  url: "/images/projects/health-agent/h-001.webp",
  width: 560,
  height: 1217,
  alt: `${title} iPhone dashboard`,
};

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { ...siteOpenGraph, url, title, description, images: [image] },
  twitter: { card: "summary_large_image", title, description, images: [image] },
};

export default function HealthAgentPage() {
  return <ScrollStory story={healthAgentStory} />;
}
