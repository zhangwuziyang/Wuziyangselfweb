import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "@/context/LangContext";
import { OG_IMAGE, SITE_URL, siteOpenGraph } from "@/lib/siteMetadata";

// The only root layout. Both sites live under it so switching between / and /cindy stays a
// client-side navigation (LangProvider state and view transitions survive). Backgrounds,
// theme colors and site styles belong to app/(main)/layout.tsx and app/(cindy)/cindy/layout.tsx.
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

// Runs before first paint: applies the saved language to <html> and, for Chinese visitors,
// holds the page invisible until LangProvider has rendered Chinese (it clears
// data-lang-pending). The timeout is a safety net if hydration never happens.
const LANG_BOOT = `(function(){try{var d=document.documentElement,z=localStorage.getItem("wz-lang")==="zh";d.lang=z?"zh-CN":"en";d.setAttribute("data-lang",z?"zh":"en");if(z){d.setAttribute("data-lang-pending","");setTimeout(function(){d.removeAttribute("data-lang-pending")},3000)}}catch(e){}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-lang="en" suppressHydrationWarning>
      <head>
        <script id="lang-boot" dangerouslySetInnerHTML={{ __html: LANG_BOOT }} />
      </head>
      <body className="antialiased">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
