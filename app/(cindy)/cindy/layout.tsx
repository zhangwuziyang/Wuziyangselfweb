import type { Viewport } from "next";
import { Suspense } from "react";
import ProfileChatLauncher from "@/components/ProfileChatLauncher";
import ScrollEffects from "@/components/ui/ScrollEffects";

// Cindy tour (/cindy/...): Cindy third-person chat and scroll reveals. The homepage's own
// styles (home-story.css, display serifs) are attached by app/(cindy)/cindy/page.tsx.
// Subpages keep their 9343abf dark look and override the viewport with cindySubpageViewport.
export const viewport: Viewport = {
  themeColor: "#f9f4eb",
  colorScheme: "light",
};

export default function CindyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-site="cindy">
      <ProfileChatLauncher>{children}</ProfileChatLauncher>
      <Suspense fallback={null}>
        <ScrollEffects />
      </Suspense>
    </div>
  );
}
