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
  contentTop: number;
  contentBottom: number;
  x: number;
  y: number;
  pixels: number;
  compact: boolean;
  reverse: boolean;
  artHeight: number;
  hint: Slot;
  caption: Slot;
};

type Crossing = { start: number; end: number; middle: number; high: number; low: number; lift: number };
type Bridge = { from: Station; to: Station; start: number; end: number; crossing?: Crossing };
type Route = {
  stations: Station[];
  bridges: Bridge[];
  height: number;
  nav: number;
  reader: HTMLElement | null;
  contentTop: number;
  contentBottom: number;
};
type GuideSample = {
  station: Station;
  x: number;
  y: number;
  pixels: number;
  travel: number;
  squash: number;
  walkCycle: number;
  direction: number;
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
  const stage = home.querySelector(".cindy-mobile-stage");
  const mobileArt = stage?.querySelector(".cindy-mobile-stage__art")?.getBoundingClientRect();
  const mobileCaption = stage?.querySelector(".cindy-mobile-stage__caption");
  const reader = mobileArt?.height && mobileCaption ? home.querySelector<HTMLElement>(".story-content") : null;
  const reading = reader?.getBoundingClientRect();
  const scroll = reader?.scrollTop ?? window.scrollY;

  const stations = CHAPTERS.flatMap(chapter => {
    const zone = home.querySelector(`[data-cindy-station="${chapter}"]`);
    const section = zone?.parentElement;
    const mark = zone?.querySelector(".cindy-station__mark");
    const hintSlot = zone?.querySelector(".cindy-station__hint");
    const captionSlot = zone?.querySelector(".cindy-station__caption");
    if (!zone || !section || !mark || !hintSlot || !captionSlot) return [];

    const bounds = section.getBoundingClientRect();
    const content = section.querySelector(".story-shell")?.getBoundingClientRect() ?? bounds;
    const pixels = Number(getComputedStyle(zone).getPropertyValue("--cindy-pixels"));
    const compact = pixels < 5;
    const [across, down] = STAGE[chapter];
    const common = {
      chapter, pixels, compact, reverse: zone.hasAttribute("data-cindy-reverse"),
      sectionTop: bounds.top + scroll, sectionHeight: bounds.height,
      contentTop: content.top + scroll, contentBottom: content.bottom + scroll,
    };
    if (reader && mobileArt && mobileCaption) {
      const art = mobileArt;
      const shift = (down - .48) * 40 - 2;
      const hint = { x: art.left + art.width / 2, y: pixels * 25 + 4, width: art.width, height: 16 };
      const caption = measureSlot(mobileCaption, art);
      return [{
        ...common, x: hint.x + across * 5, y: art.top + art.height / 2 + shift,
        artHeight: art.height, hint, caption: { ...caption, y: caption.y - shift },
      }];
    }

    const art = mark.getBoundingClientRect();
    const roomX = Math.max(0, art.width / 2 - pixels * 24 - 4);
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
      ...common,
      x: art.left + art.width / 2 + across * roomX, y, artHeight: art.height, hint, caption,
    }];
  });

  // The viewport's reading line crosses each real section boundary halfway through the move.
  // Capping the window by both sections' heights keeps the rest of each chapter parked.
  const contentTop = reading?.top ?? 0;
  const contentBottom = reading?.bottom ?? height;
  const readingHeight = reading?.height ?? available;
  const readingLine = (reading?.top ?? nav) + readingHeight * .46;
  const bridges = stations.slice(1).map((to, index) => {
    const from = stations[index];
    if (!reader) return desktopBridge(from, to, nav, height);
    const seam = to.sectionTop - readingLine;
    const half = Math.min(150, readingHeight * .19, from.sectionHeight * .18, to.sectionHeight * .18);
    return { from, to, start: seam - half, end: seam + half };
  });
  return { stations, bridges, nav, height, reader, contentTop, contentBottom };
}

