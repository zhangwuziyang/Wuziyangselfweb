"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties, MouseEvent, ReactNode } from "react";

export type Site = "main" | "cindy";

const TOUR_KEY = "wz-tour";
const HOME: Record<Site, string> = { main: "/", cindy: "/cindy" };

// Next keeps the previous route mounted but hidden (display: none) after a client navigation,
// so "arrived" means the target site is the one being displayed.
function shown(site: Site) {
  return [...document.querySelectorAll<HTMLElement>(`[data-site="${site}"]`)].some((el) => el.getClientRects().length > 0);
}

/** Resolves once the target site is displayed and the old one is not (or after a cap). */
function waitForSite(site: Site, timeoutMs = 1500) {
  const other = site === "main" ? "cindy" : "main";
  const start = performance.now();
  // Timers, not requestAnimationFrame: rendering (and so rAF) is paused while a view
  // transition waits for this promise.
  return new Promise<void>((resolve) => {
    const check = () => {
      const arrived = shown(site) && !shown(other);
      if (arrived || performance.now() - start > timeoutMs) resolve();
      else window.setTimeout(check, 16);
    };
    window.setTimeout(check, 0);
  });
}

/**
 * Link between the standard site and the Cindy tour. Writing wz-tour only remembers the
 * visitor's choice (nothing redirects on it). The client navigation is wrapped in a view
 * transition (plain cross-fade, see globals.css) when supported and motion is allowed.
 */
export default function SiteSwitchLink({
  to,
  className,
  style,
  children,
}: {
  to: Site;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const router = useRouter();
  const href = HOME[to];

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    try {
      localStorage.setItem(TOUR_KEY, to);
    } catch {
      // storage unavailable: the switch still works, it just is not remembered
    }
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof document.startViewTransition !== "function") return; // plain Link navigation
    event.preventDefault();
    document.startViewTransition(() => {
      router.push(href);
      return waitForSite(to);
    });
  }

  return (
    <Link href={href} onClick={onClick} className={className} style={style} data-site-switch={to}>
      {children}
    </Link>
  );
}
