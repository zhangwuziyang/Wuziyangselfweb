import { CHAPTERS, CINDY_SCENES, type Chapter, type RGB } from "./cindy-scenes";

export const clamp = (value: number, low = 0, high = 1) => Math.max(low, Math.min(high, value));
export const ease = (t: number) => t * t * (3 - 2 * t);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const rgb = (color: RGB) => `rgb(${color.join(" ")})`;

type Slot = { x: number; y: number; width: number; height: number };
type Station = {
  chapter: Chapter;
  sectionTop: number;
  sectionHeight: number;
  x: number;
  y: number;
  pixels: number;
  compact: boolean;
  reverse: boolean;
  artHeight: number;
  hint: Slot;
  caption: Slot;
};

type Bridge = { from: Station; to: Station; start: number; end: number };
type Route = { stations: Station[]; bridges: Bridge[]; height: number; nav: number };
type GuideSample = {
  station: Station;
  x: number;
  y: number;
  pixels: number;
  travel: number;
  from: Chapter;
  to: Chapter;
  blend: number;
};

export const CAPTION_ENTER = .985;
export const CAPTION_EXIT = .91;
export const TRAVEL_START = ease(.22);

// Horizontal and vertical positions within each chapter's reserved column.
const STAGE: Record<Chapter, readonly [number, number]> = {
  hero: [0, .48],
  about: [.8, .43],
  experience: [-.75, .49],
  projects: [.75, .41],
  global: [-.65, .46],
  music: [.8, .53],
  skills: [-.8, .45],
  philosophy: [.65, .5],
  contact: [0, .42],
};

const LIFT = { walk: -8, peek: 4, slide: 0, hop: -20, sway: -6 };

function measureSlot(element: Element, art: DOMRect): Slot {
  const { left, top, width, height } = element.getBoundingClientRect();
  return { x: left + width / 2, y: top + height / 2 - (art.top + art.height / 2), width, height };
}

export function measureRoute(home: HTMLElement): Route {
  const { clientHeight: height } = document.documentElement;
  const nav = home.querySelector(".story-nav")?.getBoundingClientRect().bottom ?? 49;
  const available = height - nav;
  const scroll = window.scrollY;

  const stations = CHAPTERS.flatMap(chapter => {
    const zone = home.querySelector(`[data-cindy-station="${chapter}"]`);
    const section = zone?.parentElement;
    const mark = zone?.querySelector(".cindy-station__mark");
    const hintSlot = zone?.querySelector(".cindy-station__hint");
    const captionSlot = zone?.querySelector(".cindy-station__caption");
    if (!zone || !section || !mark || !hintSlot || !captionSlot) return [];

    const art = mark.getBoundingClientRect();
    const bounds = section.getBoundingClientRect();
    const pixels = Number(getComputedStyle(zone).getPropertyValue("--cindy-pixels"));
    const compact = pixels < 5;
    const [across, down] = STAGE[chapter];
    const roomX = Math.max(0, art.width / 2 - pixels * (compact ? 20 : 24) - 4);
    const hint = measureSlot(hintSlot, art);
    const caption = measureSlot(captionSlot, art);
    const topY = nav + art.height / 2;
    const bottomY = height - art.height / 2;
    // Keep the whole stage visible when there is room for both the sprite and the caption.
    const captionY = height - caption.y - caption.height / 2 - 4;
    const y = topY <= bottomY
      ? clamp(nav + available * down, topY, Math.max(topY, Math.min(bottomY, captionY)))
      : clamp((nav + height) / 2, art.height / 2, Math.max(art.height / 2, bottomY));
    return [{
      chapter, pixels, compact, reverse: zone.hasAttribute("data-cindy-reverse"),
      sectionTop: bounds.top + scroll, sectionHeight: bounds.height,
      x: art.left + art.width / 2 + across * roomX, y, artHeight: art.height, hint, caption,
    }];
  });

  // The viewport's reading line crosses each real section boundary halfway through the move.
  // Capping the window by both sections' heights keeps the rest of each chapter parked.
  const readingLine = nav + available * .46;
  const bridges = stations.slice(1).map((to, index) => {
    const from = stations[index];
    const seam = to.sectionTop - readingLine;
    const half = Math.min(150, available * .19, from.sectionHeight * .18, to.sectionHeight * .18);
    return { from, to, start: seam - half, end: seam + half };
  });
  return { stations, bridges, nav, height };
}

export function sampleGuide(route: Route, scroll: number, reduced: boolean): GuideSample | undefined {
  let station = route.stations[0];
  if (!station) return;
  for (const { from, to, start, end } of route.bridges) {
    if (scroll <= start) break;
    station = to;
    if (scroll >= end) continue;

    const t = (scroll - start) / (end - start);
    const blend = ease(t);
    const arc = reduced ? 0 : Math.sin(Math.PI * t) ** 2;
    const pixels = mix(from.pixels, to.pixels, blend) * (1 - .035 * arc);
    const pad = mix(from.artHeight, to.artHeight, blend) / 2;
    const minY = Math.min(route.nav + pad, Math.max(pad, route.height - pad));
    return {
      station: t < .5 ? from : to,
      x: mix(from.x, to.x, blend),
      y: clamp(mix(from.y, to.y, blend) + LIFT[CINDY_SCENES[to.chapter].entrance] * arc, minY, Math.max(minY, route.height - pad)),
      pixels,
      travel: ease(clamp(Math.min(t, 1 - t) * 4)),
      from: from.chapter, to: to.chapter, blend,
    };
  }
  return { station, x: station.x, y: station.y, pixels: station.pixels, travel: 0,
    from: station.chapter, to: station.chapter, blend: 0 };
}
