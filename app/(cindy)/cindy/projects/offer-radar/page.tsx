import type { Metadata } from "next";
import ScrollStory from "@/components/projects/ScrollStory";
import { offerRadarStory } from "@/lib/projectData/offerRadarStory";
import { metadata as standardMetadata } from "@/app/(main)/projects/offer-radar/page";
import { cindySubpageViewport } from "@/lib/cindyRoutes";

// Cindy-tour copy of the standard page: same story, back links return to /cindy.
// Metadata (canonical included) is the standard page's.
export const viewport = cindySubpageViewport;
export const metadata: Metadata = standardMetadata;

export default function CindyOfferRadarPage() {
  return <ScrollStory story={offerRadarStory} basePath="/cindy" />;
}
