import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import GlobalLens from "@/components/GlobalLens";
import Music from "@/components/Music";
import Skills from "@/components/Skills";
import Philosophy from "@/components/Philosophy";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HomeStory from "@/components/home/HomeStory";
import { i18n } from "@/lib/i18n";
import { siteOpenGraph } from "@/lib/siteMetadata";
import "./home-story.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...siteOpenGraph, url: "/" },
};

export default function Home() {
  return (
    <HomeStory>
      <Navbar copy={i18n.nav} />
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
    </HomeStory>
  );
}
