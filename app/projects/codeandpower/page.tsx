import type { Metadata } from "next";
import CodeAndPowerClient from "./CodeAndPowerClient";

export const metadata: Metadata = {
  title: "Code and Power",
  description:
    "An educational website exploring how implicit biases shape technology, featuring intersectionality, equitable design, and responsible innovation.",
};

export default function CodeAndPowerPage() {
  return <CodeAndPowerClient />;
}
