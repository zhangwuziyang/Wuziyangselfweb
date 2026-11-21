import { CINDY_REPLIES, CINDY_SCENES, type Chapter, type CindyReaction, type Side } from "./cindy-scenes";
import {
  actorBox, between, clamp, clears, ease, finale, measureRoute, placeCindyNote, positionCindy, rgb,
  sampleRoute, spriteRadius, visibleContent, wingCenter, type Box,
} from "./cindy-route";
import { cindySpriteBounds, paintCindy, type PixelOffset } from "./cindy-sprite";

const IDLE_MS = 20_000;
const CLICK_WINDOW_MS = 1_300;
const STORY_WIDE = "(min-width: 70rem) and (min-height: 34rem)";

type Drag = {
  id: number; side: Side; origin: PixelOffset; offset: PixelOffset;
  position: PixelOffset; velocity: PixelOffset; time: number; moved: boolean;
};

type Guide = {
  overlay: HTMLElement;
  dock: HTMLDivElement;
  button: HTMLButtonElement;
  sprite: HTMLCanvasElement;
  motion: HTMLSpanElement;
  note: HTMLDivElement;
  onChapter: (chapter: Chapter) => void;
  onReaction: (reaction: CindyReaction) => void;
  openChat: (trigger: HTMLButtonElement) => void;
};

function writeStyle(element: HTMLElement, property: "transform" | "opacity" | "backgroundColor", value: string) {
  if (element.style[property] !== value) element.style[property] = value;
}

function writeVariable(element: HTMLElement, name: string, value: string) {
  if (element.style.getPropertyValue(name) !== value) element.style.setProperty(name, value);
}

