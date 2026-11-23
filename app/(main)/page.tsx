import type { Metadata } from "next";
import { Suspense } from "react";
import { siteOpenGraph } from "@/lib/siteMetadata";
import Navbar    from "@/components/main/Navbar";
import Hero       from "@/components/main/Hero";
import About      from "@/components/main/About";
import Experience from "@/components/main/Experience";
import Projects   from "@/components/main/Projects";
import GlobalLens from "@/components/main/GlobalLens";
import Music      from "@/components/main/Music";
import Skills     from "@/components/main/Skills";
import Philosophy from "@/components/main/Philosophy";
import Contact    from "@/components/main/Contact";
import Footer     from "@/components/main/Footer";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...siteOpenGraph, url: "/" },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <GlobalLens />
        <Music />
        <Skills />
        <Philosophy />
        <Contact />
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
