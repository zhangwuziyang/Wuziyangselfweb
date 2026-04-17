"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children:  ReactNode;
  delay?:    number;
  duration?: number;
  y?:        number;
  className?: string;
  once?:     boolean;
}

/* Apple's signature easing — used across apple.com */
const APPLE_EASE = [0.25, 0.1, 0.25, 1.0] as const;

export function ScrollReveal({
  children,
  delay    = 0,
  duration = 0.9,
  y        = 36,
  className = "",
  once     = true,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, scale: 0.98 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration,
        delay,
        ease: APPLE_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