export function mountCindy({ overlay, dock, button, sprite, motion, note, onChapter, onReaction, openChat }: Guide) {
  const story = overlay.closest<HTMLElement>(".home-story");
  if (!story) return;
  const home = story;
  const base = home.querySelector<HTMLElement>("[data-story-base]");
  const blend = home.querySelector<HTMLElement>("[data-story-blend]");
  const timeline = home.querySelector<HTMLElement>("[data-timeline-fill]");
  const context = sprite.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const wide = window.matchMedia(STORY_WIDE);
  const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
  const events = new AbortController();
  const { signal } = events;

  let route = measureRoute(home, wide.matches);
  let timelineTrack = readTimeline();
  let resize = false;
  let frame = 0;
  let chapter: Chapter = "hero";
  let reaction: CindyReaction = null;
  let spriteKey = "";
  let paletteKey = "";
  let previousScroll = window.scrollY;
  let direction = 1;
  let pointer: PixelOffset | null = null;
  let hovered = false;
  let idleAt = performance.now();
  let idleTimer = 0;
  let resetTimer = 0;
  let attentionTimer = 0;
  let attention = false;
  let clickTimes: number[] = [];
  let lastReply = -1;
  let suppressClickUntil = 0;
  let drag: Drag | null = null;
  let flight: { from: PixelOffset; to: PixelOffset; side: Side; start: number } | null = null;
  let drawnAt = { x: 0, y: 0 };
  let animation: Animation | undefined;
  const notes = Array.from(note.querySelectorAll<HTMLElement>(".cindy-note-sample"), element => ({
    element, width: 0, height: 0,
  }));
  const [wideNote, compactNote, edgeNote] = notes;
  const dockedNote = notes.find(({ element }) => element.classList.contains("cindy-note--docked"));
  type NoteContext = {
    actor: PixelOffset; bounds: Box; content: Box[]; options: Parameters<typeof placeCindyNote>[5];
    landing: number; docked: boolean;
  };
  let noteContext: NoteContext | undefined;
  let visibleNote: HTMLElement | undefined;

  function readTimeline() {
    const rect = timeline?.parentElement?.getBoundingClientRect();
    return rect ? { top: rect.top + window.scrollY, height: rect.height } : null;
  }

  function invalidate() {
    resize = true;
    schedule();
  }

  function poseStyle(point: PixelOffset, jump: number, size: number) {
    writeStyle(dock, "transform", `translate3d(${Math.round(point.x)}px, ${Math.round(point.y)}px, 0)`);
    writeVariable(dock, "--cindy-lift", `${Math.round(jump)}px`);
    writeVariable(dock, "--cindy-scale", size.toFixed(3));
  }

  function positionNote() {
    let next: HTMLElement | undefined;
    if (noteContext) {
      const { actor, bounds, content, options, docked, landing } = noteContext;
      const candidates = docked ? [dockedNote]
        : landing > .38 ? [compactNote, wideNote, edgeNote] : [wideNote, compactNote, edgeNote];
      for (const candidate of candidates) {
        if (!candidate) continue;
        const placement = placeCindyNote(route, content, actor, bounds, candidate, options);
        if (!placement) continue;
        next = candidate.element;
        const x = placement.x - Math.round(drawnAt.x);
        const y = placement.y - Math.round(drawnAt.y);
        writeStyle(next, "transform", `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`);
        if (next.dataset.tail !== placement.tail) next.dataset.tail = placement.tail;
        writeVariable(next, "--cindy-tail", `${placement.tailOffset.toFixed(2)}px`);
        break;
      }
    }
    if (visibleNote !== next) {
      if (visibleNote) {
        delete visibleNote.dataset.tail;
        visibleNote.classList.remove("cindy-note");
      }
      next?.classList.add("cindy-note");
    }
    visibleNote = next;
  }

  function measureNote() {
    for (const candidate of notes) {
      const { width, height } = candidate.element.getBoundingClientRect();
      candidate.width = width;
      candidate.height = height;
    }
    positionNote();
  }

  function inWing(position: PixelOffset, side: Side) {
    const inset = Math.max(0, (side === "left" ? route.left : route.width - route.right) / 2 - spriteRadius(route) - 4);
    const x = wingCenter(route, side);
    const radius = spriteRadius(route);
    return {
      x: clamp(position.x, x - inset, x + inset),
      y: clamp(position.y, route.nav + radius + 4, route.height - radius - 5),
    };
  }

  function aimAtHome(time: number, sample: ReturnType<typeof sampleRoute>) {
    if (drag?.moved) return { point: drag.position, opacity: 1 };
    if (drag) return { point: drag.origin, opacity: 1 };
    if (!flight) return { point: sample.point, opacity: sample.opacity };
    const elapsed = Math.max(0, time - flight.start);
    if (elapsed < 245) return { point: between(flight.from, flight.to, 1 - (1 - elapsed / 245) ** 3), opacity: 1 };
    if (elapsed >= 945) {
      flight = null;
      return { point: sample.point, opacity: sample.opacity };
    }
    const progress = (elapsed - 245) / 700;
    if (flight.side === sample.side && !sample.crossed && !sample.perched) {
      return { point: between(flight.to, sample.point, ease(progress)), opacity: 1 };
    }
    return progress < .5 ? { point: flight.to, opacity: 1 - progress * 2 }
      : { point: sample.point, opacity: (progress - .5) * 2 };
  }

  function backdrop({ from, to, mix }: ReturnType<typeof sampleRoute>["palette"]) {
    const a = CINDY_SCENES[from], b = CINDY_SCENES[to];
    const colors = `${from}:${to}`;
    if (paletteKey !== colors) {
      if (base) base.style.backgroundColor = rgb(a.color);
      if (blend) blend.style.backgroundColor = rgb(b.color);
      paletteKey = colors;
    }
    if (blend) writeStyle(blend, "opacity", mix.toFixed(4));
  }

  function lightTimeline(scroll: number) {
    if (!timeline || !timelineTrack?.height) return;
    const passed = scroll + route.height * .60;
    const { top, height } = timelineTrack;
    const scale = reduce.matches ? 1 : clamp((passed - top) / height);
    writeStyle(timeline, "transform", `scaleY(${scale.toFixed(3)})`);
    for (const [index, target] of route.nodes.entries()) {
      const node = route.stops[2].anchors[index];
      const reached = Boolean(node && passed >= node.y);
      if (target.hasAttribute("data-lit") !== reached) target.toggleAttribute("data-lit", reached);
    }
  }

  function render(time: number) {
    frame = 0;
    if (resize) {
      route = measureRoute(home, wide.matches);
      timelineTrack = readTimeline();
      resize = false;
    }
    const scroll = window.scrollY;
    if (scroll !== previousScroll) direction = Math.sign(scroll - previousScroll);
    previousScroll = scroll;
    const reduced = reduce.matches;
    const sample = sampleRoute(route, scroll, reduced);
    if (chapter !== sample.chapter) {
      chapter = sample.chapter;
      onChapter(chapter);
    }
    backdrop(sample.palette);
    lightTimeline(scroll);

    const current = aimAtHome(time, sample);
    const landing = chapter === "contact" && !drag && !flight ? finale(route, scroll) : 0;
    const docked = !reduced && landing > .97;
    const walking = !reduced && !drag && !flight && landing < .2
      && (sample.path || (chapter === "hero" && scroll < 190));
    const traveling = walking || (chapter === "global" && !reduced && !drag && !flight);
    const step = traveling ? Math.floor(scroll / (route.large ? 23 : 27)) % 3 : 0;
    const bob = traveling ? -Math.abs(Math.sin(scroll / 23)) * (chapter === "global" ? 10 : 5) : 0;
    const arrival = chapter === "hero" && route.large ? .84 + .16 * ease(clamp(scroll / 190)) : 1;
    const size = reduced ? 1 : arrival * (1 - landing * (route.large ? .60 : .33));
    const crossing = sample.crossed && !drag && !flight;
    const perched = sample.perched && !drag && !flight;
    const scene = CINDY_SCENES[chapter];
    const facing = walking ? sample.heading * direction : scene.side === "left" ? 1 : -1;
    const pose = reduced || reaction === "sleep" || landing > .84 ? "rest" : walking ? "walk" : scene.pose;
    const listening = chapter === "music" && !crossing && reaction !== "sleep";
    const art = cindySpriteBounds(pose, reaction === "sleep", step, !route.large, facing);
    const hit = route.large ? 66 : 32;
    const preview = attention && chapter === "projects" && !reduced ? -3 : 0;
    const sway = listening && !reduced ? 2 : 0;
    const breathing = !reduced && !walking && !perched && !docked && reaction !== "sleep";
    const lift = (breathing ? listening ? 3 : 2 : 0) + (animation?.playState === "running" ? 10 : 0);
    const offset = Math.round(bob);
    const extent = {
      left: Math.max(hit, art.left + sway - preview) * size + 1,
      right: Math.max(hit, art.right + sway + preview) * size + 1,
      top: Math.max(hit, art.top + lift) * size - offset + 1,
      bottom: Math.max(hit, art.bottom) * size + offset + 1,
    };
    const content = visibleContent(route, scroll, crossing);
    const anchor = positionCindy(route, content, current.point, extent, crossing || perched);
    drawnAt = anchor ?? current.point;
    poseStyle(drawnAt, bob, size);
    const opacity = anchor ? current.opacity : 0;
    writeStyle(dock, "opacity", opacity.toFixed(3));
    dock.toggleAttribute("data-crossing", crossing);
    dock.toggleAttribute("data-walking", walking);
    dock.toggleAttribute("data-hidden", opacity < .08);
    dock.toggleAttribute("data-obstructed", !anchor);
    dock.toggleAttribute("data-sleeping", reaction === "sleep");
    dock.toggleAttribute("data-perched", perched);
    dock.toggleAttribute("data-landing", chapter === "contact" && !crossing);
    dock.toggleAttribute("data-final", docked);
    const x = Math.round(drawnAt.x), y = Math.round(drawnAt.y);
    const musicBox = { left: x - hit * .84, right: x + hit * .52 + 16, top: y - hit * 1.04 - 19, bottom: y - hit * 1.04 + 24 };
    const showMusic = listening && !reduced && musicBox.top >= route.nav && clears(musicBox, content);
    dock.toggleAttribute("data-music", listening);
    dock.toggleAttribute("data-music-notes", showMusic);
    const orbitRoom = Math.min(x - route.right, route.width - x) - 38;
    const orbitX = Math.min(32, orbitRoom);
    const orbitBox = { left: x - 31 - orbitX, right: x + 31 + orbitX, top: y - 89, bottom: y + 89 };
    const showSkills = route.large && chapter === "skills" && !crossing && !reduced && reaction !== "sleep"
      && orbitRoom >= 0 && orbitBox.top >= route.nav && orbitBox.bottom <= route.height && clears(orbitBox, content);
    dock.toggleAttribute("data-skills", showSkills);
    if (showSkills) {
      writeVariable(dock, "--cindy-orbit", `${(scroll / 8) % 360}deg`);
      writeVariable(dock, "--cindy-orbit-x", `${Math.round(orbitX)}px`);
    }
    const noteBounds = actorBox({ x, y }, extent);
    noteBounds.bottom = Math.max(noteBounds.bottom, y + hit * 1.12 * size);
    // Decorations travel with Cindy, so a stacked bubble starts just outside their envelope.
    if (showSkills) {
      noteBounds.top = Math.min(noteBounds.top, orbitBox.top);
      noteBounds.bottom = Math.max(noteBounds.bottom, orbitBox.bottom);
    }
    if (showMusic) noteBounds.top = Math.min(noteBounds.top, musicBox.top);
    noteContext = anchor ? {
      actor: { x, y: y + offset }, bounds: noteBounds, content,
      options: { heading: sample.heading, landing: chapter === "contact" && !crossing },
      docked, landing,
    } : undefined;
    if (typeof ResizeObserver === "undefined") measureNote();
    else positionNote();

    const gaze = !reduced && reaction !== "sleep" && !drag?.moved
      ? attention && chapter === "projects" ? { x: 2, y: -1 }
        : pointer ? {
          x: Math.round(clamp((pointer.x - drawnAt.x) / 88, -1, 1)) * facing,
          y: Math.round(clamp((pointer.y - drawnAt.y) / 88, -1, 1)),
        } : { x: 0, y: 0 }
      : { x: 0, y: 0 };
    const expression = reaction === "sleep" ? "sleep" : drag?.moved ? "surprise" : reaction === "egg" ? "wink"
      : typeof reaction === "number" || hovered ? "happy" : scene.expression;
    const alternate = reaction === "egg" && !reduced;
    const nextKey = [pose, expression, gaze.x, gaze.y, alternate, step, route.large].join(":");
    if (context && nextKey !== spriteKey) {
      paintCindy(context, pose, expression, gaze, alternate, step, !route.large);
      spriteKey = nextKey;
      button.dataset.sprite = "ready";
    }
    writeStyle(sprite, "transform", `translateX(-50%) translateX(${preview}px) scaleX(${facing})`);
    if (flight) schedule();
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  function setReaction(value: CindyReaction) {
    reaction = value;
    onReaction(value);
    schedule();
  }

  function checkIdle() {
    idleTimer = 0;
    if (document.hidden || drag || document.querySelector("#profile-chat-dialog[open]")) return;
    const remaining = IDLE_MS - (performance.now() - idleAt);
    if (remaining > 0) idleTimer = window.setTimeout(checkIdle, remaining);
    else setReaction("sleep");
  }

  function activity() {
    idleAt = performance.now();
    if (reaction === "sleep") setReaction(null);
    if (!idleTimer) idleTimer = window.setTimeout(checkIdle, IDLE_MS);
  }

  function pointerMove(event: PointerEvent) {
    if (!event.isPrimary) return;
    activity();
    if (event.pointerType === "mouse") pointer = { x: event.clientX, y: event.clientY };
    schedule();
    if (!drag || event.pointerId !== drag.id) return;
    if (!drag.moved && Math.hypot(event.clientX + drag.offset.x - drag.origin.x, event.clientY + drag.offset.y - drag.origin.y) < 7) return;
    drag.moved = true;
    button.dataset.dragging = "";
    const now = performance.now();
    const position = inWing({ x: event.clientX + drag.offset.x, y: event.clientY + drag.offset.y }, drag.side);
    const dt = Math.max(10, now - drag.time);
    drag.velocity = { x: (position.x - drag.position.x) / dt, y: (position.y - drag.position.y) / dt };
    drag.position = position;
    drag.time = now;
  }

  function pointerDown(event: PointerEvent) {
    if (reduce.matches || !event.isPrimary || event.button !== 0) return;
    activity();
    if (event.pointerType !== "mouse") pointer = null;
    const side: Side = drawnAt.x < route.width / 2 ? "left" : "right";
    drag = {
      id: event.pointerId, side, origin: drawnAt, position: inWing(drawnAt, side), time: performance.now(), moved: false,
      offset: { x: drawnAt.x - event.clientX, y: drawnAt.y - event.clientY }, velocity: { x: 0, y: 0 },
    };
    animation?.cancel();
    flight = null;
    button.setPointerCapture(event.pointerId);
  }

  function pointerEnd(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.id) return;
    if (drag.moved) {
      const now = performance.now();
      const boost = event.type === "pointerup" && now - drag.time < 130 ? 75 : 0;
      const from = drag.position;
      const to = inWing({
        x: from.x + clamp(drag.velocity.x * boost, -95, 95),
        y: from.y + clamp(drag.velocity.y * boost, -125, 125),
      }, drag.side);
      flight = { from, to, side: drag.side, start: now };
      suppressClickUntil = now + 280;
    }
    drag = null;
    delete button.dataset.dragging;
    activity();
    schedule();
  }

  function click(event: MouseEvent) {
    const now = performance.now();
    if (event.detail && now < suppressClickUntil) return;
    activity();
    if (chapter === "contact") {
      openChat(button);
      return;
    }
    clickTimes = clickTimes.filter(time => now - time < CLICK_WINDOW_MS);
    clickTimes.push(now);
    const egg = clickTimes.length >= 4;
    if (egg) {
      clickTimes = [];
      setReaction("egg");
    } else {
      lastReply = (lastReply + 1 + Math.floor(Math.random() * (CINDY_REPLIES.length - 1))) % CINDY_REPLIES.length;
      setReaction(lastReply);
    }
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => setReaction(null), egg ? 2_300 : 1_800);
    if (!reduce.matches) {
      animation?.cancel();
      animation = motion.animate(
        egg ? [{ transform: "translateY(0)" }, { transform: "translateY(-9px)", offset: .24 }, { transform: "translateY(0)", offset: .43 }, { transform: "translateY(-5px)", offset: .67 }, { transform: "translateY(0)" }]
          : [{ transform: "translateY(0)" }, { transform: "translateY(-10px)", offset: .38 }, { transform: "translateY(0)" }],
        { duration: egg ? 530 : 310, easing: "cubic-bezier(.2,.65,.4,1)" },
      );
    }
  }

  button.addEventListener("pointerdown", pointerDown, { signal });
  button.addEventListener("pointerup", pointerEnd, { signal });
  button.addEventListener("pointercancel", pointerEnd, { signal });
  button.addEventListener("lostpointercapture", pointerEnd, { signal });
  button.addEventListener("pointerenter", event => {
    if (event.pointerType !== "mouse" || !hover.matches) return;
    hovered = true;
    activity();
    schedule();
  }, { signal });
  button.addEventListener("pointerleave", () => { hovered = false; schedule(); }, { signal });
  button.addEventListener("click", click, { signal });
  window.addEventListener("pointermove", pointerMove, { passive: true, signal });
  document.documentElement.addEventListener("pointerleave", () => {
    pointer = null;
    hovered = false;
    schedule();
  }, { signal });
  window.addEventListener("scroll", () => { activity(); schedule(); }, { passive: true, signal });
  window.addEventListener("resize", invalidate, { signal });
  window.addEventListener("pageshow", invalidate, { signal });
  window.addEventListener("keydown", activity, { signal });
  document.addEventListener("focusin", activity, { signal });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) activity(); }, { signal });
  home.addEventListener("cindy:preview", () => {
    attention = true;
    activity();
    schedule();
    window.clearTimeout(attentionTimer);
    attentionTimer = window.setTimeout(() => { attention = false; schedule(); }, 950);
  }, { signal });
  const preference = () => {
    if (drag && button.hasPointerCapture(drag.id)) button.releasePointerCapture(drag.id);
    drag = null;
    flight = null;
    delete button.dataset.dragging;
    animation?.cancel();
    invalidate();
  };
  reduce.addEventListener("change", preference, { signal });
  wide.addEventListener("change", preference, { signal });

  const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(invalidate);
  const noteObserver = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(measureNote);
  for (const { element } of notes) noteObserver?.observe(element);
  measureNote();
  for (const target of home.querySelectorAll("main > section, [data-cindy-anchor], [data-cindy-perch], footer")) {
    observer?.observe(target);
  }
  const languageObserver = new MutationObserver(invalidate);
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  activity();
  schedule();
  return () => {
    events.abort();
    observer?.disconnect();
    noteObserver?.disconnect();
    languageObserver.disconnect();
    animation?.cancel();
    cancelAnimationFrame(frame);
    for (const timer of [idleTimer, resetTimer, attentionTimer]) window.clearTimeout(timer);
  };
}
