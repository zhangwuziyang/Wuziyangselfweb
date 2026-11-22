import { CINDY_SCENES, type Chapter } from "./cindy-scenes";
import {
  CAPTION_ENTER, CAPTION_EXIT, TRAVEL_START, clamp, ease, measureRoute, rgb, sampleGuide,
} from "./cindy-route";
import { CINDY_BITMAP, paintCindy, type PixelOffset } from "./cindy-sprite";

const SETTLE_MS = 320;
const MIN_LINE_MS = 1_200;
const IDLE_MS = 20_000;

type Guide = { dock: HTMLDivElement; button: HTMLButtonElement; sprite: HTMLCanvasElement; note: HTMLParagraphElement };
type Dialogue = { chapter?: Chapter; since: number; eligibleSince?: number; next: number; visible: boolean };

export function updateCindyDialogue(
  state: Dialogue, chapter: Chapter, phase: number, present: boolean, parked: boolean,
  time: number, lastScroll: number, fastUntil: number,
): Dialogue {
  if (!present || !parked) {
    return { since: state.since, next: Infinity, visible: false };
  }
  const holdUntil = state.since + MIN_LINE_MS;
  if (state.visible && state.chapter === chapter) {
    const leaving = phase < CAPTION_EXIT;
    return leaving && time >= holdUntil
      ? { since: state.since, next: Infinity, visible: false }
      : { ...state, next: leaving ? holdUntil : Infinity };
  }
  if (phase < CAPTION_ENTER) return { since: state.since, next: Infinity, visible: false };
  const eligibleSince = state.chapter === chapter ? state.eligibleSince ?? time : time;
  const next = Math.max(eligibleSince + SETTLE_MS, lastScroll + SETTLE_MS, fastUntil, holdUntil);
  return time >= next
    ? { chapter, since: time, next: Infinity, visible: true }
    : { chapter, since: state.since, eligibleSince, next, visible: false };
}

function writeStyle(element: HTMLElement, property: "transform" | "opacity" | "backgroundColor", value: string) {
  if (element.style[property] !== value) element.style[property] = value;
}

function writeVariable(element: HTMLElement, name: string, value: string) {
  if (element.style.getPropertyValue(name) !== value) element.style.setProperty(name, value);
}

