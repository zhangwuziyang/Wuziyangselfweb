import type { Metadata } from "next";
import ScrollStory from "@/components/projects/ScrollStory";
import { offerRadarStory } from "@/lib/projectData/offerRadarStory";
import { siteOpenGraph } from "@/lib/siteMetadata";

const url = "/projects/offer-radar";
const title = offerRadarStory.title.en;
const description = offerRadarStory.subtitle.en;
const image = {
  url: "/images/projects/offer-radar/o-001.webp",
  width: 1800,
  height: 1125,
  alt: `${title} web workspace`,
};

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { ...siteOpenGraph, url, title, description, images: [image] },
  twitter: { card: "summary_large_image", title, description, images: [image] },
};

export default function OfferRadarPage() {
  return <ScrollStory story={offerRadarStory} />;
}
