import type { MetadataRoute } from "next";
import { EXPERIENCE_DATA } from "@/lib/main/experienceData";
import { SITE_URL } from "@/lib/siteMetadata";

// Canonical (standard-site) URLs only: every /cindy page declares the matching standard page
// as its canonical, so listing /cindy here would send search engines mixed signals.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    ...EXPERIENCE_DATA.map((exp) => `/experience/${exp.slug}`),
    "/university",
    "/projects/offer-radar",
    "/projects/health-agent",
    "/projects/codeandpower",
  ];
  return paths.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
