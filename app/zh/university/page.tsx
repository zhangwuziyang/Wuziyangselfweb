import type { Metadata } from "next";
import { localeAlternates } from "@/lib/locale";
import UniversityClient from "../../university/UniversityClient";

export const metadata: Metadata = {
  title: "威斯康星大学麦迪逊分校",
  description: "我的母校威斯康星大学麦迪逊分校，美国排名前十的公立大学。就读于 CDIS 的经济学与信息科学专业。",
  alternates: localeAlternates("/university", "zh"),
};

export default function UniversityPage() {
  return <UniversityClient />;
}
