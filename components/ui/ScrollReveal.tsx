import type { CSSProperties, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}

export function ScrollReveal({ children, delay = 0, className, as: Tag = "div" }: ScrollRevealProps) {
  return (
    <Tag
      data-scroll-reveal=""
      className={className}
      style={delay ? { "--reveal-delay": `${delay}ms` } as CSSProperties : undefined}
    >
      {children}
    </Tag>
  );
}
