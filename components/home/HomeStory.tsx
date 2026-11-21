import type { ReactNode } from "react";
import CindyGuide from "./CindyGuide";

export default function HomeStory({ children, navigation }: { children: ReactNode; navigation: ReactNode }) {
  return (
    <div className="home-story">
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
