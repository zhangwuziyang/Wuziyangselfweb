import type { MetadataRoute } from "next";
import { EXPERIENCE_DATA } from "@/lib/experienceData";
import { SITE_URL } from "@/lib/site";

// English and Chinese share the same URLs (language is a client-side toggle),
// so each route is listed once.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/university`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/projects/codeandpower`, changeFrequency: "yearly", priority: 0.7 },
    ...EXPERIENCE_DATA.map((exp) => ({
      url: `${SITE_URL}/experience/${exp.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
