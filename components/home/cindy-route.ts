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
type Box = { left: number; top: number; right: number; bottom: number };

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
  protectedMedia: Box[];
  copy: Box[];
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
  const boxes = (selector: string) => Array.from(home.querySelectorAll(selector), element => {
    const { left, top, right, bottom } = element.getBoundingClientRect();
    return { left, right, top: top + scroll, bottom: bottom + scroll };
  });
  return {
    stops, width, height, nav, left: shell?.left ?? 60, right: shell?.right ?? width - 60, maxScroll, large,
    perch: perch ? readAnchor(perch, scroll) : undefined,
    finish: finish ? readAnchor(finish, scroll) : undefined, nodes,
    protectedMedia: boxes(".story-shell :is(img, .project-browser, .project-phone), #skills [data-cindy-anchor]"),
    copy: boxes(".story-shell :is(h1, h2, h3, blockquote, p, a, button, figcaption)"),
  };
}

export const wingCenter = (route: Route, side: Side) => (side === "left" ? route.left : route.width + route.right) / 2;
export const spriteRadius = (route: Route) => route.large ? 71 : 35;
const clampY = (route: Route, y: number) => clamp(y, route.nav + spriteRadius(route) + 8, route.height - spriteRadius(route) - 8);

export function placeCindyNote(
  route: Route,
  scroll: number,
  actor: PixelOffset,
  note: { width: number; height: number },
  radius: number,
  { perched, crossing, heading }: { perched: boolean; crossing: boolean; heading: number },
) {
  const margin = 12;
  const gap = 8;
  const { width, height } = note;
  const maxX = Math.max(margin, route.width - margin - width);
  const minY = Math.min(route.nav + 8, Math.max(margin, route.height - height - margin));
  const maxY = Math.max(minY, route.height - margin - height);
  const left = actor.x - radius - width - gap;
  const right = actor.x + radius + gap;
  const sideY = actor.y - height / 2;
  const above = actor.y - radius - height - gap;
  const below = actor.y + radius + gap;
  const centered = actor.x - width / 2;
  const sideX = perched || (heading > 0 && right <= maxX) || left < margin ? right : left;
  const beside = perched || crossing;
  const preferred = beside ? { x: sideX, y: sideY }
    : { x: centered, y: above >= minY ? above : below };
  const xs = [...new Set([preferred.x, left, right, centered, margin, maxX].map(x => clamp(x, margin, maxX)))];
  const actorBox = { left: actor.x - radius, right: actor.x + radius, top: actor.y - radius, bottom: actor.y + radius };
  const visible = (boxes: Box[]) => boxes
    .filter(box => box.right > box.left && box.bottom > scroll + minY && box.top < scroll + maxY + height)
    .map(box => ({ ...box, top: box.top - scroll, bottom: box.bottom - scroll }));
  const hard = visible(route.protectedMedia);
  const soft = visible(route.copy);

  function find(blocks: Box[]) {
    let best: (PixelOffset & { score: number }) | undefined;
    const sorted = blocks.sort((a, b) => a.top - b.top);
    for (const x of xs) {
      let start = minY;
      function test(end: number) {
        if (end - start < height) return;
        const y = clamp(preferred.y, start, end - height);
        const score = Math.hypot(x - preferred.x, y - preferred.y);
        if (!best || score < best.score) best = { x, y, score };
      }
      for (const box of sorted) {
        if (x >= box.right + gap || x + width <= box.left - gap) continue;
        test(Math.min(maxY + height, box.top - gap));
        start = Math.max(start, box.bottom + gap);
        if (start > maxY) break;
      }
      test(maxY + height);
    }
    return best;
  }

  const point = find([...hard, ...soft, actorBox]) ?? find([...hard, actorBox]) ?? find([actorBox])
    ?? { x: clamp(preferred.x, margin, maxX), y: clamp(preferred.y, minY, maxY) };
  const tail = point.y + height <= actorBox.top ? "bottom" : point.y >= actorBox.bottom ? "top"
    : point.x >= actor.x ? "left" : "right";
  const tailOffset = tail === "top" || tail === "bottom"
    ? clamp(actor.x - point.x, 12, width - 12) : clamp(actor.y - point.y, 12, height - 12);
  return { x: point.x, y: point.y, tail, tailOffset };
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
