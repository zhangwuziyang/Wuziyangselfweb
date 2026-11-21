import type { ReactNode } from "react";

export function ExperienceTimeline({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-2 left-[11px] w-px bg-white/12 lg:left-[211px]" aria-hidden="true" />
      <div
        data-timeline-fill=""
        className="absolute inset-y-2 left-[11px] w-px origin-top bg-linear-to-b from-[#bbd6ff] to-[#6c91cb] lg:left-[211px]"
        aria-hidden="true"
      />
      <ol>{children}</ol>
    </div>
  );
}
