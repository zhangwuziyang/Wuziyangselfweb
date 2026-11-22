import { CINDY_SCENES, type Chapter } from "./cindy-scenes";
import {
  CAPTION_ENTER, CAPTION_EXIT, TRAVEL_END, clamp, measureRoute, rgb, samplePalette, sampleStation, stationMotion,
} from "./cindy-route";
import { cindySpriteBounds, paintCindy, type PixelOffset } from "./cindy-sprite";

const STORY_WIDE = "(min-width: 70rem) and (min-height: 34rem)";
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
  const wide = window.matchMedia(STORY_WIDE);
  const events = new AbortController();
  const { signal } = events;

  let route = measureRoute(home);
  let track = readTimeline();
  let resize = false;
  let frame = 0;
  let timer = 0;
  let dialogue: Dialogue = { since: -Infinity, next: Infinity, visible: false };
  let spriteKey = "";
  let paletteKey = "";
  let lastScroll = -Infinity;
  let previousScroll = window.scrollY;
  let direction = 1;
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

  function backdrop(scroll: number) {
    const { from, to, blend: amount } = samplePalette(route, scroll);
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
      resize = false;
    }
    const scroll = window.scrollY;
    backdrop(scroll);
    lightTimeline(scroll);

    const sample = sampleStation(route, scroll);
    if (!sample || sample.phase <= .05 || document.hidden) {
      showActor(false);
      dialogue = { since: dialogue.since, next: Infinity, visible: false };
      dock.removeAttribute("data-speaking");
      dock.setAttribute("data-travel", "");
      note.setAttribute("aria-hidden", "true");
      writeStyle(dock, "opacity", "0");
      return;
    }

    const { station, phase, fullyVisible } = sample;
    const firstFrameHere = drawnChapter !== station.chapter;
    const scene = CINDY_SCENES[station.chapter];
    const isReduced = reduced.matches;
    const large = wide.matches;
    const advance = stationMotion(sample, isReduced, large);
    const parked = !advance.traveling && fullyVisible;
    const asleep = time - lastActivity >= IDLE_MS && parked;
    const preview = !isReduced && time < attentionUntil && station.chapter === "projects" && parked;
    const walk = advance.traveling && scene.entrance === "walk";
    const animateGesture = !isReduced && parked && !asleep && scene.pose !== "think";
    const step = walk ? Math.floor(scroll / 15) % 3 : animateGesture ? Math.floor(time / 480) % 3 : 0;
    const pose = asleep ? "rest" : walk ? "walk" : scene.pose;
    const expression = asleep ? "sleep" : hovered && parked ? "happy" : scene.expression;
    const facing = walk ? (station.reverse ? 1 : -1) * direction : station.reverse ? -1 : 1;
    const art = cindySpriteBounds(pose, asleep, step, !large, facing);
    const hit = large ? 66 : 32;
    const sway = isReduced || advance.traveling ? 0 : 2;
    const sx = Math.max(hit, art.left + sway) * advance.scale + 2;
    const dx = Math.max(hit, art.right + sway) * advance.scale + 2;
    const sy = Math.max(hit, art.top + 4) * advance.scale + 2;
    const dy = Math.max(hit, art.bottom, hit * 1.1) * advance.scale + 2;
    const x = clamp(advance.x, station.left + sx, station.right - dx);
    const y = clamp(advance.y, station.top + sy, station.bottom - dy);
    const noteWidth = Math.min(232, station.reverse ? station.noteEdge - station.left - 4 : station.right - station.noteEdge - 4);
    const localX = station.reverse ? station.noteEdge - noteWidth - x : station.noteEdge - x;
    const gaze = isReduced || asleep ? { x: 0, y: 0 } : preview ? { x: 2, y: -1 } : {
      x: pointer ? Math.round(clamp((pointer.x - x) / 85, -1, 1)) * facing : 0,
      y: pointer ? Math.round(clamp((pointer.y - y + scroll) / 85, -1, 1)) : 0,
    };

    showActor(advance.opacity > .09);
    writeStyle(dock, "transform", `translate3d(${Math.round(x)}px, ${Math.round(y - scroll)}px, 0)`);
    writeStyle(dock, "opacity", advance.opacity.toFixed(3));
    writeVariable(dock, "--cindy-scale", advance.scale.toFixed(3));
    writeVariable(dock, "--cindy-facing", String(facing));
    writeVariable(dock, "--cindy-note-x", `${localX.toFixed(2)}px`);
    writeVariable(dock, "--cindy-note-width", `${Math.max(0, noteWidth).toFixed(2)}px`);
    writeVariable(dock, "--cindy-note-height", `${station.bottom - station.top - 24}px`);
    if (scene.entrance === "peek" && advance.traveling) {
      writeVariable(dock, "--cindy-peek", `${Math.round((1 - clamp(phase / TRAVEL_END)) * 47 - 16)}px`);
    }
    dock.toggleAttribute("data-reverse", station.reverse);
    dock.setAttribute("data-scene", station.chapter);
    dock.setAttribute("data-entrance", scene.entrance);
    dock.toggleAttribute("data-parked", parked);
    dock.toggleAttribute("data-travel", advance.traveling || firstFrameHere);

    dialogue = updateCindyDialogue(dialogue, station.chapter, phase, visible && noteWidth >= 82, parked, time, lastScroll, fastUntil);
    if (dialogue.visible && dialogue.chapter) {
      const lang = document.documentElement.lang.startsWith("zh") ? "zh" : "en";
      const line = CINDY_SCENES[dialogue.chapter].line[lang];
      const key = `${line}:${noteWidth}:${station.bottom - station.top}`;
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

    const nextKey = [pose, expression, gaze.x, gaze.y, step, large].join(":");
    if (context && nextKey !== spriteKey) {
      paintCindy(context, pose, expression, gaze, step, !large);
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
      direction = Math.sign(delta);
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
  wide.addEventListener("change", invalidate, { signal });

  const sizes = new ResizeObserver(invalidate);
  for (const item of home.querySelectorAll("main > section, .story-nav, [data-cindy-station]")) sizes.observe(item);
  const language = new MutationObserver(invalidate);
  language.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  schedule();
  return () => {
    events.abort();
    sizes.disconnect();
    language.disconnect();
    home.removeAttribute("data-cindy-present");
    window.clearTimeout(timer);
    cancelAnimationFrame(frame);
  };
}
