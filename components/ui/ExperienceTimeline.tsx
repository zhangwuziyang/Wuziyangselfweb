import type { ReactNode } from "react";

export function ExperienceTimeline({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-2 left-[7px] w-px bg-[var(--story-edge)]" aria-hidden="true" />
      <div
        data-timeline-fill=""
        className="absolute inset-y-2 left-[7px] w-px origin-top bg-[var(--story-tint)]"
        aria-hidden="true"
      />
      <ol>{children}</ol>
    </div>
  );
}
