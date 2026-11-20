import type { Metadata } from "next";
import UniversityClient from "./UniversityClient";
import { siteOpenGraph } from "@/lib/siteMetadata";

export const metadata: Metadata = {
  alternates: { canonical: "/university" },
  openGraph: { ...siteOpenGraph, url: "/university" },
  title: "University of Wisconsin–Madison",
  description:
    "UW–Madison, a top-10 US public university: studying Economics and Information Science at CDIS.",
};

export default function UniversityPage() {
  return <UniversityClient />;
}
