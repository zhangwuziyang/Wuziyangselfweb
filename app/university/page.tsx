import type { Metadata } from "next";
import UniversityClient from "./UniversityClient";

export const metadata: Metadata = {
  title: "University of Wisconsin–Madison",
  description:
    "My academic home — UW–Madison, a top-10 US public university. Economics & Information Science at CDIS.",
};

export default function UniversityPage() {
  return <UniversityClient />;
}
