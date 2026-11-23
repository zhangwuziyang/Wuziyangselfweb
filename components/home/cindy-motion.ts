import { CINDY_SCENES, type Chapter } from "./cindy-scenes";
import {
  TRAVEL_START, clamp, ease, measureRoute, rgb, sampleBackdrop, sampleGuide,
} from "./cindy-route";
import { CINDY_BITMAP, paintCindy, type PixelOffset } from "./cindy-sprite";

const IDLE_MS = 20_000;
const SCROLL_SETTLE_MS = 120;
// A new station only speaks once the scroll has been quiet this long. It must clearly exceed a
// slow wheel's notch interval (~110ms, more on a loaded CPU), or a station passed mid-wheel opens
// a bubble; quick scrolls, chapter jumps and the fade between sections are unaffected.
const ENTER_IDLE_MS = 200;
const NOTE_FADE_MS = 200;
// The bubble opens empty with a quiet typing cue, then the first word lands this much later.
const FIRST_TOKEN_MS = 120;
const TYPE_MS = 30;
// Only a burst of scroll events (two or more wheel notches, or a continuous swipe) counts as fast.
const BURST_WINDOW_MS = 100;
const BURST_DISTANCE = 180;
const BURST_SPEED = 1.5;
const BURST_MIN_SPAN_MS = 24;
// The first-visit opening (see HomeStory) lets the bubble pop once Cindy and the hint have settled.
const INTRO_NOTE_MS = 950;
const MOUTH_MS = 105;
const BLINK_CYCLE = 6_200;
const BLINK_MS = 120;
const BLINK_START = BLINK_CYCLE - BLINK_MS;
// An occasional tail wag, offset from the blink so the two never stack up.
const WAG_CYCLE = 11_300;
const WAG_BEAT = 150;
const WAG_FRAMES = [1, 2, 1, 2, 0] as const;
const WAG_START = WAG_CYCLE - WAG_FRAMES.length * WAG_BEAT;

type Guide = {
  dock: HTMLDivElement;
  button: HTMLButtonElement;
  sprite: HTMLCanvasElement;
  note: HTMLParagraphElement;
  noteMeasure: HTMLSpanElement;
  noteText: HTMLSpanElement;
};
type Dialogue = { chapter: Chapter; line: string; elapsed: number; lastTick: number | null };
type NoteAnchor = { x: number; y: number; width: number; height: number };

const tokensByLine = new Map<string, string[]>();

function tokensFor(line: string, lang: "en" | "zh") {
  const cached = tokensByLine.get(line);
  if (cached) return cached;
  const tokens = lang === "zh" ? Array.from(line) : line.match(/\S+\s*/g) ?? [];
  tokensByLine.set(line, tokens);
  return tokens;
}

function writeStyle(element: HTMLElement, property: "transform" | "opacity" | "backgroundColor", value: string) {
  if (element.style[property] !== value) element.style[property] = value;
}

function writeVariable(element: HTMLElement, name: string, value: string) {
  if (element.style.getPropertyValue(name) !== value) element.style.setProperty(name, value);
}

