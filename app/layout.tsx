import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { LangProvider } from "@/context/LangContext";
import ProfileChatLauncher from "@/components/ProfileChatLauncher";
import ScrollEffects from "@/components/ui/ScrollEffects";
import { OG_IMAGE, SITE_URL, siteOpenGraph } from "@/lib/siteMetadata";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Wuziyang Zhang — Strategy, AI & Product",
    template: "%s · Wuziyang Zhang",
  },
  description:
    "Personal portfolio of Wuziyang Zhang (张吴梓洋), an Economics & Information Science student at UW–Madison working across business strategy, data analysis, and AI products.",
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
  twitter: {
    card: "summary_large_image",
    title: siteOpenGraph.title,
    description:
      "Business strategy, data analysis, AI products, and field-tested global perspective.",
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
        <LangProvider>
          <ProfileChatLauncher>{children}</ProfileChatLauncher>
          <Suspense fallback={null}>
            <ScrollEffects />
          </Suspense>
        </LangProvider>
      </body>
    </html>
  );
}
