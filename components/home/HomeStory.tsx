import type { ReactNode } from "react";
import CindyGuide from "./CindyGuide";

export default function HomeStory({ children, navigation }: { children: ReactNode; navigation: ReactNode }) {
  return (
    <div className="home-story">
      {navigation}
      <CindyGuide />
      <div className="story-content">{children}</div>
    </div>
  );
}
