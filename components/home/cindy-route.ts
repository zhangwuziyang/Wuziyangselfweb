import { CHAPTERS, CINDY_SCENES, type Chapter, type RGB } from "./cindy-scenes";

export const clamp = (value: number, low = 0, high = 1) => Math.max(low, Math.min(high, value));
export const ease = (t: number) => t * t * (3 - 2 * t);
export const rgb = (color: RGB) => `rgb(${color.join(" ")})`;

export type Box = { left: number; top: number; right: number; bottom: number };
export type Station = Box & {
  chapter: Chapter;
  x: number;
  y: number;
  noteEdge: number;
  reverse: boolean;
};
type Stop = { chapter: Chapter; at: number };
type Route = {
  stations: Station[];
  stops: Stop[];
  height: number;
  nav: number;
  maxScroll: number;
};

function pageBox(element: Element, scroll: number): Box {
  const { left, right, top, bottom } = element.getBoundingClientRect();
  return { left, right, top: top + scroll, bottom: bottom + scroll };
}

export function measureRoute(home: HTMLElement): Route {
  const { clientHeight: height, scrollHeight } = document.documentElement;
  const maxScroll = Math.max(1, scrollHeight - height);
  const scroll = window.scrollY;
  const nav = home.querySelector(".story-nav")?.getBoundingClientRect().bottom ?? 49;
  const stops = CHAPTERS.flatMap((chapter, index) => {
    const section = home.querySelector(`#${chapter}`);
    if (!section) return [];
    const { top } = pageBox(section, scroll);
    return [{ chapter, at: index ? clamp(top - height * .53, 0, index === CHAPTERS.length - 1 ? Math.max(0, maxScroll - 80) : maxScroll) : 0 }];
  });
  const stations = CHAPTERS.flatMap(chapter => {
    const zone = home.querySelector(`[data-cindy-station="${chapter}"]`);
    const mark = zone?.querySelector(".cindy-station__mark");
    if (!zone || !mark) return [];
    const bounds = pageBox(zone, scroll);
    const target = pageBox(mark, scroll);
    const reverse = zone.hasAttribute("data-cindy-reverse");
    return [{
      ...bounds, chapter, reverse, x: (target.left + target.right) / 2, y: (bounds.top + bounds.bottom) / 2 - 8,
      noteEdge: reverse ? target.left - 4 : target.right + 4,
    }];
  }).sort((a, b) => a.y - b.y);
  return { stations, stops, height, nav, maxScroll };
}

export function samplePalette({ stops, height, maxScroll }: Route, scroll: number) {
  let index = 0;
  while (index < stops.length - 1 && scroll >= stops[index + 1].at) index++;
  const chapter = stops[index]?.chapter ?? "hero";
  for (const next of [index, index + 1]) {
    if (next < 1 || next >= stops.length) continue;
    const before = stops[next].at - stops[next - 1].at;
    const after = (stops[next + 1]?.at ?? maxScroll) - stops[next].at;
    const radius = Math.min(height * .31, before * .39, Math.max(40, after * .39));
    const distance = scroll - stops[next].at;
    if (radius > 0 && Math.abs(distance) < radius) {
      return { from: stops[next - 1].chapter, to: stops[next].chapter, blend: ease((distance + radius) / (2 * radius)) };
    }
  }
  return { from: chapter, to: chapter, blend: 0 };
}

export function sampleStation(route: Route, scroll: number) {
  const { stations, nav, height } = route;
  const focus = (height + nav) / 2 + 14;
  const line = scroll + focus;
  let index = 0;
  while (index + 1 < stations.length && line >= (stations[index].y + stations[index + 1].y) / 2) index++;
  const station = stations[index];
  if (!station) return;
  const before = index ? line - (stations[index - 1].y + station.y) / 2 : Infinity;
  const after = index < stations.length - 1 ? (stations[index + 1].y + station.y) / 2 - line : Infinity;
  const headroom = station.top - scroll - nav;
  const footroom = scroll + height - station.bottom;
  const entering = Math.min(footroom, before) < Math.min(headroom, after);
  const phase = clamp(Math.min((headroom + 104) / 116, (footroom + 104) / 116, before / 78, after / 78));
  return { station, phase, entering, fullyVisible: headroom >= 0 && footroom >= 0 };
}

export const TRAVEL_END = .82;
export const CAPTION_ENTER = .985;
export const CAPTION_EXIT = .91;

export function stationMotion(sample: NonNullable<ReturnType<typeof sampleStation>>, reduced: boolean, large: boolean) {
  const { phase, entering, station } = sample;
  const scene = CINDY_SCENES[station.chapter];
  const sign = station.reverse ? -1 : 1;
  const progress = ease(clamp(phase / TRAVEL_END));
  const traveling = progress < 1 && !reduced;
  const rest = 1 - progress;
  const arc = Math.sin(progress * Math.PI);
  if (!traveling) return { x: station.x, y: station.y, scale: 1, opacity: ease(clamp(phase / .62)), traveling };

  // Entrances use the free space reserved for the sprite and its hidden caption.
  const distance = large ? 84 : 36;
  let x = 0, y = 0, scale = .82 + .18 * progress;
  switch (scene.entrance) {
    case "walk":
      x = sign * distance * rest;
      y = -Math.abs(Math.sin(progress * Math.PI * 4)) * 5 * rest;
      break;
    case "peek":
      x = sign * distance * .30 * rest;
      y = 20 * rest;
      scale = .74 + .26 * progress;
      break;
    case "slide":
      x = sign * distance * .15 * rest;
      y = (entering ? -1 : 1) * 30 * rest;
      break;
    case "hop":
      x = sign * distance * .86 * rest;
      y = -25 * arc;
      break;
    case "sway":
      x = sign * distance * .48 * rest + Math.sin(progress * 2 * Math.PI) * 8 * rest;
      y = -9 * arc;
      break;
  }
  return {
    x: station.x + x, y: station.y + y, scale,
    opacity: ease(clamp((phase - .05) / .60)), traveling,
  };
}