function desktopBridge(from: Station, to: Station, nav: number, height: number): Bridge {
  // The copy edges define the empty band in document space. Sweep across it as it moves through the viewport.
  const pad = Math.max(from.artHeight, to.artHeight) / 2;
  const gap = to.contentTop - from.contentBottom;
  const middle = (from.contentBottom + to.contentTop) / 2;
  const center = (nav + height) / 2;
  const shoulder = 82;
  const chapterRoom = (Math.min(from.sectionHeight, to.sectionHeight) + gap) * .20 - shoulder;
  const reach = Math.max(0, Math.min(158, chapterRoom, (height - nav) / 2 - pad - 18));
  const low = Math.max(from.y, center + reach);
  const high = Math.min(to.y, center - reach);
  const lift = clamp(gap / 2 - pad - 12, 0, 23);
  const runway = Math.max(1, gap / 2 - pad - lift - 12);
  const start = middle - low - runway;
  const end = middle - high + runway;
  return { from, to, start: start - shoulder, end: end + shoulder, crossing: { start, end, middle, high, low, lift } };
}

function sampleCrossing(bridge: Bridge, crossing: Crossing, scroll: number, reduced: boolean): GuideSample {
  const { from, to, start, end } = bridge;
  const { middle, low, high } = crossing;
  const progress = clamp((scroll - crossing.start) / (crossing.end - crossing.start));
  const blend = ease(progress);
  const departure = ease(clamp((scroll - start) / (crossing.start - start)));
  const arrival = ease(clamp((scroll - crossing.end) / (end - crossing.end)));
  const arc = reduced ? 0 : Math.sin(Math.PI * progress) ** 2;
  const crossingY = clamp(middle - scroll, high, low) - arc * crossing.lift;
  const landing = reduced ? 0 : Math.sin(2 * Math.PI * arrival) * (1 - arrival);
  return {
    station: progress < .5 ? from : to,
    x: mix(from.x, to.x, blend),
    y: mix(mix(from.y, crossingY, departure), to.y, arrival) + landing * 4,
    pixels: mix(from.pixels, to.pixels, blend) * (1 - .035 * arc),
    squash: 1 - landing * .11,
    travel: departure * (1 - arrival),
    walkCycle: progress * Math.abs(to.x - from.x) / 36,
    direction: Math.sign(to.x - from.x),
    from: from.chapter, to: to.chapter, blend,
  };
}

export function sampleGuide(route: Route, scroll: number, reduced: boolean): GuideSample | undefined {
  let station = route.stations[0];
  if (!station) return;
  for (const bridge of route.bridges) {
    const { from, to, start, end, crossing } = bridge;
    if (scroll <= start) break;
    station = to;
    if (scroll >= end) continue;
    if (crossing) return sampleCrossing(bridge, crossing, scroll, reduced);

    const t = (scroll - start) / (end - start);
    const blend = ease(t);
    const arc = reduced ? 0 : Math.sin(Math.PI * t) ** 2;
    const pixels = mix(from.pixels, to.pixels, blend) * (1 - .035 * arc);
    const entry = reduced ? 0 : Math.sin(Math.PI * clamp((t - .55) / .45)) ** 2;
    const y = mix(from.y, to.y, blend) + LIFT[CINDY_SCENES[to.chapter].entrance] * arc * .2 - 6 * entry;
    return {
      station: t < .5 ? from : to,
      x: mix(from.x, to.x, blend),
      y,
      pixels,
      squash: 1 - entry * .035,
      walkCycle: scroll / 18,
      direction: 0,
      travel: ease(clamp(Math.min(t, 1 - t) * 4)),
      from: from.chapter, to: to.chapter, blend,
    };
  }
  return { station, x: station.x, y: station.y, pixels: station.pixels, travel: 0, squash: 1, walkCycle: 0, direction: 0,
    from: station.chapter, to: station.chapter, blend: 0 };
}
