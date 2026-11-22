import { CHAPTERS, CINDY_SCENES, type Chapter, type RGB } from "./cindy-scenes";
import { cindySpriteBounds } from "./cindy-sprite";

export const clamp = (value: number, low = 0, high = 1) => Math.max(low, Math.min(high, value));
export const ease = (t: number) => t * t * (3 - 2 * t);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const rgb = (color: RGB) => `rgb(${color.join(" ")})`;

export type Box = { left: number; top: number; right: number; bottom: number };
export type Station = Box & {
  chapter: Chapter;
  x: number;
  y: number;
  ground: number;
  pixels: number;
  art: Box;
  hint: Box;
  caption: Box;
  tail: "top" | "left" | "right";
  reverse: boolean;
  side: "left" | "right";
  at: number;
  sectionTop: number;
};
type Lane = { x: number; pixels: number };
type Bridge = {
  from: Station; to: Station;
  start: number; out: number; crossStart: number; crossEnd: number; in: number; end: number;
  seam: number;
};
type Route = {
  stations: Station[];
  bridges: Bridge[];
  lanes: Record<Station["side"], Lane>;
  height: number;
  nav: number;
  maxScroll: number;
};

function pageBox(element: Element, scroll: number): Box {
  const { left, right, top, bottom } = element.getBoundingClientRect();
  return { left, right, top: top + scroll, bottom: bottom + scroll };
}

export function measureRoute(home: HTMLElement): Route {
  const { clientHeight: height, clientWidth: width, scrollHeight } = document.documentElement;
  const maxScroll = Math.max(1, scrollHeight - height);
  const scroll = window.scrollY;
  const nav = home.querySelector(".story-nav")?.getBoundingClientRect().bottom ?? 49;
  const shell = home.querySelector(".story-shell")?.getBoundingClientRect();
  const left = shell?.left ?? 54;
  const right = shell?.right ?? width - 54;
  const lanes = {
    left: { x: left / 2, pixels: Math.min(1.48, (left - 10) / 49) },
    right: { x: (width + right) / 2, pixels: Math.min(1.48, (width - right - 10) / 49) },
  };
  const focus = nav + (height - nav) * .50;
  const stations = CHAPTERS.flatMap(chapter => {
    const zone = home.querySelector(`[data-cindy-station="${chapter}"]`);
    const mark = zone?.querySelector(".cindy-station__mark");
    const floor = mark?.querySelector(".cindy-station__floor");
    const hintSlot = zone?.querySelector(".cindy-station__hint");
    const captionSlot = zone?.querySelector(".cindy-station__caption");
    if (!zone || !mark || !floor || !hintSlot || !captionSlot) return [];
    const bounds = pageBox(zone, scroll);
    const art = pageBox(mark, scroll);
    const surface = pageBox(floor, scroll);
    const hint = pageBox(hintSlot, scroll);
    const caption = pageBox(captionSlot, scroll);
    const reverse = zone.hasAttribute("data-cindy-reverse");
    const pixels = Number(getComputedStyle(zone).getPropertyValue("--cindy-pixels")) || 4;
    const sprite = cindySpriteBounds(CINDY_SCENES[chapter].pose, false, 0, pixels === 4, reverse ? -1 : 1, pixels);
    const ground = (surface.top + surface.bottom) / 2;
    const tail = caption.right <= art.left ? "right" : caption.left >= art.right ? "left" : "top";
    const y = ground - sprite.bottom;
    const section = home.querySelector(`#${chapter}`);
    const station: Station = {
      ...bounds, chapter, reverse, pixels, art, hint, caption, tail, ground,
      x: (surface.left + surface.right) / 2, y,
      at: clamp(y - focus, 0, maxScroll),
      sectionTop: section ? pageBox(section, scroll).top : bounds.top,
      side: width >= 1024 && Math.abs(right - bounds.right) < Math.abs(bounds.left - left) ? "right" : "left",
    };
    return [station];
  }).sort((a, b) => a.y - b.y);
  const bridges = stations.slice(1).map((to, index) => buildBridge(stations[index], to, nav, height));
  return { stations, bridges, lanes, height, nav, maxScroll };
}

function buildBridge(from: Station, to: Station, nav: number, height: number): Bridge {
  const span = Math.max(0, to.at - from.at);
  const hold = Math.min(78, (height - nav) * .11, span * .15);
  const start = from.at + hold;
  const end = to.at - hold;
  const room = end - start;
  const portal = Math.min(132, (height - nav) * .23, room * .23);
  const seam = to.sectionTop;
  let out = start + portal;
  let into = end - portal;
  let crossStart = out, crossEnd = out;
  if (from.side !== to.side) {
    // Center the sideways part on the measured empty seam between the real sections.
    // Shrink the portal windows if two neighboring stations are close together.
    const shoulder = Math.min(105, room * .17);
    const first = Math.max(start + portal * .60 + shoulder, seam - height + 96);
    const last = Math.min(end - portal * .60 - shoulder, seam - nav - 52);
    const half = Math.min(145, (height - nav) * .2, Math.max(0, last - first) / 2);
    crossStart = half > 1 ? clamp(seam - (nav + (height - nav) * .5) - half, first, last - half * 2) : start + room * .40;
    crossEnd = half > 1 ? crossStart + half * 2 : start + room * .60;
    out = Math.min(out, crossStart - shoulder);
    into = Math.max(into, crossEnd + shoulder);
  }
  return { from, to, start, out, crossStart, crossEnd, in: into, end, seam };
}

export const CAPTION_ENTER = .985;
export const CAPTION_EXIT = .91;
const PORTAL_WAIT = .22;
export const TRAVEL_START = ease(PORTAL_WAIT);

