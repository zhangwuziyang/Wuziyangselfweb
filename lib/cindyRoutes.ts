import type { Viewport } from "next";

/** Cindy-tour URL for a site path ("/experience/x" → "/cindy/experience/x", "/#about" → "/cindy#about"). */
export function cindyHref(path: string): string {
  if (!path.startsWith("/") || path === "/cindy" || path.startsWith("/cindy/") || path.startsWith("/cindy#")) return path;
  if (/\.[a-z0-9]+$/i.test(path.split(/[?#]/)[0])) return path; // static files (resume PDF, images)
  return path === "/" ? "/cindy" : path.startsWith("/#") ? `/cindy${path.slice(1)}` : `/cindy${path}`;
}

/** Cindy subpages keep the dark chrome they had in 9343abf. */
export const cindySubpageViewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};
