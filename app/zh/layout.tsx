import type { Metadata } from "next";

// openGraph/twitter replace the root layout's objects rather than merging, so repeat the image.
const OG_IMAGE = "/images/background.jpg";
const TITLE = "张吴梓洋 — 战略、AI 与产品";
const DESCRIPTION =
  "张吴梓洋（Wuziyang Zhang）的个人作品集：商业战略、AI 产品、数据分析与全球视野。威斯康星大学麦迪逊分校，经济学与信息科学。";

export const metadata: Metadata = {
  title: {
    absolute: TITLE,
    template: "%s · 张吴梓洋",
  },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "/zh",
    siteName: "张吴梓洋",
    locale: "zh_CN",
    alternateLocale: ["en_US"],
    images: [{ url: OG_IMAGE, width: 1600, height: 900, alt: "张吴梓洋" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function ZhLayout({ children }: { children: React.ReactNode }) {
  return children;
}