type GuideSample = {
  station: Station;
  x: number; y: number; pixels: number;
  travel: number;
  from: Chapter; to: Chapter; blend: number;
};

function railY(route: Route, side: Station["side"], y: number) {
  return clamp(y, route.nav + 30, route.height - (side === "right" ? 88 : 32));
}

function parked(station: Station, scroll: number): GuideSample {
  return { station, x: station.x, y: station.y - scroll, pixels: station.pixels, travel: 0,
    from: station.chapter, to: station.chapter, blend: 0 };
}

function portal(route: Route, station: Station, scroll: number, rail: number, end: number) {
  const amount = ease(clamp(rail));
  const lane = route.lanes[station.side];
  const move = clamp((rail - PORTAL_WAIT) / (1 - PORTAL_WAIT));
  const towardEdge = ease(move);
  const arc = Math.sin(Math.PI * move) ** 2;
  const entrance = CINDY_SCENES[station.chapter].entrance;
  const lift = entrance === "hop" ? -15 : entrance === "peek" ? 8 : entrance === "sway" ? -7 : -4;
  return {
    x: mix(station.x, lane.x, towardEdge),
    y: mix(station.y - scroll, railY(route, station.side, station.y - end), ease(clamp((move - .72) / .28))) + arc * lift,
    pixels: mix(station.pixels, lane.pixels, ease(clamp(move / .86))),
    travel: amount,
  };
}

function betweenRails(y0: number, y1: number, from: number, to: number, scroll: number, center: number, intoSeam = false, outOfSeam = false) {
  const span = to - from;
  if (span <= 0) return y1;
  const shoulder = Math.min(160, span / 2);
  const middle = span <= shoulder * 2 ? (y0 + y1) / 2 : center;
  if (scroll <= from + shoulder) {
    const t = clamp((scroll - from) / shoulder);
    return mix(y0, middle, ease(t)) - (outOfSeam ? shoulder * t * (1 - t) ** 2 : 0);
  }
  if (scroll >= to - shoulder) {
    const t = clamp((scroll - to + shoulder) / shoulder);
    return mix(middle, y1, ease(t)) + (intoSeam ? shoulder * (1 - t) * t ** 2 : 0);
  }
  return middle;
}

function bridgePosition(route: Route, bridge: Bridge, scroll: number): GuideSample {
  const { from, to, start, out, crossStart, crossEnd, in: into, end, seam } = bridge;
  const blend = ease(clamp((scroll - start) / Math.max(1, end - start)));
  const record = { station: scroll < into ? from : to, from: from.chapter, to: to.chapter, blend };
  if (scroll <= out) return { ...record, ...portal(route, from, scroll, (scroll - start) / Math.max(1, out - start), out) };
  if (scroll >= into) return { ...record, ...portal(route, to, scroll, (end - scroll) / Math.max(1, end - into), into) };

  const a = route.lanes[from.side], b = route.lanes[to.side];
  const center = route.nav + (route.height - route.nav) * .48;
  const fromY = railY(route, from.side, from.y - out);
  const toY = railY(route, to.side, to.y - into);
  if (from.side === to.side) {
    return { ...record, x: a.x, y: betweenRails(fromY, toY, out, into, scroll, center), pixels: a.pixels, travel: 1 };
  }

  const crossing = ease(clamp((scroll - crossStart) / Math.max(1, crossEnd - crossStart)));
  const startY = railY(route, from.side, seam - crossStart);
  const endY = railY(route, to.side, seam - crossEnd);
  const y = scroll < crossStart ? betweenRails(fromY, startY, out, crossStart, scroll, center, true)
    : scroll > crossEnd ? betweenRails(endY, toY, crossEnd, into, scroll, center, false, true)
    : mix(startY, endY, clamp((scroll - crossStart) / Math.max(1, crossEnd - crossStart)));
  return { ...record, x: mix(a.x, b.x, crossing), y, pixels: mix(a.pixels, b.pixels, crossing), travel: 1 };
}

export function sampleGuide(route: Route, scroll: number, reduced: boolean): GuideSample | undefined {
  const { stations, bridges, nav, height, maxScroll } = route;
  const first = stations[0];
  if (!first) return;
  const last = stations[stations.length - 1];
  const bridge = bridges.find(link => scroll >= link.start && scroll <= link.end);
  const station = stations[bridges.filter(link => scroll > link.end).length] ?? last;
  const leadIn = Math.max(0, Math.min(first.at, first.art.top - nav - 10));
  const landing = first.art.top >= nav && first.hint.bottom <= height ? 0 : leadIn;
  const leadOut = Math.min(maxScroll, Math.max(last.at, last.art.top - nav - 20));
  let sample: GuideSample;
  if (bridge) sample = bridgePosition(route, bridge, scroll);
  else if (scroll < landing) {
    const start = Math.max(0, landing - 124);
    sample = { ...parked(first, scroll), ...portal(route, first, scroll, (landing - scroll) / Math.max(1, landing - start), start) };
  } else if (scroll > leadOut) {
    const end = Math.min(maxScroll, leadOut + 120);
    sample = { ...parked(last, scroll), ...portal(route, last, scroll, (scroll - leadOut) / Math.max(1, end - leadOut), end) };
  } else sample = parked(station, scroll);
  const pad = sample.pixels * 26 + 2;
  sample.y = clamp(sample.y, nav + pad, height - pad);
  if (!reduced || sample.travel <= TRAVEL_START) return sample;
  return { ...sample, x: route.lanes.left.x, y: nav + (height - nav) * .55, pixels: route.lanes.left.pixels, travel: 1 };
}
