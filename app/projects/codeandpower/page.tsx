import type { Metadata } from "next";
import CodeAndPowerClient from "./CodeAndPowerClient";
import { siteOpenGraph } from "@/lib/siteMetadata";

export const metadata: Metadata = {
  alternates: { canonical: "/projects/codeandpower" },
  openGraph: { ...siteOpenGraph, url: "/projects/codeandpower" },
  title: "Code and Power",
  description:
    "An educational website exploring how implicit biases shape technology, featuring intersectionality, equitable design, and responsible innovation.",
};

export default function CodeAndPowerPage() {
  return <CodeAndPowerClient />;
}
