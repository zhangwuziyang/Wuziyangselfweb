import type { Viewport } from "next";
import ProfileChat from "@/components/main/ProfileChat";
import "./main.css";

// Standard site (df2f82a look): dark photo style, first-person chat.
export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-site="main" className="bg-black">
      {children}
      <ProfileChat />
    </div>
  );
}
