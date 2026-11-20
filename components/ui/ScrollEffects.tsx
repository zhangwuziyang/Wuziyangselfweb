"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pending = new Set<HTMLElement>();
    const counting = new Map<HTMLElement, number>();
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    let navSurface = "";
    let indicator = document.querySelector<HTMLElement>("[data-scroll-indicator]");
    const sections = [...document.querySelectorAll<HTMLElement>("main > section[data-nav-surface]")];
    const nav = document.querySelector<HTMLElement>("[data-site-nav]");

    function reveal(element: HTMLElement, animated: boolean) {
      pending.delete(element);
      observer?.unobserve(element);
      element.dataset.scrollReveal = animated ? "entered" : "visible";
      if (!animated) return;

      for (const counter of element.querySelectorAll<HTMLElement>("[data-count-up]")) {
        const total = Number(counter.dataset.countUp);
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / 1000, 1);
          counter.textContent = String(Math.floor((1 - (1 - progress) ** 3) * total));
          if (progress < 1) counting.set(counter, requestAnimationFrame(tick));
          else counting.delete(counter);
        };
        counter.textContent = "0";
        counting.set(counter, requestAnimationFrame(tick));
      }
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

    function finishCounting() {
      for (const [counter, animation] of counting) {
        cancelAnimationFrame(animation);
        counter.textContent = counter.dataset.countUp ?? "";
      }
      counting.clear();
    }

    function observe() {
      observer?.disconnect();
      if (motion.matches || !("IntersectionObserver" in window)) {
        for (const element of pending) reveal(element, false);
        finishCounting();
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

    function onPageScroll() {
      frame = 0;
      if (indicator && window.scrollY > 0) {
        indicator.dataset.scrollIndicator = "stopped";
        indicator = null;
      }
      if (nav) {
        const surface = window.scrollY > 30
          ? sections.findLast((section) => section.getBoundingClientRect().top <= 24)?.dataset.navSurface ?? "dark"
          : "top";
        if (surface !== navSurface) {
          navSurface = surface;
          nav.dataset.siteNav = surface;
        }
      }
    }

    function scheduleScroll() {
      if (!frame) frame = requestAnimationFrame(onPageScroll);
    }

    if (!motion.matches && "IntersectionObserver" in window) {
      const target = anchorTarget();
      for (const element of document.querySelectorAll<HTMLElement>('[data-scroll-reveal=""]')) {
        if (element.getBoundingClientRect().top < window.innerHeight
          || element.contains(document.activeElement)
          || (target && (target.contains(element) || element.contains(target)))) continue;
        element.dataset.scrollReveal = "pending";
        pending.add(element);
      }
      observe();
    }

    window.addEventListener("scroll", scheduleScroll, { passive: true });
    window.addEventListener("resize", observe);
    window.addEventListener("hashchange", revealAnchor);
    document.addEventListener("focusin", onFocus);
    motion.addEventListener("change", observe);
    onPageScroll();

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      finishCounting();
      for (const element of pending) delete element.dataset.scrollReveal;
      window.removeEventListener("scroll", scheduleScroll);
      window.removeEventListener("resize", observe);
      window.removeEventListener("hashchange", revealAnchor);
      document.removeEventListener("focusin", onFocus);
      motion.removeEventListener("change", observe);
    };
  }, [pathname]);

  return null;
}
