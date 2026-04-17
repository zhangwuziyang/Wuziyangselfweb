import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LangProvider } from "@/context/LangContext";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wuziyang.com";
const OG_IMAGE = "/images/background.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Wuziyang Zhang — Strategy, AI & Product",
    template: "%s · Wuziyang Zhang",
  },
  description:
    "Personal portfolio of Wuziyang Zhang (张吴梓洋) — a globally minded builder at the intersection of business strategy, AI products, data analysis, and creative thinking. UW–Madison, Economics & Information Science.",
  keywords: [
    "Wuziyang Zhang",
    "张吴梓洋",
    "吴梓洋",
    "UW-Madison",
    "Economics",
    "Information Science",
    "AI Product",
    "Strategy",
    "Data Analysis",
  ],
  authors: [{ name: "Wuziyang Zhang" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Wuziyang Zhang — Think in systems. Build with taste.",
    description:
      "Business strategy, AI products, market research, and global perspective — designed into one path.",
    type: "website",
    url: SITE_URL,
    siteName: "Wuziyang Zhang",
    images: [{ url: OG_IMAGE, width: 1600, height: 900, alt: "Wuziyang Zhang" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wuziyang Zhang — Think in systems. Build with taste.",
    description:
      "Business strategy, AI products, market research, and global perspective.",
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black antialiased">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
