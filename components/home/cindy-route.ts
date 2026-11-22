import { CHAPTERS, CINDY_SCENES, type Chapter, type RGB, type Side } from "./cindy-scenes";
import type { PixelOffset } from "./cindy-sprite";

export const clamp = (n: number, low = 0, high = 1) => Math.max(low, Math.min(high, n));
export const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;
export const ease = (t: number) => t * t * (3 - 2 * t);
export const between = (a: PixelOffset, b: PixelOffset, t: number): PixelOffset => ({
  x: mix(a.x, b.x, t), y: mix(a.y, b.y, t),
});

export type Anchor = { y: number; left: number; right: number; top: number };
type Stop = { chapter: Chapter; top: number; at: number; anchors: Anchor[] };
export type Box = { left: number; top: number; right: number; bottom: number };
export type NoteSize = { width: number; height: number };
type Tail = "left" | "right" | "top" | "bottom";
type NoteSpot = PixelOffset & { tail: Tail; tailOffset: number };
const VIEW_INSET = 6;
const CONTENT_GAP = 6;
const NOTE_GAP = 9;

export type Route = {
  stops: Stop[];
  width: number;
  height: number;
  nav: number;
  left: number;
  right: number;
  maxScroll: number;
  large: boolean;
  perch?: Anchor;
  finish?: Anchor;
  nodes: HTMLElement[];
  content: Box[];
};

function readAnchor(element: Element, scroll: number): Anchor {
  const rect = element.getBoundingClientRect();
  return { y: rect.top + scroll + rect.height * .44, top: rect.top + scroll, left: rect.left, right: rect.right };
}

export function measureRoute(home: HTMLElement, large: boolean): Route {
  const view = document.documentElement;
  const { clientWidth: width, clientHeight: height } = view;
  const maxScroll = Math.max(1, view.scrollHeight - height);
  const scroll = window.scrollY;
  const shell = home.querySelector(".story-shell")?.getBoundingClientRect();
  const nav = home.querySelector(".story-nav")?.getBoundingClientRect().bottom ?? 49;
  const stops = CHAPTERS.map((chapter, index) => {
    const section = home.querySelector(`#${chapter}`);
    const anchor = section ? readAnchor(section, scroll) : { y: scroll, top: maxScroll, left: 0, right: width };
    const anchors = Array.from(section?.querySelectorAll("[data-cindy-anchor]") ?? [], element => readAnchor(element, scroll));
    const last = index === CHAPTERS.length - 1;
    return {
      chapter, top: anchor.top,
      at: index ? clamp(anchor.top - height * .53, 0, last ? Math.max(0, maxScroll - 80) : maxScroll) : 0,
      anchors: anchors.length ? anchors : [anchor],
    };
  });
  const perch = home.querySelector("[data-cindy-perch]");
  const finish = home.querySelector("[data-cindy-finish]");
  const nodes = Array.from(home.querySelectorAll<HTMLElement>("[data-cindy-node]"));
  const content = Array.from(home.querySelectorAll(
    ".story-shell :is(img, .project-browser, .project-phone, .story-project, .story-panel, h1, h2, h3, p, blockquote, a, button, figcaption, [data-cindy-content]), #skills [data-cindy-anchor], [data-cindy-node]",
  ), element => {
    // The city image can enlarge on hover, but its rounded frame clips it.
    const frame = element.closest(".overflow-hidden");
    const { left, top, right, bottom } = (element.matches("img") && frame ? frame : element).getBoundingClientRect();
    return { left, right, top: top + scroll, bottom: bottom + scroll };
  }).filter(box => box.right > box.left && box.bottom > box.top);
  return {
    stops, width, height, nav, left: shell?.left ?? 60, right: shell?.right ?? width - 60, maxScroll, large,
    perch: perch ? readAnchor(perch, scroll) : undefined,
    finish: finish ? readAnchor(finish, scroll) : undefined, nodes, content,
  };
}

export const wingCenter = (route: Route, side: Side) => (side === "left" ? route.left : route.width + route.right) / 2;
export const spriteRadius = (route: Route) => route.large ? 71 : 35;
const clampY = (route: Route, y: number) => clamp(y, route.nav + spriteRadius(route) + 8, route.height - spriteRadius(route) - 8);

const contentGap = (route: Route) => route.large ? CONTENT_GAP : 4;

export function visibleContent(route: Route, scroll: number, crossing: boolean): Box[] {
  const gap = crossing ? 3 : contentGap(route);
  return route.content
    .filter(box => box.bottom + gap > scroll + route.nav && box.top - gap < scroll + route.height)
    .map(box => ({
      left: box.left - gap, right: box.right + gap,
      top: box.top - scroll - gap, bottom: box.bottom - scroll + gap,
    }));
}

export function actorBox({ x, y }: PixelOffset, extent: Box): Box {
  return { left: x - extent.left, right: x + extent.right, top: y - extent.top, bottom: y + extent.bottom };
}

const overlaps = (a: Box, b: Box) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

export function clears(box: Box, content: Box[]) {
  return !content.some(item => overlaps(box, item));
}

