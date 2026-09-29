import type { Metadata } from "next";
import { localeAlternates } from "@/lib/locale";
import CodeAndPowerClient from "../../../projects/codeandpower/CodeAndPowerClient";

export const metadata: Metadata = {
  title: "Code and Power",
  description: "探讨隐性偏见如何塑造技术的教育网站，涵盖交叉性、公平设计与负责任的创新。",
  alternates: localeAlternates("/projects/codeandpower", "zh"),
};

export default function CodeAndPowerPage() {
  return <CodeAndPowerClient />;
}
