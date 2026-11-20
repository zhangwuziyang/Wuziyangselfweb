import type { Metadata } from "next";
import { detail } from "@/lib/projectData/health-agent-copy.json";
import { OG_IMAGE, siteOpenGraph } from "@/lib/siteMetadata";
import ProjectDetailClient from "../ProjectDetailClient";

const url = "/projects/health-agent";
const { title, subtitle: description } = detail.en;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { ...siteOpenGraph, url, title, description },
  twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
};

export default function HealthAgentPage() {
  return <ProjectDetailClient copy={detail} />;
}
