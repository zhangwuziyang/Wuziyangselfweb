import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar    from "@/components/Navbar";
import Hero       from "@/components/Hero";
import About      from "@/components/About";
import Experience from "@/components/Experience";
import Projects   from "@/components/Projects";
import GlobalLens from "@/components/GlobalLens";
import Music      from "@/components/Music";
import Skills     from "@/components/Skills";
import Philosophy from "@/components/Philosophy";
import Contact    from "@/components/Contact";
import Footer     from "@/components/Footer";
import { i18n } from "@/lib/i18n";
import { siteOpenGraph } from "@/lib/siteMetadata";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...siteOpenGraph, url: "/" },
};

function SectionTransition({ from, to }: { from: string; to: string }) {
  return (
    <div
      aria-hidden="true"
      className="section-transition"
      style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }}
    />
  );
}

export default function Home() {
  return (
    <>
      <Navbar copy={i18n.nav} />
      <main>
        <Hero />
        <About />
        <SectionTransition from="#fff" to="#000" />
        <Experience />
        <SectionTransition from="#000" to="#f5f5f7" />
        <Projects />
        <SectionTransition from="#f5f5f7" to="#000" />
        <GlobalLens />
        <SectionTransition from="#000" to="#fff" />
        <Music />
        <SectionTransition from="#fff" to="#1d1d1f" />
        <Skills />
        <SectionTransition from="#1d1d1f" to="#f5f5f7" />
        <Philosophy />
        <SectionTransition from="#f5f5f7" to="#000" />
        <Contact />
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
