import type { Metadata } from "next";
import ScrollStory from "@/components/projects/ScrollStory";
import { healthAgentStory } from "@/lib/projectData/healthAgentStory";
import { metadata as standardMetadata } from "@/app/(main)/projects/health-agent/page";
import { cindySubpageViewport } from "@/lib/cindyRoutes";

// Cindy-tour copy of the standard page: same story, back links return to /cindy.
// Metadata (canonical included) is the standard page's.
export const viewport = cindySubpageViewport;
export const metadata: Metadata = standardMetadata;

export default function CindyHealthAgentPage() {
  return <ScrollStory story={healthAgentStory} basePath="/cindy" />;
}
