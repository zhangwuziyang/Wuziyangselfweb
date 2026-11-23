import type { Lang } from "@/lib/i18n";

export type LocalizedText = Record<Lang, string>;

export type DeviceKind = "iphone" | "macbook";

export type ChapterSide = "left" | "right";

export type SurfacePolarity = "light" | "dark";

export interface DevicePose {
  /** Horizontal shift in percentage of the stage container (-24 to +24). */
  xPct: number;
  /** Vertical shift in viewport-height units (vh). */
  yVh: number;
  scale: number;
  rotateY: number;
  rotateX: number;
}

export interface StoryScreen {
  src: string;
  alt: LocalizedText;
  /** Whether the screenshot itself has a dark UI (used to adapt browser chrome). */
  darkScreen?: boolean;
}

export interface StoryChapter {
  id: string;
  indexLabel: string;
  eyebrow: LocalizedText;
  headline: LocalizedText;
  body: LocalizedText;
  details: Record<Lang, string[]>;
  accent: string;
  /** Which side the text appears on desktop; the device sits on the opposite side. */
  textSide: ChapterSide;
  /** Surface polarity behind this chapter's text so legibility stays crisp. */
  surface: SurfacePolarity;
  screen: StoryScreen;
  pose: DevicePose;
}

export interface BackdropLayer {
  id: string;
  /** Scroll progress where this layer starts fading in and reaches opacity 1. */
  fadeIn: [number, number];
  background: string;
  glow: string;
}

export interface StoryGalleryItem {
  src: string;
  title: LocalizedText;
  caption: LocalizedText;
  alt: LocalizedText;
  darkScreen?: boolean;
}

export interface StoryStat {
  value: string;
  label: LocalizedText;
  note: LocalizedText;
}

export interface StoryVideo {
  src: string;
  poster: string;
  eyebrow: LocalizedText;
  title: LocalizedText;
  caption: LocalizedText;
}

export interface SiblingLink {
  href: string;
  eyebrow: LocalizedText;
  title: LocalizedText;
}

export interface ProjectStoryConfig {
  slug: "health-agent" | "offer-radar";
  device: DeviceKind;
  browserDomain?: string;
  mascotIcon?: {
    src: string;
    alt: LocalizedText;
  };
  title: LocalizedText;
  subtitle: LocalizedText;
  badges: Record<Lang, string[]>;
  status: LocalizedText;
  openingPose: DevicePose;
  openingScreen: StoryScreen;
  /** Scroll progress window [start, end] where chrome glides from light to dark. */
  darkTransition: [number, number];
  /** Base canvas color at scroll progress 0. */
  baseBackground: string;
  /** Final dark ending surface color (must match the last backdrop layer). */
  endingBackground: string;
  accentLight: string;
  accentDark: string;
  backdropLayers: BackdropLayer[];
  chapters: StoryChapter[];
  video?: StoryVideo;
  galleryHeading: LocalizedText;
  gallerySubheading: LocalizedText;
  gallery: StoryGalleryItem[];
  statsHeading: LocalizedText;
  stats: StoryStat[];
  metaPills?: Record<Lang, string[]>;
  techTags: Record<Lang, string[]>;
  disclaimer?: LocalizedText;
  sibling: SiblingLink;
}
