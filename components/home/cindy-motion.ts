import { CHAPTERS, CINDY_REPLIES, CINDY_SCENES, type Chapter, type CindyReaction } from "./cindy-scenes";
import { paintCindy, type PixelOffset } from "./cindy-sprite";

const IDLE_MS = 20_000;
const CLICK_WINDOW_MS = 1_300;
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const mix = (from: number, to: number, t: number) => from + (to - from) * t;
const ease = (t: number) => t * t * (3 - 2 * t);
const between = (from: PixelOffset, to: PixelOffset, t: number) => ({
  x: mix(from.x, to.x, t),
  y: mix(from.y, to.y, t),
});

type Drag = {
  id: number;
  origin: PixelOffset;
  offset: PixelOffset;
  position: PixelOffset;
  velocity: PixelOffset;
  time: number;
  moved: boolean;
};

type Guide = {
  rail: HTMLElement;
  dock: HTMLDivElement;
  actor: HTMLDivElement;
  button: HTMLButtonElement;
  sprite: HTMLCanvasElement;
  motion: HTMLSpanElement;
  onChapter: (chapter: Chapter) => void;
  onReaction: (reaction: CindyReaction) => void;
  openChat: (trigger: HTMLButtonElement) => void;
};

function translate(node: HTMLElement, { x, y }: PixelOffset) {
  const transform = `translate3d(${Math.round(x * 10) / 10}px, ${Math.round(y * 10) / 10}px, 0)`;
  if (node.style.transform !== transform) node.style.transform = transform;
}

