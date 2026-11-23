import type { ReactNode } from "react";
import { Noto_Serif_SC, Source_Serif_4 } from "next/font/google";
import CindyGuide from "./CindyGuide";

// Display serifs for the homepage's large titles only. The variables live on .home-story,
// so nothing outside the Cindy homepage can pick them up.
const displayLatin = Source_Serif_4({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
  variable: "--font-story-latin",
});

// CJK fonts are not preloaded; Google Fonts' unicode-range slices keep downloads to the glyphs in use.
const displayHan = Noto_Serif_SC({
  weight: ["500"],
  display: "swap",
  preload: false,
  variable: "--font-story-han",
});

// Runs while the HTML is parsed, before the hero paints: a first visit in this session, with no
// hash and motion allowed, gets the staged opening. cindy-motion.ts removes the hook afterwards.
const OPENING = `(function(){try{var d=document.documentElement;if(location.hash||matchMedia("(prefers-reduced-motion: reduce)").matches||sessionStorage.getItem("wz-intro"))return;sessionStorage.setItem("wz-intro","1");d.dataset.intro="play";d.dataset.introAt=String(Math.round(performance.now()))}catch(e){}})()`;

export default function HomeStory({ children, navigation }: { children: ReactNode; navigation: ReactNode }) {
  return (
    <div className={`home-story ${displayLatin.variable} ${displayHan.variable}`}>
      <script id="home-opening" dangerouslySetInnerHTML={{ __html: OPENING }} />
      <div className="story-backdrop" aria-hidden="true">
        <div data-story-base="" />
        <div data-story-blend="" />
        <div data-story-wash="" />
      </div>
      {navigation}
      <CindyGuide />
      <div className="story-content">{children}</div>
    </div>
  );
}