export function positionCindy(route: Route, content: Box[], point: PixelOffset, extent: Box, nearContent: boolean) {
  const inset = route.large ? VIEW_INSET : 4;
  const minX = inset + extent.left;
  const maxX = route.width - inset - extent.right;
  const minY = route.nav + VIEW_INSET + extent.top;
  const maxY = route.height - VIEW_INSET - extent.bottom;
  const side = point.x < route.width / 2 ? "left" : "right";
  const wingX = side === "left" ? Math.min(point.x, route.left - contentGap(route) - extent.right)
    : Math.max(point.x, route.right + contentGap(route) + extent.left);
  const x = clamp(nearContent ? point.x : wingX, minX, maxX);
  const y = clamp(point.y, minY, maxY);
  const base = { x, y };
  const box = actorBox(base, extent);
  if (clears(box, content)) return base;

  // Leave the measured edge by the shortest step. Most frames stay on the original route.
  const nearby: PixelOffset[] = [{ x: clamp(wingX, minX, maxX), y }];
  for (const item of content) {
    if (!overlaps(box, item)) continue;
    nearby.push({ x, y: item.top - extent.bottom }, { x, y: item.bottom + extent.top },
      { x: item.left - extent.right, y }, { x: item.right + extent.left, y });
  }
  nearby.sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y));
  return nearby.find(next => next.x >= minX && next.x <= maxX && next.y >= minY && next.y <= maxY
    && Math.hypot(next.x - x, next.y - y) <= 32
    && clears(actorBox(next, extent), content));
}

function alongEdge(target: number, length: number, low: number, high: number, obstacles: [number, number][]) {
  // The tail must stay aligned with Cindy, even when sliding the bubble to a nearby edge.
  const min = Math.max(low, target - length + 12);
  const max = Math.min(high - length, target - 12);
  if (min > max) return;
  const center = target - length / 2;
  const candidates = [clamp(center, min, max)];
  for (const [start, end] of obstacles) {
    if (start - length >= min && start - length <= max) candidates.push(start - length);
    if (end >= min && end <= max) candidates.push(end);
  }
  return candidates
    .filter(position => obstacles.every(([start, end]) => position + length <= start || position >= end))
    .sort((a, b) => Math.abs(a - center) - Math.abs(b - center))[0];
}

export function placeCindyNote(
  route: Route, content: Box[], actor: PixelOffset, bounds: Box, note: NoteSize,
  { heading, landing }: { heading: number; landing: boolean },
): NoteSpot | undefined {
  const { width, height } = note;
  if (!width || !height) return;
  const left = 12, top = route.nav + 8, right = route.width - 12, bottom = route.height - 12;
  const sideways: Tail[] = heading > 0 ? ["left", "right"] : ["right", "left"];
  const order: Tail[] = landing ? ["bottom", ...sideways, "top"] : [...sideways, "bottom", "top"];
  for (const tail of order) {
    if (tail === "bottom" || tail === "top") {
      const y = tail === "bottom" ? bounds.top - NOTE_GAP - height : bounds.bottom + NOTE_GAP;
      if (y < top || y + height > bottom) continue;
      const obstacles = content.filter(box => box.top < y + height && box.bottom > y)
        .map(({ left, right }): [number, number] => [left, right]);
      const x = alongEdge(actor.x, width, left, right, obstacles);
      if (x !== undefined) return { x, y, tail, tailOffset: actor.x - x };
    } else {
      const x = tail === "left" ? bounds.right + NOTE_GAP : bounds.left - NOTE_GAP - width;
      if (x < left || x + width > right) continue;
      const obstacles = content.filter(box => box.left < x + width && box.right > x)
        .map(({ top, bottom }): [number, number] => [top, bottom]);
      const y = alongEdge(actor.y, height, top, bottom, obstacles);
      if (y !== undefined) return { x, y, tail, tailOffset: actor.y - y };
    }
  }
}

