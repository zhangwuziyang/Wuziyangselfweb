"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pending = new Set<HTMLElement>();
    let observer: IntersectionObserver | undefined;

    function reveal(element: HTMLElement, animated: boolean) {
      pending.delete(element);
      observer?.unobserve(element);
      element.dataset.scrollReveal = animated ? "entered" : "visible";
    }

    function anchorTarget() {
      try {
        return document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      } catch {
        return null;
      }
    }

    function revealAnchor() {
      const target = anchorTarget();
      if (!target) return;
      for (const element of pending) {
        if (target.contains(element) || element.contains(target)) reveal(element, false);
      }
    }

    function observe() {
      observer?.disconnect();
      if (motion.matches || !("IntersectionObserver" in window)) {
        for (const element of pending) reveal(element, false);
        return;
      }

      observer = new IntersectionObserver((entries) => {
        for (const { target, isIntersecting, boundingClientRect } of entries) {
          if (isIntersecting && pending.has(target as HTMLElement)) {
            reveal(target as HTMLElement, boundingClientRect.top >= 0);
          }
        }
      }, {
        // Extending the top edge also catches elements skipped by a fast scroll.
        rootMargin: `${document.documentElement.scrollHeight}px 0px -${Math.round(window.innerHeight * 0.15)}px 0px`,
      });
      for (const element of pending) observer.observe(element);
    }

    function onFocus(event: FocusEvent) {
      for (const element of pending) {
        if (event.target instanceof Node && element.contains(event.target)) reveal(element, false);
      }
    }

    if (!motion.matches && "IntersectionObserver" in window) {
      const target = anchorTarget();
      for (const element of document.querySelectorAll<HTMLElement>('[data-scroll-reveal=""]')) {
        if (element.closest(".home-story") || element.getBoundingClientRect().top < window.innerHeight
          || element.contains(document.activeElement)
          || (target && (target.contains(element) || element.contains(target)))) continue;
        element.dataset.scrollReveal = "pending";
        pending.add(element);
      }
      observe();
    }

    window.addEventListener("resize", observe);
    window.addEventListener("hashchange", revealAnchor);
    document.addEventListener("focusin", onFocus);
    motion.addEventListener("change", observe);

    return () => {
      observer?.disconnect();
      for (const element of pending) delete element.dataset.scrollReveal;
      window.removeEventListener("resize", observe);
      window.removeEventListener("hashchange", revealAnchor);
      document.removeEventListener("focusin", onFocus);
      motion.removeEventListener("change", observe);
    };
  }, [pathname]);

  return null;
}
