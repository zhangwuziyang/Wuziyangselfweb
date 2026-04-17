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