export function mountCindy({ dock, button, sprite, note }: Guide) {
  const story = dock.closest<HTMLElement>(".home-story");
  if (!story) return;
  const home = story;
  const base = home.querySelector<HTMLElement>("[data-story-base]");
  const blend = home.querySelector<HTMLElement>("[data-story-blend]");
  const timeline = home.querySelector<HTMLElement>("[data-timeline-fill]");
  const context = sprite.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const events = new AbortController();
  const { signal } = events;

  const layers = Array.from({ length: 2 }, () => {
    const layer = document.createElement("canvas");
    layer.width = layer.height = CINDY_BITMAP;
    return layer.getContext("2d");
  });
  const introductions = new Map<HTMLElement, { top: number; progress: number }>();
  let route = measureRoute(home);
  readIntroductions();
  let track = readTimeline();
  let resize = false;
  let frame = 0;
  let timer = 0;
  let dialogue: Dialogue = { since: -Infinity, next: Infinity, visible: false };
  let spriteKey = "";
  let paletteKey = "";
  let lastScroll = -Infinity;
  let previousScroll = window.scrollY;
  let fastUntil = 0;
  let lastActivity = performance.now();
  let attentionUntil = 0;
  let pointer: PixelOffset | null = null;
  let hovered = false;
  let visible = false;
  let drawnChapter: Chapter | undefined;
  let noteFits = true;
  let measuredLine = "";

  function readTimeline() {
    const rect = timeline?.parentElement?.getBoundingClientRect();
    const nodes = Array.from(home.querySelectorAll<HTMLElement>("[data-cindy-node]"), element => ({
      element, y: element.getBoundingClientRect().top + window.scrollY,
    }));
    return rect ? { top: rect.top + window.scrollY, height: rect.height, nodes } : null;
  }

  function invalidate() {
    resize = true;
    schedule();
  }

  function readIntroductions() {
    const selector = "main [data-scroll-reveal], .story-projects__caption > div, #music .story-photo-shadow, #music .story-panel";
    for (const element of home.querySelectorAll<HTMLElement>(selector)) {
      if (element.querySelector("[data-cindy-station]")) continue;
      const previous = introductions.get(element);
      const top = element.getBoundingClientRect().top;
      const progress = previous?.progress ?? (top < route.height ? 1 : 0);
      const offset = !reduced.matches && previous ? (1 - progress) * 10 : 0;
      introductions.set(element, { top: top + window.scrollY - offset, progress });
      if (!previous) {
        writeVariable(element, "--cindy-intro", String(progress));
        element.setAttribute("data-cindy-intro", "");
      }
    }
  }

  function introduceContent(y: number, scroll: number) {
    const line = scroll + clamp(y + 150, route.height * .63, route.height * .89);
    for (const [element, intro] of introductions) {
      if (intro.progress >= 1) continue;
      const progress = reduced.matches ? 1 : ease(clamp((line - intro.top + 29) / 112));
      if (progress <= intro.progress) continue;
      intro.progress = progress;
      writeVariable(element, "--cindy-intro", progress.toFixed(3));
    }
  }

  function backdrop({ from, to, blend: amount }: NonNullable<ReturnType<typeof sampleGuide>>) {
    const colors = `${from}:${to}`;
    if (paletteKey !== colors) {
      if (base) base.style.backgroundColor = rgb(CINDY_SCENES[from].color);
      if (blend) blend.style.backgroundColor = rgb(CINDY_SCENES[to].color);
      paletteKey = colors;
    }
    if (blend) writeStyle(blend, "opacity", amount.toFixed(4));
  }

  function lightTimeline(scroll: number) {
    if (!timeline || !track?.height) return;
    const passed = scroll + route.height * .60;
    const scale = reduced.matches ? 1 : clamp((passed - track.top) / track.height);
    writeStyle(timeline, "transform", `scaleY(${scale.toFixed(3)})`);
    for (const { element, y } of track.nodes) element.toggleAttribute("data-lit", reduced.matches || passed >= y);
  }

  function showActor(next: boolean) {
    if (visible === next) return;
    visible = next;
    home.toggleAttribute("data-cindy-present", next);
    button.tabIndex = next ? 0 : -1;
    if (!next && document.activeElement === button) {
      document.querySelector<HTMLButtonElement>(".profile-chat-launcher button")?.focus({ preventScroll: true });
    }
    button.setAttribute("aria-hidden", String(!next));
  }

  function render(time: number) {
    frame = 0;
    window.clearTimeout(timer);
    const layoutChanged = resize;
    if (layoutChanged) {
      route = measureRoute(home);
      track = readTimeline();
      readIntroductions();
      resize = false;
    }
    const scroll = window.scrollY;
    lightTimeline(scroll);

    const sample = sampleGuide(route, scroll, reduced.matches);
    if (!sample || document.hidden) {
      showActor(false);
      dialogue = { since: dialogue.since, next: Infinity, visible: false };
      dock.removeAttribute("data-speaking");
      dock.setAttribute("data-travel", "");
      note.setAttribute("aria-hidden", "true");
      writeStyle(dock, "opacity", "0");
      return;
    }

    backdrop(sample);
    introduceContent(sample.y, scroll);
    const { station, travel, pixels } = sample;
    const firstFrameHere = drawnChapter !== station.chapter;
    const scene = CINDY_SCENES[station.chapter];
    const isReduced = reduced.matches;
    const { caption, hint } = station;
    const { compact } = station;
    const traveling = travel > TRAVEL_START;
    const parked = !traveling;
    const captionVisible = sample.y + caption.y + caption.height / 2 <= route.height;
    const hintVisible = parked && sample.y + hint.y + hint.height / 2 <= route.height;
    const phase = 1 - travel;
    const asleep = time - lastActivity >= IDLE_MS && parked;
    const preview = !isReduced && time < attentionUntil && station.chapter === "projects" && parked;
    const animateGesture = !isReduced && parked && !asleep && scene.pose !== "think";
    const step = animateGesture ? Math.floor(time / 480) % 3 : 0;
    const walkingStep = Math.floor(scroll / 18) % 3;
    const pose = asleep ? "rest" : scene.pose;
    const expression = asleep ? "sleep" : hovered && parked ? "happy" : scene.expression;
    const facing = station.reverse ? -1 : 1;
    const x = Number(sample.x.toFixed(2));
    const y = Number(sample.y.toFixed(2));
    const poseMix = isReduced ? 0 : Math.round(ease(clamp((travel - TRAVEL_START) * 1.9)) * 40) / 40;
    const noteWidth = caption.width - 4;
    const noteHeight = caption.height - 8;
    const gaze = isReduced || asleep ? { x: 0, y: 0 } : preview ? { x: 2, y: -1 } : {
      x: pointer ? Math.round(clamp((pointer.x - x) / 85, -1, 1)) * facing : 0,
      y: pointer ? Math.round(clamp((pointer.y - y) / 85, -1, 1)) : 0,
    };

    showActor(true);
    writeStyle(dock, "transform", `translate3d(${x}px, ${y}px, 0)`);
    writeStyle(dock, "opacity", "1");
    writeVariable(dock, "--cindy-pixels", pixels.toFixed(4));
    if (!traveling) {
      writeVariable(dock, "--cindy-note-x", `${caption.x - noteWidth / 2 - x}px`);
      writeVariable(dock, "--cindy-note-y", `${caption.y}px`);
      writeVariable(dock, "--cindy-note-width", `${Math.max(0, noteWidth).toFixed(2)}px`);
      writeVariable(dock, "--cindy-note-height", `${noteHeight}px`);
      writeVariable(dock, "--cindy-hint-x", `${hint.x - x}px`);
      writeVariable(dock, "--cindy-hint-y", `${hint.y}px`);
      writeVariable(dock, "--cindy-hint-width", `${hint.width - 4}px`);
    }
    dock.setAttribute("data-scene", station.chapter);
    dock.toggleAttribute("data-parked", parked);
    dock.toggleAttribute("data-hint", hintVisible);
    dock.toggleAttribute("data-travel", traveling || firstFrameHere);

    dialogue = updateCindyDialogue(dialogue, station.chapter, phase, visible && captionVisible && noteWidth >= 82, parked, time, lastScroll, fastUntil);
    if (dialogue.visible && dialogue.chapter) {
      const lang = document.documentElement.lang.startsWith("zh") ? "zh" : "en";
      const line = CINDY_SCENES[dialogue.chapter].line[lang];
      const key = `${line}:${noteWidth}:${noteHeight}`;
      if (note.textContent !== line) note.textContent = line;
      if (measuredLine !== key || layoutChanged) {
        noteFits = note.scrollHeight <= note.clientHeight + 1;
        measuredLine = key;
      }
    }
    const speaking = dialogue.visible && noteFits;
    dock.toggleAttribute("data-speaking", speaking);
    note.setAttribute("aria-hidden", String(!speaking));
    drawnChapter = station.chapter;

    const walkGaze = { x: 0, y: 0 };
    const nextKey = poseMix === 1 ? `walk:${walkingStep}`
      : [pose, expression, gaze.x, gaze.y, step, compact, facing, poseMix, poseMix ? walkingStep : 0].join(":");
    if (context && nextKey !== spriteKey) {
      const [resting, walking] = layers;
      const paintStation = (target: CanvasRenderingContext2D) => {
        target.setTransform(facing, 0, 0, 1, facing < 0 ? CINDY_BITMAP : 0, 0);
        paintCindy(target, pose, expression, gaze, step, compact);
        target.resetTransform();
      };
      if (poseMix === 1) paintCindy(context, "walk", "neutral", walkGaze, walkingStep, true);
      else if (poseMix > 0 && resting && walking) {
        paintStation(resting);
        paintCindy(walking, "walk", "neutral", walkGaze, walkingStep, true);
        context.clearRect(0, 0, CINDY_BITMAP, CINDY_BITMAP);
        // Add the two premultiplied frames so the shared body stays opaque through the pose blend.
        context.globalCompositeOperation = "lighter";
        context.globalAlpha = 1 - poseMix;
        context.drawImage(resting.canvas, 0, 0);
        context.globalAlpha = poseMix;
        context.drawImage(walking.canvas, 0, 0);
        context.globalAlpha = 1;
        context.globalCompositeOperation = "source-over";
      } else paintStation(context);
      spriteKey = nextKey;
      button.dataset.sprite = "ready";
    }
    const gesture = animateGesture ? (Math.floor(time / 480) + 1) * 480 : Infinity;
    const idle = parked && !asleep ? lastActivity + IDLE_MS : Infinity;
    const attention = preview ? attentionUntil : Infinity;
    const next = Math.min(dialogue.next, gesture, idle, attention);
    if (Number.isFinite(next)) timer = window.setTimeout(schedule, Math.max(1, next - time));
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  function scroll() {
    const now = performance.now();
    const position = window.scrollY;
    const delta = position - previousScroll;
    if (delta) {
      if (Math.abs(delta) > Math.max(42, (now - lastScroll) * 1.3)) fastUntil = now + 410;
      previousScroll = position;
      lastScroll = now;
      lastActivity = now;
    }
    schedule();
  }

  window.addEventListener("scroll", scroll, { passive: true, signal });
  window.addEventListener("resize", invalidate, { signal });
  window.addEventListener("pageshow", invalidate, { signal });
  window.addEventListener("pointermove", event => {
    if (!event.isPrimary || event.pointerType !== "mouse" || !visible) return;
    pointer = { x: event.clientX, y: event.clientY };
    lastActivity = performance.now();
    schedule();
  }, { passive: true, signal });
  button.addEventListener("pointerenter", event => {
    if (event.pointerType !== "mouse") return;
    hovered = true;
    schedule();
  }, { signal });
  button.addEventListener("pointerleave", () => { hovered = false; schedule(); }, { signal });
  button.addEventListener("focus", () => { lastActivity = performance.now(); schedule(); }, { signal });
  document.documentElement.addEventListener("pointerleave", () => {
    pointer = null;
    hovered = false;
    schedule();
  }, { signal });
  document.addEventListener("visibilitychange", schedule, { signal });
  home.addEventListener("cindy:preview", () => {
    attentionUntil = performance.now() + 950;
    lastActivity = performance.now();
    schedule();
  }, { signal });
  reduced.addEventListener("change", invalidate, { signal });

  const sizes = new ResizeObserver(invalidate);
  for (const item of home.querySelectorAll("main > section, .story-nav, .cindy-station__layout")) sizes.observe(item);
  const language = new MutationObserver(invalidate);
  language.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  schedule();
  return () => {
    events.abort();
    sizes.disconnect();
    language.disconnect();
    home.removeAttribute("data-cindy-present");
    for (const element of introductions.keys()) {
      element.removeAttribute("data-cindy-intro");
      element.style.removeProperty("--cindy-intro");
    }
    window.clearTimeout(timer);
    cancelAnimationFrame(frame);
  };
}
