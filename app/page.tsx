import type { Metadata } from "next";
import Image from "next/image";
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
import StoryLens from "@/components/home/StoryLens";
import { i18n } from "@/lib/i18n";
import { siteOpenGraph } from "@/lib/siteMetadata";
import "./home-story.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { ...siteOpenGraph, url: "/" },
};

export default function Home() {
  return (
    <HomeStory stage={
      <>
        <div className="story-stage__photo" data-story-photo="">
          <Image src="/images/background.jpg" alt="Wuziyang Zhang" fill sizes="100vw" className="object-cover object-[center_32%]" />
        </div>
        <div className="story-stage__light story-stage__light--violet" data-story-light="violet" />
        <div className="story-stage__light story-stage__light--teal" data-story-light="teal" />
        <div className="story-stage__light story-stage__light--amber" data-story-light="amber" />
        <StoryLens />
        <div className="story-stage__shade" />
      </>
    }>
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
