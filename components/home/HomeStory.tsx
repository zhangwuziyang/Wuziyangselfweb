"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useScroll } from "framer-motion";
import DeviceStage from "./DeviceStage";
import { TRAVEL_PHOTOS } from "./story-media";
import { CHAPTERS, buildStageTimeline, clamp, frameWeights, mix, samplePose, smooth, type Chapter, type FrameCue, type Pose } from "./story-motion";

const INITIAL_MEDIA: ReadonlySet<string> = new Set(["intro"]);
const RIGHT_CHAPTERS: ReadonlySet<string> = new Set(["about", "global", "skills", "contact"]);
const MOBILE_PREVIEWS = ["about", "experience", "global", "music", "skills", "philosophy", "contact"] as const;

function offsetFrom(element: HTMLElement, ancestor: HTMLElement) {
  let x = 0;
  let y = 0;
  for (let node = element; node && node !== ancestor; node = node.offsetParent as HTMLElement) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return { x, y };
}

function write(element: HTMLElement, property: "transform" | "opacity" | "translate" | "visibility", value: string | number) {
  const next = String(value);
  if (element.style[property] !== next) element.style[property] = next;
}

function poseTransform([x, y, scale, pitch, yaw, roll]: Pose, width: number, height: number) {
  return `translate3d(${x * width}px, ${y * height}px, 0) perspective(1450px) rotateX(${pitch}deg) rotateY(${yaw}deg) rotateZ(${roll}deg) scale(${scale})`;
}

