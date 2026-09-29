import type { Metadata } from "next";
import { localeAlternates } from "@/lib/locale";
import UniversityClient from "./UniversityClient";

export const metadata: Metadata = {
  title: "University of Wisconsin–Madison",
  description:
    "My academic home — UW–Madison, a top-10 US public university. Economics & Information Science at CDIS.",
  alternates: localeAlternates("/university", "en"),
};

export default function UniversityPage() {
  return <UniversityClient />;
}
