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
  return {
    stops, width, height, nav, left: shell?.left ?? 60, right: shell?.right ?? width - 60, maxScroll, large,
    perch: perch ? readAnchor(perch, scroll) : undefined,
    finish: finish ? readAnchor(finish, scroll) : undefined, nodes,
  };
}

export const wingCenter = (route: Route, side: Side) => (side === "left" ? route.left : route.width + route.right) / 2;
export const spriteRadius = (route: Route) => route.large ? 71 : 35;
const clampY = (route: Route, y: number) => clamp(y, route.nav + spriteRadius(route) + 8, route.height - spriteRadius(route) - 8);

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

  if (stop.chapter === "hero") {
    const arrival = ease(clamp(scroll / Math.max(1, Math.min(190, end * .55))));
    x = edge;
    y = clampY(route, mix(height * .76, alignedY, arrival));
  }
  if (stop.chapter === "about" && large && route.perch) {
    const perchY = route.perch.top - scroll - 63;
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

function transitionRadius(route: Route, index: number) {
  const { stops, maxScroll, height } = route;
  const before = stops[index].at - stops[index - 1].at;
  const after = (stops[index + 1]?.at ?? maxScroll) - stops[index].at;
  return Math.min(height * .27, before * .39, Math.max(40, after * .39));
}

export function sampleRoute(route: Route, scroll: number, reduced: boolean) {
  const { stops } = route;
  let index = 0;
  while (index < stops.length - 1 && scroll >= stops[index + 1].at) index++;
  const current = stops[index];
  const side = CINDY_SCENES[current.chapter].side;
  const currentPoint = destination(route, index, scroll, reduced);
  let target = index > 0 && scroll < current.at + transitionRadius(route, index) ? index : index + 1;
  if (target >= stops.length) target = index;
  const radius = target > 0 ? transitionRadius(route, target) : 0;
  const seam = stops[target].at;
  const changing = radius > 0 && Math.abs(scroll - seam) < radius;
  const progress = changing ? clamp((scroll - seam + radius) / (2 * radius)) : 0;
  const blend = ease(progress);

  const base = {
    chapter: current.chapter, index, side, progress, opacity: 1, point: currentPoint as PixelOffset,
    path: false, crossed: false, perched: currentPoint.perched, heading: side === "left" ? 1 : -1,
    palette: { from: current.chapter, to: current.chapter, mix: 0 },
  };
  if (!changing) return base;

  const from = stops[target - 1], to = stops[target];
  const palette = { from: from.chapter, to: to.chapter, mix: blend };
  if (reduced) return { ...base, palette, opacity: Math.min(1, Math.abs(progress - .5) * 3) };

  const a = destination(route, target - 1, scroll, false);
  const b = destination(route, target, scroll, false);
  const differentSides = CINDY_SCENES[from.chapter].side !== CINDY_SCENES[to.chapter].side;
  if (!differentSides) return { ...base, palette, point: between(a, b, blend), path: true, perched: false };
  if (route.height < 330) return { ...base, palette, opacity: Math.min(1, Math.abs(progress - .5) * 3) };

  // The horizontal leg is over the real seam. Both sections reserve an empty edge here.
  const passage = to.top - scroll;
  const across = progress >= .22 && progress <= .78;
  const point = progress < .22 ? { x: a.x, y: mix(a.y, passage, ease(progress / .22)) }
    : across ? { x: mix(a.x, b.x, ease((progress - .22) / .56)), y: passage }
    : { x: b.x, y: mix(passage, b.y, ease((progress - .78) / .22)) };
  return { ...base, palette, point, path: true, crossed: across, perched: false, heading: b.x > a.x ? 1 : -1 };
}

export const rgb = (color: RGB) => `rgb(${color.join(" ")})`;