function destination(route: Route, index: number, scroll: number, reduced: boolean) {
  const stop = route.stops[index];
  const { height, stops, large } = route;
  const side = CINDY_SCENES[stop.chapter].side;
  const edge = wingCenter(route, side);
  if (reduced) return { x: edge, y: clampY(route, height * .52), perched: false };

  const { anchors } = stop;
  const cue = scroll + height * .58;
  let i = 0;
  while (i < anchors.length - 1 && cue >= (anchors[i].y + anchors[i + 1].y) / 2) i++;
  const anchor = anchors[i];
  const previous = anchors[i - 1] ?? anchor;
  const next = anchors[i + 1] ?? anchor;
  const center = (anchor.y + next.y) / 2;
  const entry = (previous.y + anchor.y) / 2;
  const passing = Math.min(68, height * .09);
  let anchorY = anchor.y;
  if (i > 0 && cue < entry + passing) {
    anchorY = mix(previous.y, anchor.y, ease(clamp((cue - entry + passing) / (2 * passing))));
  } else if (i < anchors.length - 1 && cue > center - passing) {
    anchorY = mix(anchor.y, next.y, ease(clamp((cue - center + passing) / (2 * passing))));
  }
  const end = stops[index + 1]?.at ?? route.maxScroll;
  const progress = clamp((scroll - stop.at) / Math.max(1, end - stop.at));
  const drift = Math.sin(progress * Math.PI) * (large ? 26 : 14);
  const alignedY = clampY(route, clamp(anchorY - scroll, height * .30, height * .72) + drift);
  const wing = side === "left" ? route.left : route.width - route.right;
  const room = Math.max(0, wing / 2 - 73);
  const shift = large ? Math.sin(progress * Math.PI) * Math.min(room, stop.chapter === "global" ? 10 : 5) : 0;
  let x = edge + shift * (side === "left" ? 1 : -1);
  let y = alignedY;
  let perched = false;

  if (stop.chapter === "projects" && large) {
    x = Math.max(edge, Math.min(route.width - 77, anchor.right + 77));
  }
  if (stop.chapter === "hero") {
    const arrival = ease(clamp(scroll / Math.max(1, Math.min(190, end * .55))));
    x = edge;
    y = clampY(route, mix(height * .76, alignedY, arrival));
  }
  if (stop.chapter === "about" && large && route.perch) {
    const perchY = route.perch.top - scroll - 80;
    const visible = ease(clamp((perchY - route.nav - 78) / 72))
      * ease(clamp((height - 84 - perchY) / 80))
      * ease(clamp((scroll - stop.at - transitionRadius(route, index) - 16) / 110))
      * ease(clamp((end - scroll - transitionRadius(route, index + 1) - 16) / 110));
    if (visible > 0) {
      // Align with the empty strip above the photograph before stepping in from the wing.
      y = mix(alignedY, perchY, clamp(visible * 2));
      x = mix(x, route.perch.left + 64, ease(clamp(visible * 2 - 1)));
      perched = visible > .5;
    }
  }
  if (stop.chapter === "contact") {
    const landing = finale(route, scroll);
    x = mix(x, edge, landing);
    y = mix(y, clampY(route, (route.finish?.y ?? route.maxScroll + height - 86) - scroll), landing);
  }
  return { x, y, perched };
}

export function finale(route: Route, scroll: number) {
  return ease(clamp(1 - (route.maxScroll - scroll) / Math.min(260, route.height * .33)));
}

function transitionRadius(route: Route, index: number, span = .20) {
  const { stops, maxScroll, height } = route;
  const before = stops[index].at - stops[index - 1].at;
  const after = (stops[index + 1]?.at ?? maxScroll) - stops[index].at;
  return Math.min(height * span, before * .39, Math.max(40, after * .39));
}

function transition(route: Route, index: number, scroll: number, span?: number) {
  const target = index > 0 && scroll < route.stops[index].at + transitionRadius(route, index, span) ? index : index + 1;
  if (target >= route.stops.length) return;
  const radius = transitionRadius(route, target, span);
  const seam = route.stops[target].at;
  if (radius <= 0 || Math.abs(scroll - seam) >= radius) return;
  return { target, progress: (scroll - seam + radius) / (2 * radius) };
}

export function sampleRoute(route: Route, scroll: number, reduced: boolean) {
  const { stops } = route;
  let index = 0;
  while (index < stops.length - 1 && scroll >= stops[index + 1].at) index++;
  const current = stops[index];
  const side = CINDY_SCENES[current.chapter].side;
  const currentPoint = destination(route, index, scroll, reduced);
  const motion = transition(route, index, scroll);
  const tone = transition(route, index, scroll, .31);
  const palette = tone
    ? { from: stops[tone.target - 1].chapter, to: stops[tone.target].chapter, mix: ease(tone.progress) }
    : { from: current.chapter, to: current.chapter, mix: 0 };

  const base = {
    chapter: current.chapter, index, side, opacity: 1, point: currentPoint as PixelOffset,
    path: false, crossed: false, perched: currentPoint.perched, heading: side === "left" ? 1 : -1,
    palette,
  };
  if (!motion) return base;

  const { target, progress } = motion;
  const from = stops[target - 1], to = stops[target];
  if (reduced) return { ...base, opacity: Math.min(1, Math.abs(progress - .5) * 3) };

  const a = destination(route, target - 1, scroll, false);
  const b = destination(route, target, scroll, false);
  const differentSides = CINDY_SCENES[from.chapter].side !== CINDY_SCENES[to.chapter].side;
  if (!differentSides) return { ...base, point: between(a, b, ease(progress)), path: true, perched: false };
  if (route.height < 330) return { ...base, opacity: Math.min(1, Math.abs(progress - .5) * 3) };

  // The horizontal leg is over the real seam. Both sections reserve an empty edge here.
  const passage = to.top - scroll;
  const across = progress >= .18 && progress <= .82;
  const point = progress < .18 ? { x: a.x, y: mix(a.y, passage, ease(progress / .18)) }
    : across ? { x: mix(a.x, b.x, ease((progress - .18) / .64)), y: passage }
    : { x: b.x, y: mix(passage, b.y, ease((progress - .82) / .18)) };
  return { ...base, point, path: true, crossed: across, perched: false, heading: b.x > a.x ? 1 : -1 };
}

export const rgb = (color: RGB) => `rgb(${color.join(" ")})`;
