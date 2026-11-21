"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useScroll } from "framer-motion";

const LENS_POSES = [
  // Progress, x and y as fractions of the viewport, scale, pitch, yaw, and oval compression.
  [0, .245, -.01, 1, -11, -17, 1],
  [.12, .287, -.038, .63, 8, 23, .94],
  [.29, .289, .052, .59, -14, -22, .87],
  [.49, .273, -.055, .66, 12, 22, .95],
  [.67, .289, .04, .60, 4, -22, .88],
  [.83, .274, -.055, .65, -10, 14, .91],
  [1, .248, -.01, .79, 6, -13, 1],
] as const;

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function ease(start: number, end: number, value: number) {
  const t = clamp((value - start) / Math.max(1e-6, end - start));
  return t * t * (3 - 2 * t);
}

function lensPose(progress: number) {
  const from = LENS_POSES.findLastIndex(([time]) => time <= progress);
  const a = LENS_POSES[from];
  const b = LENS_POSES[from + 1] ?? a;
  const mix = ease(a[0], b[0], progress);
  return a.slice(1).map((value, i) => value + (b[i + 1] - value) * mix);
}

export default function HomeStory({ stage, children }: { stage: ReactNode; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const root = rootRef.current;
    const content = contentRef.current;
    if (!root || !content) return;

    const lens = root.querySelector<HTMLElement>("[data-story-lens]");
    const globe = root.querySelector<SVGElement>("[data-story-globe]");
    const photo = root.querySelector<HTMLElement>("[data-story-photo]");
    if (!lens || !globe || !photo) return;
    const movingSurfaces = { lens, globe, photo };
    const colors = (["violet", "teal", "amber"] as const).flatMap((name) => {
      const light = root.querySelector<HTMLElement>(`[data-story-light="${name}"]`);
      const material = root.querySelector<HTMLElement>(`[data-story-material="${name}"]`);
      return light && material ? [{ name, light, material }] : [];
    });
    const timeline = content.querySelector<HTMLElement>("[data-timeline-fill]");
    const sections = [content, ...content.querySelectorAll("main > section")];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 70rem)");
    const cues = [...content.querySelectorAll<HTMLElement>("[data-scroll-reveal]")].map((element) => ({
      element,
      track: element.closest<HTMLElement>("[data-story-pin-track]"),
      hero: element.hasAttribute("data-story-opening"),
      top: 0,
      bottom: 0,
      shift: 0,
      opacity: 1,
    }));

    let viewportHeight = 0;
    let viewportWidth = 0;
    let maxScroll = 1;
    let railTop = 0;
    let railBottom = 0;
    let measureFrame = 0;
    let unsubscribe: (() => void) | undefined;

    function render(value: number) {
      const { lens, globe, photo } = movingSurfaces;
      const progress = clamp(value);
      const scroll = progress * maxScroll;
      const desktop = wide.matches;
      const [x, y, scale, pitch, yaw, squash] = lensPose(progress);
      const horizontal = desktop ? x : .16 + .04 * Math.sin(progress * Math.PI * 2);
      const vertical = desktop ? y : y * .7 + .09;
      const sizing = desktop ? scale : .69 + (scale - .6) * .36;
      const opening = 1 - ease(0, .16, progress);
      const rotation = ease(0, 1, progress);
      const violet = ease(0, .29, progress) * (1 - ease(.71, 1, progress));
      const teal = ease(.27, .62, progress) * (1 - ease(.72, .98, progress));
      const amber = .5 * opening + .76 * ease(.78, 1, progress);
      const tones = { violet, teal, amber };

      lens.style.transform = `translate3d(${horizontal * viewportWidth}px, ${vertical * viewportHeight}px, 0) perspective(1250px) rotateX(${pitch}deg) rotateY(${yaw}deg) rotateZ(${-11 + 206 * rotation}deg) scale(${sizing}) scaleY(${squash})`;
      lens.style.opacity = String(desktop ? .9 + opening * .1 : .26 + opening * .40);
      globe.style.transform = `rotate(${-16 + 150 * rotation}deg) scaleX(${.88 + .12 * Math.cos(rotation * Math.PI * 2)})`;
      photo.style.opacity = String(opening * (desktop ? .27 : .16));
      photo.style.transform = `translate3d(0, ${-38 * (1 - opening)}px, 0) scale(${1 + .06 * (1 - opening)})`;
      const lightShift = `translate3d(${(x - .245) * viewportWidth}px, ${y * viewportHeight}px, 0)`;
      for (const { name, light, material } of colors) {
        light.style.opacity = String(tones[name]);
        light.style.transform = lightShift;
        material.style.opacity = String(tones[name] * .88);
      }

      for (const cue of cues) {
        const entering = cue.hero ? 1 : ease(cue.top - viewportHeight * .98, cue.top - viewportHeight * .70, scroll);
        const leaving = cue.hero
          ? ease(viewportHeight * .42, viewportHeight * .86, scroll)
          : ease(cue.bottom - 124, cue.bottom - 41, scroll);
        const opacity = Math.round(entering * (1 - leaving) * 1000) / 1000;
        const travel = desktop ? 34 : 17;
        const shift = Math.round((1 - entering - leaving) * travel * 10) / 10;

        if (shift !== cue.shift) {
          cue.element.style.translate = `0 ${shift}px`;
          cue.shift = shift;
        }
        if (opacity !== cue.opacity) {
          cue.element.style.opacity = String(opacity);
          cue.opacity = opacity;
        }
      }

      if (timeline) {
        const fill = ease(railTop - viewportHeight * .68, railBottom - viewportHeight * .57, scroll);
        timeline.style.transform = `scaleY(${fill})`;
      }
    }

    function measure() {
      measureFrame = 0;
      if (reducedMotion.matches) return;
      const viewport = document.documentElement;
      const scroll = window.scrollY;
      viewportHeight = viewport.clientHeight;
      viewportWidth = viewport.clientWidth;
      maxScroll = Math.max(1, viewport.scrollHeight - viewportHeight);
      for (const cue of cues) {
        const bounds = (cue.track ?? cue.element).getBoundingClientRect();
        const currentShift = cue.track ? 0 : parseFloat(getComputedStyle(cue.element).translate.split(" ")[1]) || 0;
        cue.top = bounds.top + scroll - currentShift;
        cue.bottom = bounds.bottom + scroll - currentShift;
      }
      if (timeline?.parentElement) {
        const bounds = timeline.parentElement.getBoundingClientRect();
        railTop = bounds.top + scroll;
        railBottom = bounds.bottom + scroll;
      }
      render(scroll / maxScroll);
    }

    function scheduleMeasure() {
      if (!measureFrame) measureFrame = requestAnimationFrame(measure);
    }

    function clearMotion() {
      for (const element of [lens, globe, photo, ...colors.flatMap(({ light, material }) => [light, material]), timeline]) {
        element?.style.removeProperty("transform");
        element?.style.removeProperty("opacity");
      }
      for (const cue of cues) {
        cue.element.style.removeProperty("translate");
        cue.element.style.removeProperty("opacity");
        cue.shift = 0;
        cue.opacity = 1;
      }
    }

    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(scheduleMeasure);
    function syncPreference() {
      unsubscribe?.();
      observer?.disconnect();
      cancelAnimationFrame(measureFrame);
      measureFrame = 0;
      if (reducedMotion.matches) {
        clearMotion();
        return;
      }
      measure();
      for (const section of sections) observer?.observe(section);
      unsubscribe = scrollYProgress.on("change", render);
    }

    syncPreference();
    reducedMotion.addEventListener("change", syncPreference);
    window.addEventListener("resize", scheduleMeasure);

    return () => {
      unsubscribe?.();
      observer?.disconnect();
      cancelAnimationFrame(measureFrame);
      reducedMotion.removeEventListener("change", syncPreference);
      window.removeEventListener("resize", scheduleMeasure);
      clearMotion();
    };
  }, [scrollYProgress]);

  return (
    <div ref={rootRef} className="home-story">
      <div className="story-stage" aria-hidden="true">{stage}</div>
      <div ref={contentRef} className="story-content">{children}</div>
    </div>
  );
}