export function mountCindy({ dock, button, sprite, note, noteMeasure, noteText }: Guide) {
  const story = dock.closest<HTMLElement>(".home-story");
  if (!story) return;
  const home = story;
  const reader = home.querySelector<HTMLElement>(".story-content");
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
  const spoken = new Set<Chapter>();
  let dialogue: Dialogue | undefined;
  let noteAnchor: NoteAnchor | undefined;
  let fadeUntil = 0;
  let spriteKey = "";
  let paletteKey = "";
  let previousScroll = scrollPosition();
  let scrollDirection = 1;
  let lastScroll = -Infinity;
  let fastUntil = -Infinity;
  let pendingSettle = false;
  let settleBlinkUntil = 0;
  let lastActivity = performance.now();
  let attentionUntil = 0;
  let pointer: PixelOffset | null = null;
  let hovered = false;
  let visible = false;
  let drawnChapter: Chapter | undefined;
  let noteFits = true;
  let measuredLine = "";
  let noteBlockSize = 0;
  let arrivals = 0;
  const burst: { time: number; distance: number }[] = [];
  const root = document.documentElement;
  const introAt = root.dataset.intro === "play" ? Number(root.dataset.introAt) || 0 : -1;
  const introUntil = introAt >= 0 && !reduced.matches ? introAt + INTRO_NOTE_MS : 0;
  let introTimer = 0;
  if (introAt >= 0) {
    // Drop the opening hook once it has played so a client-side return never replays it.
    introTimer = window.setTimeout(() => { delete root.dataset.intro; delete root.dataset.introAt; },
      Math.max(0, introAt + 1_400 - performance.now()));
  }

  function scrollPosition() {
    return route.reader?.scrollTop ?? window.scrollY;
  }

  function readTimeline() {
    const rect = timeline?.parentElement?.getBoundingClientRect();
    const nodes = Array.from(home.querySelectorAll<HTMLElement>("[data-cindy-node]"), element => ({
      element, y: element.getBoundingClientRect().top + scrollPosition(),
    }));
    return rect ? { top: rect.top + scrollPosition(), height: rect.height, nodes } : null;
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
      const progress = previous?.progress ?? (top < route.contentBottom ? 1 : 0);
      const offset = !reduced.matches && previous ? (1 - progress) * 10 : 0;
      introductions.set(element, { top: top + scrollPosition() - offset, progress });
      if (!previous) {
        writeVariable(element, "--cindy-intro", String(progress));
        element.setAttribute("data-cindy-intro", "");
      }
    }
  }

  function introduceContent(y: number, scroll: number) {
    const height = route.contentBottom - route.contentTop;
    const line = scroll + clamp(y + 150, route.contentTop + height * .63, route.contentTop + height * .89);
    for (const [element, intro] of introductions) {
      if (intro.progress >= 1) continue;
      const progress = reduced.matches ? 1 : ease(clamp((line - intro.top + 29) / 112));
      if (progress <= intro.progress) continue;
      intro.progress = progress;
      writeVariable(element, "--cindy-intro", progress.toFixed(3));
    }
  }

  function backdrop(scroll: number) {
    const palette = sampleBackdrop(route, scroll, reduced.matches);
    if (!palette) return;
    const { from, to, blend: amount } = palette;
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
    const passed = scroll + route.contentTop + (route.contentBottom - route.contentTop) * .60;
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

  function hideNote() {
    noteAnchor = undefined;
    fadeUntil = 0;
    dock.removeAttribute("data-speaking");
    dock.removeAttribute("data-note-leaving");
    note.setAttribute("aria-hidden", "true");
  }

  function noteOverlapsCopy(anchor: NoteAnchor, scroll: number) {
    if (route.reader) return false;
    // Allow room for the note's tip and the copy's reveal offset and focus outlines.
    return route.stations.some(station =>
      anchor.x < station.contentRight + 6 && anchor.x + anchor.width > station.contentLeft - 6 &&
      anchor.y - 8 < station.contentBottom - scroll + 20 && anchor.y + anchor.height > station.contentTop - scroll - 6);
  }

  function render(time: number) {
    frame = 0;
    window.clearTimeout(timer);
    const layoutChanged = resize;
    if (layoutChanged) {
      route = measureRoute(home);
      if (route.reader) route.reader.tabIndex = 0;
      else reader?.removeAttribute("tabindex");
      track = readTimeline();
      readIntroductions();
      resize = false;
    }
    const scroll = scrollPosition();
    lightTimeline(scroll);

    const sample = sampleGuide(route, scroll, reduced.matches);
    if (!sample || document.hidden) {
      showActor(false);
      if (dialogue) dialogue.lastTick = null;
      hideNote();
      dock.removeAttribute("data-typing");
      dock.removeAttribute("data-scroll-dim");
      dock.setAttribute("data-travel", "");
      writeStyle(dock, "opacity", "0");
      return;
    }

    backdrop(scroll);
    introduceContent(sample.y, scroll);
    const { station, travel, pixels, squash } = sample;
    const firstFrameHere = drawnChapter !== station.chapter;
    const scene = CINDY_SCENES[station.chapter];
    const isReduced = reduced.matches;
    const { caption, hint } = station;
    const { compact } = station;
    const traveling = travel > TRAVEL_START;
    const parked = !traveling;
    const scrolling = time < lastScroll + SCROLL_SETTLE_MS;
    const suppressed = time < fastUntil;
    if (!scrolling && pendingSettle && parked) {
      pendingSettle = false;
      if (!isReduced) settleBlinkUntil = time + BLINK_MS;
    }
    const settleBlink = !isReduced && parked && !scrolling && time < settleBlinkUntil;
    const captionVisible = sample.y + caption.y + caption.height / 2 <= route.height;
    const asleep = time - lastActivity >= IDLE_MS && parked;
    const preview = !isReduced && time < attentionUntil && station.chapter === "projects" && parked;
    const step = preview ? Math.floor(time / 180) % 3 : 0;
    const walkingStep = Math.floor(sample.walkCycle) % 3;
    const pose = asleep ? "rest" : scene.pose;
    const expression = scrolling ? "neutral" : asleep ? "sleep" : hovered && parked ? "happy" : scene.expression;
    const facing = station.facing;
    const walkFacing = (sample.direction || 1) * scrollDirection;
    const x = Number(sample.x.toFixed(2));
    const y = Number(sample.y.toFixed(2));
    const poseMix = isReduced ? 0 : Math.round(ease(clamp((travel - TRAVEL_START) * 1.9)) * 40) / 40;
    const noteWidth = caption.width - 4;
    const noteHeight = caption.height - 8;
    const noteY = route.reader ? station.y + caption.y - y : station.pixels * 22 + 14;
    const lang = document.documentElement.lang.startsWith("zh") ? "zh" : "en";
    const line = scene.line[lang];
    const captionReady = parked && captionVisible && noteWidth >= 82;
    const chapterChanged = dialogue !== undefined && dialogue.chapter !== station.chapter;
    let hiddenThisFrame = false;
    if (noteAnchor) {
      // A jump to another chapter leaves the same way as a walk: the old line fades in its own lane.
      const leaving = traveling || chapterChanged || dialogue?.line !== line;
      // On desktop a fading line may never sit on the copy that has moved under it (sides alternate
      // between chapters), so that case still clears at once; elsewhere the old line fades.
      if ((parked && !captionReady) || ((traveling || leaving || fadeUntil) && noteOverlapsCopy(noteAnchor, scroll))
        || (fadeUntil && (isReduced || time >= fadeUntil))
        || (isReduced && leaving)) {
        hideNote();
        hiddenThisFrame = true;
        if (captionReady) schedule();
      } else if (leaving && !fadeUntil) {
        fadeUntil = time + NOTE_FADE_MS;
        dock.setAttribute("data-note-leaving", "");
        dock.removeAttribute("data-speaking");
        note.setAttribute("aria-hidden", "true");
      }
    }
    // A fading line keeps its dialogue until the fade really ends, so a second jump mid-fade
    // only keeps fading the same bubble instead of stacking a new one on top.
    if (!noteAnchor && (chapterChanged || dialogue?.line !== line)) dialogue = undefined;
    const gaze = isReduced || asleep ? { x: 0, y: 0 } : preview ? { x: 2, y: -1 } : {
      x: pointer ? Math.round(clamp((pointer.x - x) / 85, -1, 1)) * facing : 0,
      y: pointer ? Math.round(clamp((pointer.y - y) / 85, -1, 1)) : 0,
    };

    showActor(true);
    writeStyle(dock, "transform", `translate3d(${x}px, ${y}px, 0)`);
    writeStyle(dock, "opacity", "1");
    writeVariable(dock, "--cindy-pixels", pixels.toFixed(4));
    writeVariable(dock, "--cindy-squash", squash.toFixed(4));
    if (fadeUntil && noteAnchor) {
      // Keep the old note in its own lane while the actor starts to move.
      writeVariable(dock, "--cindy-note-x", `${noteAnchor.x - x}px`);
      writeVariable(dock, "--cindy-note-y", `${noteAnchor.y - y}px`);
    } else if (parked) {
      const noteX = caption.x - noteWidth / 2 - x;
      writeVariable(dock, "--cindy-note-x", `${noteX}px`);
      writeVariable(dock, "--cindy-note-y", `${noteY}px`);
      writeVariable(dock, "--cindy-note-tip", `${-noteX}px`);
      writeVariable(dock, "--cindy-note-width", `${Math.max(0, noteWidth).toFixed(2)}px`);
      writeVariable(dock, "--cindy-note-height", `${noteHeight}px`);
      writeVariable(dock, "--cindy-hint-width", `${hint.width - 4}px`);
    }
    dock.setAttribute("data-scene", station.chapter);
    dock.toggleAttribute("data-parked", parked);
    dock.toggleAttribute("data-travel", traveling);
    // The single-column layout has no crossing, so a small hop marks each new chapter instead.
    // Alternating names restarts the CSS animation without touching the dock's opacity.
    if (route.reader && firstFrameHere && drawnChapter && !isReduced) dock.dataset.arrive = ++arrivals % 2 ? "a" : "b";

    const noteReady = captionReady && !fadeUntil && !hiddenThisFrame;
    if (noteReady) {
      const key = `${line}:${noteWidth}:${noteHeight}`;
      if (noteMeasure.textContent !== line) noteMeasure.textContent = line;
      if (measuredLine !== key || layoutChanged) {
        noteFits = note.scrollHeight <= note.clientHeight + 1;
        noteBlockSize = note.offsetHeight;
        measuredLine = key;
      }
    }
    const enterAt = Math.max(lastScroll + ENTER_IDLE_MS, introUntil);
    const speaking = noteReady && noteFits && (Boolean(noteAnchor) || (!suppressed && time >= enterAt));
    if (speaking) dialogue ??= { chapter: station.chapter, line, elapsed: 0, lastTick: null };
    else if (noteAnchor && !fadeUntil) hideNote();

    const tokens = tokensFor(line, lang);
    // The settle blink is only in her eyes, so the empty bubble's typing cue keeps counting through it.
    const waiting = Boolean(dialogue) && !isReduced && !spoken.has(station.chapter) && (dialogue?.elapsed ?? 0) < FIRST_TOKEN_MS;
    const paused = scrolling || suppressed || (settleBlink && !waiting);
    let shown = 0;
    let elapsed = 0;
    if (dialogue) {
      // Only count time spent typing on screen, so the first frame after a pause never catches up.
      if (speaking && !paused && dialogue.lastTick !== null) dialogue.elapsed += time - dialogue.lastTick;
      elapsed = dialogue.elapsed;
      if (isReduced || spoken.has(station.chapter)) shown = tokens.length;
      else if (elapsed >= FIRST_TOKEN_MS) shown = Math.min(1 + Math.floor((elapsed - FIRST_TOKEN_MS) / TYPE_MS), tokens.length);
      dialogue.lastTick = speaking && !paused && shown < tokens.length ? time : null;
    }
    const typing = speaking && shown < tokens.length && !paused;
    // Before the first word the bubble is open but empty; the cue dots stand in and her mouth stays shut.
    const pending = speaking && shown === 0;
    const talking = typing && shown > 0;
    if (speaking) {
      noteAnchor = { x: caption.x - noteWidth / 2, y: y + noteY, width: noteWidth, height: noteBlockSize };
      const text = shown < tokens.length ? tokens.slice(0, shown).join("") : line;
      if (noteText.textContent !== text) noteText.textContent = text;
      if (shown === tokens.length) spoken.add(station.chapter);
    }
    const mouthBeat = Math.floor(Math.max(0, elapsed - FIRST_TOKEN_MS) / MOUTH_MS);
    const mouth = talking && mouthBeat % 2 === 0;
    const blinkPhase = time % BLINK_CYCLE;
    const canBlink = !isReduced && parked && !asleep && !scrolling && !settleBlink && !talking;
    const blink = settleBlink || (canBlink && blinkPhase >= BLINK_START);
    const wagPhase = (time + 2_900) % WAG_CYCLE;
    const canWag = canBlink && !compact && !preview;
    const tail = canWag && wagPhase >= WAG_START ? WAG_FRAMES[Math.floor((wagPhase - WAG_START) / WAG_BEAT)] ?? 0 : 0;
    dock.toggleAttribute("data-speaking", speaking);
    dock.toggleAttribute("data-scroll-dim", speaking && suppressed);
    dock.toggleAttribute("data-typing", talking && !isReduced);
    dock.toggleAttribute("data-note-pending", pending && !isReduced);
    dock.toggleAttribute("data-idle", canBlink && !preview);
    note.setAttribute("aria-hidden", String(!speaking));
    if (parked) {
      const hintY = route.reader ? station.y + hint.y - y
        : captionReady && noteFits && noteBlockSize ? noteY + noteBlockSize + hint.height / 2 + 8 : noteY - 3;
      writeVariable(dock, "--cindy-hint-y", `${hintY}px`);
      dock.toggleAttribute("data-hint", sample.y + hintY + hint.height / 2 <= route.height);
    } else {
      dock.removeAttribute("data-hint");
    }
    drawnChapter = station.chapter;

    const walkGaze = { x: 1, y: 0 };
    const nextKey = poseMix === 1 ? `walk:${walkingStep}:${walkFacing}`
      : [pose, expression, gaze.x, gaze.y, step, compact, facing, blink, mouth, tail, poseMix, poseMix ? walkingStep : 0].join(":");
    if (context && nextKey !== spriteKey) {
      const [resting, walking] = layers;
      const paintStation = (target: CanvasRenderingContext2D) => {
        target.setTransform(facing, 0, 0, 1, facing < 0 ? CINDY_BITMAP : 0, 0);
        paintCindy(target, pose, expression, gaze, step, compact, { blink, mouth, tail });
        target.resetTransform();
      };
      // While the walk frame is still blending with the station pose, both share the
      // station's facing; she turns toward the direction of travel once fully walking.
      const paintWalk = (target: CanvasRenderingContext2D, turn: number) => {
        target.setTransform(turn, 0, 0, 1, turn < 0 ? CINDY_BITMAP : 0, 0);
        paintCindy(target, "walk", "neutral", walkGaze, walkingStep, true);
        target.resetTransform();
      };
      if (poseMix === 1) paintWalk(context, walkFacing);
      else if (poseMix > 0 && resting && walking) {
        paintStation(resting);
        paintWalk(walking, facing);
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
    const nextToken = typing ? time + FIRST_TOKEN_MS + shown * TYPE_MS - elapsed : Infinity;
    const nextMouth = talking ? time + FIRST_TOKEN_MS + (mouthBeat + 1) * MOUTH_MS - elapsed : Infinity;
    const nextBlink = canBlink ? time + (blink ? BLINK_CYCLE : BLINK_START) - blinkPhase : Infinity;
    const nextWag = !canWag ? Infinity : wagPhase >= WAG_START
      ? time + WAG_BEAT - (wagPhase - WAG_START) % WAG_BEAT
      : time + WAG_START - wagPhase;
    const gesture = preview ? (Math.floor(time / 180) + 1) * 180 : Infinity;
    const idle = parked && !asleep ? lastActivity + IDLE_MS : Infinity;
    const attention = preview ? attentionUntil : Infinity;
    const settle = scrolling ? lastScroll + SCROLL_SETTLE_MS : settleBlink ? settleBlinkUntil : Infinity;
    const resumeCaption = suppressed ? fastUntil : Infinity;
    const enter = noteReady && noteFits && !noteAnchor && time < enterAt ? enterAt : Infinity;
    const fade = fadeUntil || Infinity;
    const next = Math.min(nextToken, nextMouth, nextBlink, nextWag, gesture, idle, attention, settle, resumeCaption, enter, fade);
    if (Number.isFinite(next)) timer = window.setTimeout(schedule, Math.max(1, next - time));
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  function scroll() {
    const position = scrollPosition();
    const delta = position - previousScroll;
    if (delta) {
      const now = performance.now();
      // A single wheel notch still counts as scrolling (mouth shut, typing paused) but never dims
      // the bubble. Only two or more events inside a short window that cover a long distance or
      // move quickly count as fast; a trackpad swipe sends a stream of events and qualifies.
      burst.push({ time: now, distance: Math.abs(delta) });
      while (burst.length && burst[0].time < now - BURST_WINDOW_MS) burst.shift();
      const distance = burst.reduce((sum, event) => sum + event.distance, 0);
      const span = now - burst[0].time;
      const fast = burst.length >= 2
        && (distance >= BURST_DISTANCE || (span >= BURST_MIN_SPAN_MS && distance / span > BURST_SPEED));
      // Keep a fast burst suppressed through its last few, slower wheel or touch events.
      if (now < fastUntil || fast) fastUntil = now + SCROLL_SETTLE_MS;
      previousScroll = position;
      scrollDirection = Math.sign(delta);
      lastActivity = lastScroll = now;
      pendingSettle = true;
      settleBlinkUntil = 0;
      if (dialogue) dialogue.lastTick = null;
    }
    schedule();
  }

  window.addEventListener("scroll", scroll, { passive: true, signal });
  reader?.addEventListener("scroll", scroll, { passive: true, signal });
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
  for (const item of home.querySelectorAll("main > section, .story-nav, .story-content, .cindy-mobile-stage, .cindy-station__layout")) sizes.observe(item);
  const language = new MutationObserver(invalidate);
  language.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  schedule();
  return () => {
    events.abort();
    sizes.disconnect();
    language.disconnect();
    home.removeAttribute("data-cindy-present");
    reader?.removeAttribute("tabindex");
    for (const element of introductions.keys()) {
      element.removeAttribute("data-cindy-intro");
      element.style.removeProperty("--cindy-intro");
    }
    window.clearTimeout(timer);
    window.clearTimeout(introTimer);
    if (introAt >= 0) { delete root.dataset.intro; delete root.dataset.introAt; }
    cancelAnimationFrame(frame);
  };
}