export function mountCindy({ rail, dock, actor, button, sprite, motion, onChapter, onReaction, openChat }: Guide) {
  const home = rail.closest(".home-story");
  if (!home) return;

  const chapters = CHAPTERS.map(id => home.querySelector<HTMLElement>(`#${id}`));
  const timeline = home.querySelector<HTMLElement>("[data-timeline-fill]");
  const context = sprite.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktop = window.matchMedia("(min-width: 64rem) and (min-height: 32rem)");
  const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
  const events = new AbortController();
  const { signal } = events;

  let bounds = rail.getBoundingClientRect();
  let starts: number[] = [];
  let railTravel = 0;
  let actorAnchor = { x: 0, y: 0 };
  let half = 0;
  let timelineStart = 0;
  let timelineEnd = 0;
  let resize = true;
  let chapter: Chapter = "hero";
  let reaction: CindyReaction = null;
  let spriteKey = "";
  let pointer: PixelOffset | null = null;
  let hovered = false;
  let idleAt = performance.now();
  let idleTimer = 0;
  let resetTimer = 0;
  let clickTimes: number[] = [];
  let lastReply = -1;
  let drag: Drag | null = null;
  let flight: { from: PixelOffset; to: PixelOffset; start: number } | null = null;
  let drawnAt = { x: 0, y: 0 };
  let suppressClickUntil = 0;
  let animation: Animation | undefined;
  let frame = 0;

  function measure() {
    resize = false;
    bounds = rail.getBoundingClientRect();
    railTravel = Math.max(0, bounds.height - dock.offsetHeight - 32);
    half = actor.offsetWidth / 2;
    actorAnchor = {
      x: bounds.left + dock.offsetLeft + actor.offsetLeft + half,
      y: bounds.top + dock.offsetTop + actor.offsetTop + half,
    };
    const viewport = document.documentElement;
    const cue = desktop.matches ? viewport.clientHeight * .46 : bounds.bottom + viewport.clientHeight * .16;
    const bottom = Math.max(1, viewport.scrollHeight - viewport.clientHeight);
    starts = chapters.map((section, index) => {
      if (!index) return 0;
      const top = section ? section.getBoundingClientRect().top + window.scrollY : bottom;
      return clamp(top - cue, 0, bottom);
    });
    if (timeline?.parentElement) {
      const track = timeline.parentElement.getBoundingClientRect();
      timelineStart = track.top + window.scrollY - viewport.clientHeight * .72;
      timelineEnd = track.bottom + window.scrollY - viewport.clientHeight * .56;
    }
  }

  function invalidate() {
    resize = true;
    schedule();
  }

  function inRail(position: PixelOffset) {
    return {
      x: clamp(position.x, bounds.left + half, bounds.right - half),
      y: clamp(position.y, bounds.top + half, bounds.bottom - half),
    };
  }

  function routePosition(scroll: number) {
    let index = 0;
    while (index < CHAPTERS.length - 1 && scroll >= starts[index + 1]) index++;
    const current = CHAPTERS[index];
    if (chapter !== current) {
      chapter = current;
      onChapter(current);
    }

    if (!desktop.matches) return { x: 0, y: 0 };
    if (reduce.matches) return { x: 0, y: 16 + railTravel * .43 };
    const next = Math.min(index + 1, CHAPTERS.length - 1);
    const [x, y] = CINDY_SCENES[current].position;
    const [nextX, nextY] = CINDY_SCENES[CHAPTERS[next]].position;
    const interval = Math.max(1, starts[next] - starts[index]);
    const progress = clamp((scroll - starts[index]) / interval);
    const phase = ease(clamp((progress - .69) / .31));
    return { x: mix(x, nextX, phase), y: 16 + railTravel * mix(y, nextY, phase) };
  }

  function throwPosition(time: number, rest: PixelOffset) {
    if (drag) return drag.position;
    if (!flight) return rest;
    const elapsed = Math.max(0, time - flight.start);
    if (elapsed < 240) return between(flight.from, flight.to, 1 - (1 - elapsed / 240) ** 3);
    if (elapsed < 940) return between(flight.to, rest, ease((elapsed - 240) / 700));
    flight = null;
    return rest;
  }

  function render(time: number) {
    frame = 0;
    if (resize) measure();
    const scroll = window.scrollY;
    const position = routePosition(scroll);
    const rest = { x: actorAnchor.x + position.x, y: actorAnchor.y + position.y };
    drawnAt = throwPosition(time, rest);
    translate(dock, position);
    translate(actor, { x: drawnAt.x - rest.x, y: drawnAt.y - rest.y });
    if (timeline && timelineEnd > timelineStart) {
      const progress = clamp((scroll - timelineStart) / (timelineEnd - timelineStart));
      const transform = reduce.matches ? "none" : `scaleY(${progress.toFixed(3)})`;
      if (timeline.style.transform !== transform) timeline.style.transform = transform;
    }

    const scene = CINDY_SCENES[chapter];
    const gaze = pointer && !reduce.matches && reaction !== "sleep" && !drag?.moved ? {
      x: Math.round(clamp((pointer.x - drawnAt.x) / 92, -1, 1)),
      y: Math.round(clamp((pointer.y - drawnAt.y) / 92, -1, 1)),
    } : { x: 0, y: 0 };
    const tilt = gaze.x === 0 ? "" : `translateX(${gaze.x}px) rotate(${gaze.x * 3}deg)`;
    if (sprite.style.transform !== tilt) sprite.style.transform = tilt;
    let expression = hovered ? "happy" : scene.expression;
    if (typeof reaction === "number") expression = "happy";
    if (reaction === "egg") expression = "wink";
    if (drag?.moved) expression = "surprise";
    if (reaction === "sleep") expression = "sleep";
    const pose = reduce.matches || reaction === "sleep" ? "rest" : scene.pose;
    const alternate = reaction === "egg" && !reduce.matches;
    const nextKey = [pose, expression, gaze.x, gaze.y, alternate].join(":");
    if (context && spriteKey !== nextKey) {
      paintCindy(context, pose, expression, gaze, alternate);
      spriteKey = nextKey;
      button.dataset.sprite = "ready";
    }
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
    if (remaining > 0) {
      idleTimer = window.setTimeout(checkIdle, remaining);
      return;
    }
    setReaction("sleep");
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
    if (!drag.moved && Math.hypot(event.clientX - drag.origin.x, event.clientY - drag.origin.y) < 7) return;

    drag.moved = true;
    button.dataset.dragging = "";
    const now = performance.now();
    const position = inRail({ x: event.clientX + drag.offset.x, y: event.clientY + drag.offset.y });
    const dt = Math.max(10, now - drag.time);
    drag.velocity = { x: (position.x - drag.position.x) / dt, y: (position.y - drag.position.y) / dt };
    drag.position = position;
    drag.time = now;
  }

  function pointerDown(event: PointerEvent) {
    if (reduce.matches || !event.isPrimary || event.button !== 0) return;
    activity();
    pointer = event.pointerType === "mouse" ? pointer : null;
    animation?.cancel();
    const origin = { x: event.clientX, y: event.clientY };
    drag = {
      id: event.pointerId, origin, position: drawnAt, time: performance.now(), moved: false,
      offset: { x: drawnAt.x - origin.x, y: drawnAt.y - origin.y },
      velocity: { x: 0, y: 0 },
    };
    flight = null;
    button.setPointerCapture(event.pointerId);
  }

  function pointerEnd(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.id) return;
    if (drag.moved) {
      const now = performance.now();
      const boost = event.type === "pointerup" && now - drag.time < 130 ? 82 : 0;
      const from = drag.position;
      const to = inRail({
        x: from.x + clamp(drag.velocity.x * boost, -102, 102),
        y: from.y + clamp(drag.velocity.y * boost, -120, 120),
      });
      flight = { from, to, start: now };
      suppressClickUntil = now + 300;
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
        egg
          ? [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }]
          : [{ transform: "translateY(0)" }, { transform: "translateY(-9px)", offset: .38 }, { transform: "translateY(0)" }],
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
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) activity();
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
  desktop.addEventListener("change", preference, { signal });

  const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(invalidate);
  for (const element of [rail, dock, ...chapters]) {
    if (element) observer?.observe(element);
  }
  activity();
  schedule();

  return () => {
    events.abort();
    observer?.disconnect();
    animation?.cancel();
    cancelAnimationFrame(frame);
    window.clearTimeout(idleTimer);
    window.clearTimeout(resetTimer);
  };
}
