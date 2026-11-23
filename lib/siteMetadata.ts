export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zwzy.space";
export const OG_IMAGE = "/images/background.jpg";

export const siteOpenGraph = {
  title: "Wuziyang Zhang — Think in systems. Build with taste.",
  description:
    "Business strategy, data analysis, AI products, and field-tested global perspective.",
  type: "website" as const,
  siteName: "Wuziyang Zhang",
  images: [{ url: OG_IMAGE, width: 3422, height: 2602, alt: "Wuziyang Zhang" }],
};
