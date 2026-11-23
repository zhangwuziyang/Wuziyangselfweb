import type { Metadata } from "next";
import { siteOpenGraph } from "@/lib/siteMetadata";
import UniversityClient from "./UniversityClient";

export const metadata: Metadata = {
  alternates: { canonical: "/university" },
  openGraph: { ...siteOpenGraph, url: "/university" },
  title: "University of Wisconsin–Madison",
  description:
    "My academic home — UW–Madison, a top-10 US public university. Economics & Information Science at CDIS.",
};

export default function UniversityPage() {
  return <UniversityClient />;
}
