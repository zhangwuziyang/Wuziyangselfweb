"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export function ExperienceTimeline({ children }: { children: ReactNode }) {
  const railRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: railRef, offset: ["start 75%", "end 60%"] });
  const railFill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div className="relative">
      <div className="absolute top-2 bottom-2 left-[11px] md:left-[211px] w-px bg-white/[0.08]" aria-hidden="true" />
      <motion.div
        data-timeline-fill=""
        className="absolute top-2 bottom-2 left-[11px] md:left-[211px] w-px origin-top"
        style={{ scaleY: railFill, background: "linear-gradient(to bottom, #f5f5f7, rgba(245,245,247,0.25))" }}
        aria-hidden="true"
      />
      <ol ref={railRef}>{children}</ol>
    </div>
  );
}