export default function HomeStory({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const [media, setMedia] = useState(INITIAL_MEDIA);

  useEffect(() => {
    const stage = stageRef.current;
    const content = contentRef.current;
    if (!stage || !content) return;

    const laptop = stage.querySelector<HTMLElement>("[data-stage-laptop]");
    const phone = stage.querySelector<HTMLElement>("[data-stage-phone]");
    const hinge = stage.querySelector<HTMLElement>("[data-stage-hinge]");
    const power = stage.querySelector<HTMLElement>("[data-stage-power]");
    const screenName = stage.querySelector<HTMLElement>("[data-stage-name]");
    const title = content.querySelector<HTMLElement>("[data-story-hero-name]");
    const heroPin = title?.closest<HTMLElement>(".story-hero__pin");
    const heroTrack = heroPin?.parentElement;
    const runway = content.querySelector<HTMLElement>("[data-project-runway]");
    if (!laptop || !phone || !hinge || !power || !screenName || !title || !heroPin || !heroTrack || !runway) return;

    const devices = { laptop, phone, hinge, power, screenName, title };
    const layout = { stage, runway };
    const hero = { pin: heroPin, track: heroTrack };
    const sections = Object.fromEntries(CHAPTERS.map((id) => [
      id, content.querySelector<HTMLElement>(`#${id}`),
    ])) as Record<Chapter, HTMLElement | null>;
    const frames = new Map([...stage.querySelectorAll<HTMLElement>("[data-stage-frame]")].map((el) => [el.dataset.stageFrame!, el]));
    const travelCards = [...stage.querySelectorAll<HTMLElement>("[data-stage-travel]")];
    const lights = [...stage.querySelectorAll<HTMLElement>("[data-stage-light]")];
    const timelineRail = content.querySelector<HTMLElement>("[data-timeline-fill]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 70rem)");

    const textCues = [...content.querySelectorAll<HTMLElement>("[data-scroll-reveal]")].map((element) => ({
      element,
      track: element.closest<HTMLElement>("[data-story-pin-track]"),
      opening: element.hasAttribute("data-story-opening"),
      right: RIGHT_CHAPTERS.has(element.closest("main > section")?.id ?? ""),
      start: 0,
      end: 0,
    }));

    let metrics: {
      width: number;
      height: number;
      travelHeight: number;
      maxScroll: number;
      desktop: boolean;
      starts: Record<Chapter, number>;
      timing: ReturnType<typeof buildStageTimeline>;
      name: { x: number; y: number; toX: number; toY: number; scale: number; pinTop: number; pinBottom: number; stickyInset: number };
      railTop: number;
      railBottom: number;
    } | undefined;
    let assetSignature = "intro";
    let measureFrame = 0;
    let unsubscribe: (() => void) | undefined;

    function render(progress: number) {
      if (!metrics) return;
      const { laptop, phone, hinge, power, screenName, title } = devices;
      const { width, height, travelHeight, maxScroll, starts, timing, name, desktop } = metrics;
      const scroll = clamp(progress) * maxScroll;

      const loading = new Set<string>();
      function paintScreen(cues: readonly FrameCue[], visible: boolean) {
        for (const { id, opacity, offset } of frameWeights(cues, scroll, height)) {
          const frame = frames.get(id);
          if (frame) {
            write(frame, "opacity", opacity);
            write(frame, "visibility", opacity > 0 ? "visible" : "hidden");
            write(frame, "transform", `translate3d(0, ${offset}px, 0)`);
          }
          if (visible && opacity > 0) loading.add(id);
        }
        // The fixed screen is in the viewport even before its scene. Mount only the active and imminent images.
        if (visible) {
          const upcoming = cues.find(({ at }) => at > scroll && at - scroll < height * 1.28);
          if (upcoming) loading.add(upcoming.id);
        }
      }

      const book = samplePose(timing.laptopPoses, scroll);
      const phonePose = samplePose(timing.phonePoses, scroll);
      const opening = smooth(0, timing.landing * .80, scroll);
      const closing = smooth(starts.contact + height * .18, maxScroll - height * .02, scroll);
      const showProjects = timing.showProjects(scroll);
      const gallery = smooth(timing.playbackEnd, timing.gallery, scroll) * (1 - smooth(starts.global - height * .45, starts.global, scroll));
      const phoneEnter = desktop
        ? smooth(timing.playbackStart - height * .42, timing.playbackStart + height * .12, scroll)
        : smooth(timing.webEnd, timing.phoneArrival + height * .20, scroll);
      const phoneExit = smooth(timing.playbackEnd - height * .08, timing.gallery, scroll);
      const phoneAlpha = phoneEnter * (1 - phoneExit);
      const phoneSegment = desktop ? 0 : smooth(timing.webEnd - height * .29, timing.webEnd, scroll) * (1 - phoneExit);

      const mobilePreview = desktop ? 0 : Math.max(...MOBILE_PREVIEWS.map((chapter) => {
        const start = starts[chapter];
        return smooth(start - height * .28, start, scroll) * (1 - smooth(start + height * .08, start + height * .43, scroll));
      }));
      const mobileBackdrop = desktop ? 1 : mix(.25, 1, Math.max(
        1 - smooth(timing.landing, starts.about, scroll),
        showProjects * (1 - gallery) * (1 - smooth(timing.gallery, timing.gallery + height * .22, scroll)),
        mobilePreview * .67,
      ));
      const galleryShade = 1 - gallery * .91;
      const laptopAlpha = mobileBackdrop * galleryShade * (1 - phoneSegment) * (1 - closing * .22);
      write(laptop, "transform", poseTransform(book, width, height));
      write(laptop, "opacity", laptopAlpha);
      write(phone, "transform", poseTransform(phonePose, width, height));
      write(phone, "opacity", phoneAlpha);
      write(hinge, "transform", `perspective(1050px) rotateX(${mix(-18, 0, opening) + closing * 88}deg)`);
      write(power, "opacity", clamp((1 - opening) * .68 + closing * .99));
      paintScreen(timing.laptopFrames, laptopAlpha > .05);
      paintScreen(timing.phoneFrames, phoneAlpha > 0 || timing.phoneArrival - scroll < height * 1.20 && scroll <= timing.phoneArrival);

      const handoff = smooth(timing.landing * .15, timing.landing * .92, scroll);
      const seated = smooth(timing.landing * .82, timing.landing, scroll);
      const titleScroll = Math.min(scroll, timing.landing);
      const pinY = Math.min(Math.max(name.pinTop - titleScroll, name.stickyInset), name.pinBottom - titleScroll);
      const titleY = pinY + name.y;
      write(title, "transform", `translate3d(${(name.toX - name.x) * handoff}px, ${(name.toY - titleY) * handoff}px, 0) scale(${mix(1, name.scale, handoff)})`);
      write(title, "opacity", 1 - seated);
      write(screenName, "opacity", seated);

      const travel = clamp((scroll - starts.global) / travelHeight);
      const musicFade = smooth(starts.music - height * .4, starts.music + height * .2, scroll);
      const travelTone = smooth(starts.global - height * .32, starts.global + height * .30, scroll) * (1 - musicFade);
      const campusTone = smooth(starts.about - height * .6, starts.about + height * .15, scroll) * (1 - smooth(starts.experience - height * .35, starts.experience + height * .15, scroll));
      const projectTone = showProjects * (1 - smooth(timing.gallery, timing.gallery + height * .35, scroll));
      const lighting = [campusTone * .83, projectTone, travelTone];
      for (const [index, light] of lights.entries()) write(light, "opacity", lighting[index]);

      if (desktop && scroll > starts.global - height * .85 && scroll < starts.music) loading.add("travel-field");
      for (const [index, element] of travelCards.entries()) {
        const { x, y, angle } = TRAVEL_PHOTOS[index];
        const flight = smooth(.075 + index * .042, .57 + index * .035, travel);
        const lift = smooth(.09 + index * .035, .36 + index * .038, travel);
        const drift = smooth(.58, 1, travel);
        const opacity = desktop ? lift * (1 - smooth(.73, .99, travel)) * (x > .2 ? .42 : .72) : 0;
        const xPosition = mix(book[0], x + .026 * drift, flight) * width;
        const yPosition = mix(book[1], y - .085 * drift, flight) * height;
        write(element, "opacity", opacity);
        write(element, "transform", `translate3d(${xPosition}px, ${yPosition}px, 0) rotate(${angle * flight}deg) scale(${mix(.22, 1, flight)})`);
      }

      for (const cue of textCues) {
        const enter = cue.opening ? 1 : smooth(cue.start - height * .98, cue.start - height * .69, scroll);
        const exit = cue.opening
          ? smooth(timing.landing * .36, timing.landing * .9, scroll)
          : smooth(cue.end - height * .14, cue.end - 24, scroll);
        const travel = 1 - enter - exit;
        const x = desktop ? (cue.right ? 38 : -38) * travel : 0;
        const y = (desktop ? 18 : 21) * travel;
        write(cue.element, "opacity", Math.round(enter * (1 - exit) * 1000) / 1000);
        write(cue.element, "translate", `${Math.round(x * 10) / 10}px ${Math.round(y * 10) / 10}px`);
      }
      if (timelineRail) {
        const scale = smooth(metrics.railTop - height * .66, metrics.railBottom - height * .56, scroll);
        write(timelineRail, "transform", `scaleY(${scale})`);
      }

      const signature = [...loading].sort().join("|");
      if (assetSignature !== signature) {
        assetSignature = signature;
        setMedia(loading);
      }
    }

    function measure() {
      measureFrame = 0;
      if (reduced.matches) return;
      const viewport = document.documentElement;
      const height = viewport.clientHeight;
      const width = viewport.clientWidth;
      const scroll = window.scrollY;
      const maxScroll = Math.max(1, viewport.scrollHeight - height);
      const desktop = wide.matches;
      const starts = Object.fromEntries(CHAPTERS.map((chapter) => [
        chapter, Math.max(0, (sections[chapter]?.getBoundingClientRect().top ?? 0) + scroll - height * .49),
      ])) as Record<Chapter, number>;
      const projectBounds = layout.runway.getBoundingClientRect();
      const runwayTop = projectBounds.top + scroll;
      const timing = buildStageTimeline(starts, { top: runwayTop, bottom: projectBounds.bottom + scroll }, height, maxScroll, desktop);

      const trackBounds = hero.track.getBoundingClientRect();
      const trackStyle = getComputedStyle(hero.track);
      const pinStyle = getComputedStyle(hero.pin);
      const titleOffset = offsetFrom(devices.title, hero.pin);
      const withinScreen = offsetFrom(devices.screenName, devices.laptop);
      const landing = timing.laptopLanding;
      const name = {
        x: hero.pin.getBoundingClientRect().left + titleOffset.x,
        y: titleOffset.y,
        pinTop: trackBounds.top + scroll + (parseFloat(trackStyle.paddingBlockStart) || 0),
        pinBottom: trackBounds.bottom + scroll - (parseFloat(trackStyle.paddingBlockEnd) || 0) - hero.pin.offsetHeight,
        stickyInset: pinStyle.position === "sticky" ? (parseFloat(pinStyle.top) || 0) : -Infinity,
        toX: width * (.5 + landing[0]) + (withinScreen.x - devices.laptop.offsetWidth / 2) * landing[2],
        toY: layout.stage.clientHeight / 2 + height * landing[1] + (withinScreen.y - devices.laptop.offsetHeight / 2) * landing[2],
        scale: devices.screenName.offsetWidth / Math.max(1, devices.title.offsetWidth) * landing[2],
      };
      for (const cue of textCues) {
        const bounds = (cue.track ?? cue.element).getBoundingClientRect();
        const currentShift = cue.track ? 0 : parseFloat(getComputedStyle(cue.element).translate.split(" ")[1]) || 0;
        cue.start = bounds.top + scroll - currentShift;
        cue.end = bounds.bottom + scroll - currentShift;
      }
      const railBounds = timelineRail?.parentElement?.getBoundingClientRect();
      metrics = {
        width, height, maxScroll, starts, timing, desktop, name,
        travelHeight: Math.max(height, starts.music - starts.global),
        railTop: (railBounds?.top ?? 0) + scroll,
        railBottom: (railBounds?.bottom ?? 0) + scroll,
      };
      render(scroll / maxScroll);
    }

    function scheduleMeasure() {
      if (!measureFrame) measureFrame = requestAnimationFrame(measure);
    }
    function clearMotion() {
      for (const element of [...Object.values(devices), ...frames.values(), ...lights, ...travelCards, timelineRail, ...textCues.map(({ element }) => element)]) {
        element?.style.removeProperty("transform");
        element?.style.removeProperty("opacity");
        element?.style.removeProperty("translate");
        element?.style.removeProperty("visibility");
      }
    }

    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(scheduleMeasure);
    function syncPreference() {
      unsubscribe?.();
      observer?.disconnect();
      cancelAnimationFrame(measureFrame);
      measureFrame = 0;
      if (reduced.matches) {
        clearMotion();
        assetSignature = "intro";
        setMedia(INITIAL_MEDIA);
        return;
      }
      measure();
      for (const element of [content, devices.title, devices.screenName, ...Object.values(sections)]) {
        if (element) observer?.observe(element);
      }
      unsubscribe = scrollYProgress.on("change", render);
    }

    syncPreference();
    reduced.addEventListener("change", syncPreference);
    window.addEventListener("resize", scheduleMeasure);
    return () => {
      unsubscribe?.();
      observer?.disconnect();
      cancelAnimationFrame(measureFrame);
      reduced.removeEventListener("change", syncPreference);
      window.removeEventListener("resize", scheduleMeasure);
      clearMotion();
    };
  }, [scrollYProgress]);

  return (
    <div className="home-story">
      <div className="story-stage" ref={stageRef} aria-hidden="true"><DeviceStage media={media} /></div>
      <div className="story-content" ref={contentRef}>{children}</div>
    </div>
  );
}
