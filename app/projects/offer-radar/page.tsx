import type { Metadata } from "next";
import { card, detail } from "@/lib/projectData/offer-radar-copy.json";
import { siteOpenGraph } from "@/lib/siteMetadata";
import ProjectDetailClient from "../ProjectDetailClient";

const url = "/projects/offer-radar";
const video = { src: "/projects/offer-radar-web.mp4", poster: "/projects/offer-radar-poster.jpg" };
const { title, subtitle: description } = detail.en;
const image = { url: video.poster, width: 1280, height: 720, alt: title };

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { ...siteOpenGraph, url, title, description, images: [image] },
  twitter: { card: "summary_large_image", title, description, images: [image] },
};

export default function OfferRadarPage() {
  return (
    <ProjectDetailClient
      copy={{
        en: { ...detail.en, techTags: card.en.techTags },
        zh: { ...detail.zh, techTags: card.zh.techTags },
      }}
      video={video}
    />
  );
}
