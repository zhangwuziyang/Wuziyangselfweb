"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useLang } from "@/context/LangContext";
import type { Lang } from "@/lib/i18n";
import type {
  BackdropLayer,
  ProjectStoryConfig,
  StoryChapter,
  StoryGalleryItem,
} from "@/lib/projectData/storyTypes";
import {
  IPhoneStageFrame,
  MacBookStageFrame,
  StaticDeviceFrame,
} from "./DeviceFrames";
import { ProjectNav } from "./ProjectNav";
import styles from "./projectStory.module.css";

const DESKTOP_MQ = "(min-width: 768px)";

function subscribeDesktop(callback: () => void) {
  const mql = window.matchMedia(DESKTOP_MQ);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getDesktopSnapshot() {
  return window.matchMedia(DESKTOP_MQ).matches;
}

function getDesktopServerSnapshot() {
  return true;
}

/**
 * Evenly spaced beat windows for 5 chapters inside [0, 1].
 * Opening hero exits completely by 0.105 (and visibility:hidden by 0.11),
 * strictly before Chapter 1 starts fading in at 0.14.
 * Device lateral sweeps occur inside the inter-chapter gaps:
 *   0.04–0.15, 0.28–0.34, 0.46–0.52, 0.64–0.70, 0.82–0.88
 */
const CHAPTER_WINDOWS: ReadonlyArray<readonly [number, number, number, number]> = [
  [0.14, 0.185, 0.255, 0.29],
  [0.33, 0.375, 0.44, 0.475],
  [0.51, 0.555, 0.62, 0.655],
  [0.69, 0.735, 0.8, 0.835],
  [0.87, 0.915, 0.98, 1.0],
];

const SCREEN_ENTER_POINTS = [0, 0.11, 0.29, 0.47, 0.65, 0.83];

const SCRUBBER_TARGETS = [0, 0.22, 0.41, 0.59, 0.77, 0.94];

interface BackdropLayerViewProps {
  layer: BackdropLayer;
  index: number;
  progress: MotionValue<number>;
}

function BackdropLayerView({ layer, index, progress }: BackdropLayerViewProps) {
  const isBase = index === 0;
  const [start, end] = layer.fadeIn;
  const opacity = useTransform(
    progress,
    isBase ? [0, 1] : [0, start, end, 1],
    isBase ? [1, 1] : [0, 0, 1, 1]
  );

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        backgroundColor: layer.background,
        backgroundImage: layer.glow,
      }}
    />
  );
}

interface ChapterOverlayProps {
  chapter: StoryChapter;
  index: number;
  holdAtEnd: boolean;
  progress: MotionValue<number>;
  lang: Lang;
  device: ProjectStoryConfig["device"];
}

function ChapterOverlay({
  chapter,
  index,
  holdAtEnd,
  progress,
  lang,
  device,
}: ChapterOverlayProps) {
  const [enterStart, enterEnd, exitStart, exitEnd] =
    CHAPTER_WINDOWS[index] ?? CHAPTER_WINDOWS[CHAPTER_WINDOWS.length - 1];

  const opacity = useTransform(
    progress,
    holdAtEnd
      ? [0, enterStart, enterEnd, 1]
      : [0, enterStart, enterEnd, exitStart, exitEnd, 1],
    holdAtEnd ? [0, 0, 1, 1] : [0, 0, 1, 1, 0, 0]
  );

  const y = useTransform(
    progress,
    holdAtEnd
      ? [0, enterStart, enterEnd, 1]
      : [0, enterStart, enterEnd, exitStart, exitEnd, 1],
    holdAtEnd ? [40, 40, 0, 0] : [40, 40, 0, 0, -36, -36]
  );

  const [visible, setVisible] = useState(false);

  useMotionValueEvent(progress, "change", (latest) => {
    const visibleEnd = exitEnd === 1 ? exitEnd : exitEnd + 0.005;
    const active = latest >= enterStart - 0.005 && (holdAtEnd || latest < visibleEnd);
    setVisible((prev) => (prev === active ? prev : active));
  });

  const isDark = chapter.surface === "dark";

  /* Disjoint safe text zones guaranteed never to intersect the device zone
     across 768 / 1024 / 1280 / 1440 / 1920px viewports. */
  const widthClass =
    device === "macbook"
      ? "w-[37%] max-w-[430px]"
      : "w-[43%] max-w-[470px]";

  const alignClass = chapter.textSide === "left" ? "left-0" : "right-0";

  return (
    <motion.article
      aria-hidden={!visible}
      className={`absolute top-1/2 -translate-y-1/2 ${widthClass} ${alignClass} ${
        visible ? "pointer-events-auto z-20" : "pointer-events-none z-10"
      }`}
      style={{
        opacity,
        y,
        visibility: visible ? "visible" : "hidden",
      }}
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          className="font-mono text-[11px] font-semibold tracking-[0.14em]"
          style={{ color: chapter.accent }}
        >
          {chapter.indexLabel}
        </span>
        <span
          aria-hidden="true"
          className="h-px w-6"
          style={{ backgroundColor: chapter.accent, opacity: 0.45 }}
        />
        <span
          className="text-[11px] font-semibold tracking-[0.14em] uppercase"
          style={{ color: chapter.accent }}
        >
          {chapter.eyebrow[lang]}
        </span>
      </div>

      <h2
        className={`${styles.chapterHeadline} mb-5 text-[clamp(1.65rem,2.75vw,2.65rem)] font-semibold leading-[1.1] tracking-[-0.03em] ${
          isDark ? "text-[#f5f5f7]" : "text-[#1d1d1f]"
        }`}
      >
        {chapter.headline[lang]}
      </h2>

      <p
        className={`mb-7 text-[clamp(0.92rem,1.15vw,1.05rem)] font-normal leading-[1.78] ${
          isDark ? "text-[#b6b9c6]" : "text-[#4c4d54]"
        }`}
      >
        {chapter.body[lang]}
      </p>

      <ul className="flex flex-wrap gap-2">
        {chapter.details[lang].map((item) => (
          <li
            key={item}
            className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium tracking-[-0.005em] ${
              isDark
                ? "border border-white/[0.11] bg-white/[0.06] text-[#e2e4ec]"
                : "border border-black/[0.08] bg-white/75 text-[#2b2c32] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

interface PinnedStageContentProps {
  story: ProjectStoryConfig;
  progress: MotionValue<number>;
  lang: Lang;
  onJumpToProgress: (targetProgress: number) => void;
}

function PinnedStageContent({
  story,
  progress,
  lang,
  onJumpToProgress,
}: PinnedStageContentProps) {
  const zh = lang === "zh";

  const allScreens = useMemo(
    () => [story.openingScreen, ...story.chapters.map((c) => c.screen)],
    [story]
  );

  /**
   * Direct scroll-locked device keyframes (no spring lag) so the device
   * finishes sweeping across to the opposite half BEFORE the incoming text
   * chapter fades in, guaranteeing zero overlap during both reading and motion.
   */
  const poseKeyframes = useMemo(() => {
    const o = story.openingPose;
    const ch = story.chapters;
    const stops = [0, 0.04, 0.15, 0.28, 0.34, 0.46, 0.52, 0.64, 0.7, 0.82, 0.88, 1];

    const x = [
      `${o.xPct}%`,
      `${o.xPct}%`,
      `${ch[0].pose.xPct}%`,
      `${ch[0].pose.xPct}%`,
      `${ch[1].pose.xPct}%`,
      `${ch[1].pose.xPct}%`,
      `${ch[2].pose.xPct}%`,
      `${ch[2].pose.xPct}%`,
      `${ch[3].pose.xPct}%`,
      `${ch[3].pose.xPct}%`,
      `${ch[4].pose.xPct}%`,
      `${ch[4].pose.xPct}%`,
    ];

    const y = [
      `${o.yVh}vh`,
      `${Math.max(18, o.yVh - 4)}vh`,
      `${ch[0].pose.yVh}vh`,
      `${ch[0].pose.yVh - 0.6}vh`,
      `${ch[1].pose.yVh}vh`,
      `${ch[1].pose.yVh - 0.6}vh`,
      `${ch[2].pose.yVh}vh`,
      `${ch[2].pose.yVh - 0.6}vh`,
      `${ch[3].pose.yVh}vh`,
      `${ch[3].pose.yVh - 0.6}vh`,
      `${ch[4].pose.yVh}vh`,
      `${ch[4].pose.yVh}vh`,
    ];

    const scale = [
      o.scale,
      o.scale + 0.015,
      ch[0].pose.scale,
      ch[0].pose.scale + 0.01,
      ch[1].pose.scale,
      ch[1].pose.scale + 0.01,
      ch[2].pose.scale,
      ch[2].pose.scale + 0.01,
      ch[3].pose.scale,
      ch[3].pose.scale + 0.01,
      ch[4].pose.scale,
      ch[4].pose.scale,
    ];

    const rotateY = [
      o.rotateY,
      o.rotateY,
      ch[0].pose.rotateY,
      ch[0].pose.rotateY * 0.84,
      ch[1].pose.rotateY,
      ch[1].pose.rotateY * 0.84,
      ch[2].pose.rotateY,
      ch[2].pose.rotateY * 0.84,
      ch[3].pose.rotateY,
      ch[3].pose.rotateY * 0.84,
      ch[4].pose.rotateY,
      ch[4].pose.rotateY * 0.84,
    ];

    const rotateX = [
      o.rotateX,
      Math.max(0, o.rotateX - 2),
      ch[0].pose.rotateX,
      ch[0].pose.rotateX - 0.5,
      ch[1].pose.rotateX,
      ch[1].pose.rotateX - 0.5,
      ch[2].pose.rotateX,
      ch[2].pose.rotateX - 0.5,
      ch[3].pose.rotateX,
      ch[3].pose.rotateX - 0.5,
      ch[4].pose.rotateX,
      ch[4].pose.rotateX,
    ];

    return { stops, x, y, scale, rotateY, rotateX };
  }, [story]);

  const deviceX = useTransform(progress, poseKeyframes.stops, poseKeyframes.x);
  const deviceY = useTransform(progress, poseKeyframes.stops, poseKeyframes.y);
  const deviceScale = useTransform(progress, poseKeyframes.stops, poseKeyframes.scale);
  const deviceRotateY = useTransform(progress, poseKeyframes.stops, poseKeyframes.rotateY);
  const deviceRotateX = useTransform(progress, poseKeyframes.stops, poseKeyframes.rotateX);

  /* Opening header exits completely by 0.105 (well before Ch 1 at 0.14) and stays hidden through 1.0 */
  const heroOpacity = useTransform(progress, [0, 0.035, 0.105, 1], [1, 1, 0, 0]);
  const heroY = useTransform(progress, [0, 0.105, 1], [0, -76, -76]);
  const heroScale = useTransform(progress, [0, 0.105, 1], [1, 0.96, 0.96]);
  const scrubberOpacity = useTransform(progress, [0, 0.03, 0.08, 0.96, 1], [0, 0, 1, 1, 0]);

  const [heroHidden, setHeroHidden] = useState(false);
  const [activeBeat, setActiveBeat] = useState(0);
  const [darkDots, setDarkDots] = useState(false);
  const darkMid = (story.darkTransition[0] + story.darkTransition[1]) / 2;

  useMotionValueEvent(progress, "change", (latest) => {
    const nextHeroHidden = latest >= 0.11;
    setHeroHidden((prev) => (prev === nextHeroHidden ? prev : nextHeroHidden));

    let beat = 0;
    for (let i = 0; i < CHAPTER_WINDOWS.length; i += 1) {
      if (latest >= CHAPTER_WINDOWS[i][0]) beat = i + 1;
    }
    setActiveBeat((prev) => (prev === beat ? prev : beat));

    const isDarkNow = latest >= darkMid;
    setDarkDots((prev) => (prev === isDarkNow ? prev : isDarkNow));
  });

  /* Sized strictly relative to the inner safe frame W so the device always fits
     inside its opposite half with >=75px clear gutter at 1280/1440/1920px. */
  const deviceBoxClass =
    story.device === "iphone"
      ? "shrink-0 w-[min(24%,296px,31vh)] min-w-[210px]"
      : "shrink-0 w-[min(52%,610px,80vh)]";

  const scrubberLabels = useMemo(
    () => [
      zh ? "开篇" : "Intro",
      ...story.chapters.map((c) => `${c.indexLabel} · ${c.eyebrow[lang]}`),
    ],
    [story.chapters, lang, zh]
  );

  return (
    <div className="sticky top-0 h-dvh w-full overflow-x-clip">
      <div className="relative mx-auto h-full w-full max-w-[1320px] px-8 lg:px-14">
        {/* Shared Inner Safe Frame (exact width W for both text zones & deviceX %) */}
        <div className="relative h-full w-full">
          {/* Opening Keynote Header */}
          <motion.header
            aria-hidden={heroHidden}
            className="pointer-events-none absolute inset-x-0 top-[62px] z-20 flex flex-col items-center px-6 text-center xl:top-[76px]"
            style={{
              opacity: heroOpacity,
              y: heroY,
              scale: heroScale,
              visibility: heroHidden ? "hidden" : "visible",
            }}
          >
            {story.mascotIcon && (
              <div className="mb-3 h-12 w-12 overflow-hidden rounded-[14px] shadow-[0_14px_30px_-8px_rgba(11,25,41,0.38)] ring-1 ring-black/10 xl:mb-4 xl:h-14 xl:w-14 xl:rounded-[16px]">
                <Image
                  src={story.mascotIcon.src}
                  alt={story.mascotIcon.alt[lang]}
                  width={56}
                  height={56}
                  preload
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="mb-2.5 flex flex-wrap items-center justify-center gap-2 xl:mb-3.5">
              {story.badges[lang].map((badge, idx) => (
                <span
                  key={badge}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.06em] ${
                    idx === 0
                      ? "border border-black/10 bg-white/80 text-[#1d1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                      : "border border-black/[0.08] bg-black/[0.04] text-[#55565d]"
                  }`}
                >
                  {badge}
                </span>
              ))}
            </div>

            <h1
              className={`${styles.displayTitle} mb-2.5 max-w-4xl text-[clamp(2.4rem,5vw,4.6rem)] font-semibold leading-[1.03] tracking-[-0.036em] text-[#1d1d1f] xl:mb-3`}
            >
              {story.title[lang]}
            </h1>

            <p className="max-w-xl text-[clamp(0.95rem,1.25vw,1.16rem)] font-normal leading-[1.5] text-[#53545c]">
              {story.subtitle[lang]}
            </p>

            <div className="mt-3.5 flex items-center gap-2 text-[11px] font-medium tracking-[0.1em] text-[#6e6e73] uppercase xl:mt-5">
              <span>{zh ? "向下滚动，跟随界面展开" : "Scroll to explore"}</span>
              <span aria-hidden="true" className={`${styles.scrollCueDot} inline-block`}>
                ↓
              </span>
            </div>
          </motion.header>

          {/* Floating Editorial Chapters 01–05 */}
          {story.chapters.map((chapter, idx) => (
            <ChapterOverlay
              key={chapter.id}
              chapter={chapter}
              index={idx}
              holdAtEnd={idx === story.chapters.length - 1 && story.slug !== "offer-radar"}
              progress={progress}
              lang={lang}
              device={story.device}
            />
          ))}

          {/* Single Pinned Hardware Device */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <motion.div
              className="flex w-full items-center justify-center will-change-transform"
              style={{ x: deviceX, y: deviceY }}
            >
              <div className={`${styles.devicePerspective} ${deviceBoxClass}`}>
                <motion.div
                  className={`${styles.deviceTransform} w-full`}
                  style={{
                    scale: deviceScale,
                    rotateY: deviceRotateY,
                    rotateX: deviceRotateX,
                  }}
                >
                  {story.device === "iphone" ? (
                    <IPhoneStageFrame
                      screens={allScreens}
                      enterPoints={SCREEN_ENTER_POINTS}
                      progress={progress}
                      lang={lang}
                    />
                  ) : (
                    <MacBookStageFrame
                      screens={allScreens}
                      enterPoints={SCREEN_ENTER_POINTS}
                      progress={progress}
                      lang={lang}
                      darkTransition={story.darkTransition}
                      browserDomain={story.browserDomain}
                    />
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right-edge chapter progress scrubber */}
      <motion.div
        aria-label={zh ? "章节进度导航" : "Story chapters"}
        className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 xl:right-5 lg:flex"
        style={{ opacity: scrubberOpacity }}
      >
        {SCRUBBER_TARGETS.map((target, idx) => {
          const isCurrent = activeBeat === idx;
          return (
            <button
              key={scrubberLabels[idx]}
              type="button"
              onClick={() => onJumpToProgress(target)}
              title={scrubberLabels[idx]}
              aria-label={scrubberLabels[idx]}
              aria-current={isCurrent ? "step" : undefined}
              className="group flex h-4 w-4 items-center justify-center"
            >
              <span
                className={`block rounded-full transition-transform duration-300 ${
                  isCurrent ? "h-2.5 w-2.5 scale-110" : "h-1.5 w-1.5 group-hover:scale-125"
                }`}
                style={{
                  backgroundColor: isCurrent
                    ? darkDots
                      ? story.accentDark
                      : story.accentLight
                    : darkDots
                      ? "rgba(255,255,255,0.28)"
                      : "rgba(29,29,31,0.24)",
                }}
              />
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}

interface StackedStoryProps {
  story: ProjectStoryConfig;
  lang: Lang;
  reducedMotion: boolean;
}

/**
 * Graceful stacked degradation for mobile (<768px) and prefers-reduced-motion.
 * Uses a single continuous vertical CSS gradient across the entire story so
 * there are zero hard color cuts while guaranteeing crisp contrast per chapter.
 */
function StackedStory({ story, lang, reducedMotion }: StackedStoryProps) {
  const isHealth = story.slug === "health-agent";
  const continuousGradient = isHealth
    ? "linear-gradient(180deg, #fbfaf6 0%, #f6f0e6 22%, #eef4f8 40%, #f1eff7 58%, #10201c 70%, #0a1412 78%, #0b0f17 92%, #090d11 100%)"
    : "linear-gradient(180deg, #f7f8fc 0%, #f1f4fc 20%, #edf2fb 38%, #f7f4ec 56%, #eff0fa 73%, #111626 83%, #0b0e19 91%, #090c15 100%)";

  const frameWrapClass =
    story.device === "iphone"
      ? "mx-auto w-[min(76vw,300px)]"
      : "mx-auto w-full max-w-[640px]";

  const frameSizes =
    story.device === "iphone"
      ? "(max-width: 767px) 76vw, 300px"
      : "(max-width: 767px) 92vw, 640px";

  return (
    <div style={{ background: continuousGradient }}>
      {/* Opening */}
      <header className="mx-auto max-w-[920px] px-5 pb-16 pt-24 text-center md:pt-28">
        {story.mascotIcon && (
          <div className="mx-auto mb-5 h-16 w-16 overflow-hidden rounded-[18px] shadow-[0_14px_30px_-8px_rgba(11,25,41,0.34)] ring-1 ring-black/10">
            <Image
              src={story.mascotIcon.src}
              alt={story.mascotIcon.alt[lang]}
              width={64}
              height={64}
              preload
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          {story.badges[lang].map((badge, idx) => (
            <span
              key={badge}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.06em] ${
                idx === 0
                  ? "border border-black/10 bg-white/80 text-[#1d1d1f]"
                  : "border border-black/[0.08] bg-black/[0.04] text-[#55565d]"
              }`}
            >
              {badge}
            </span>
          ))}
        </div>

        <h1
          className={`${styles.displayTitle} mb-4 text-[clamp(2.35rem,9vw,4rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-[#1d1d1f]`}
        >
          {story.title[lang]}
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-[#4f5058] md:text-lg">
          {story.subtitle[lang]}
        </p>

        <div className={frameWrapClass}>
          <StaticDeviceFrame
            device={story.device}
            src={story.openingScreen.src}
            alt={story.openingScreen.alt[lang]}
            browserDomain={story.browserDomain}
            eager
            sizes={frameSizes}
          />
        </div>
      </header>

      {/* Stacked Chapters */}
      <div className="mx-auto max-w-[960px] space-y-24 px-5 py-12 pb-24 md:space-y-32">
        {story.chapters.map((chapter) => {
          const isDark = chapter.surface === "dark";
          const content = (
            <article className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
              <div className={chapter.textSide === "right" ? "md:order-2" : ""}>
                <div className="mb-3.5 flex items-center gap-3">
                  <span
                    className="font-mono text-[11px] font-semibold tracking-[0.14em]"
                    style={{ color: chapter.accent }}
                  >
                    {chapter.indexLabel}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-px w-5"
                    style={{ backgroundColor: chapter.accent, opacity: 0.45 }}
                  />
                  <span
                    className="text-[11px] font-semibold tracking-[0.14em] uppercase"
                    style={{ color: chapter.accent }}
                  >
                    {chapter.eyebrow[lang]}
                  </span>
                </div>

                <h2
                  className={`${styles.chapterHeadline} mb-4 text-[clamp(1.65rem,6vw,2.35rem)] font-semibold leading-[1.12] tracking-[-0.03em] ${
                    isDark ? "text-[#f5f5f7]" : "text-[#1d1d1f]"
                  }`}
                >
                  {chapter.headline[lang]}
                </h2>

                <p
                  className={`mb-6 text-[15px] leading-[1.78] md:text-base ${
                    isDark ? "text-[#b6b9c6]" : "text-[#4c4d54]"
                  }`}
                >
                  {chapter.body[lang]}
                </p>

                <ul className="flex flex-wrap gap-2">
                  {chapter.details[lang].map((item) => (
                    <li
                      key={item}
                      className={`rounded-full px-3 py-1.5 text-[12px] font-medium ${
                        isDark
                          ? "border border-white/[0.11] bg-white/[0.06] text-[#e2e4ec]"
                          : "border border-black/[0.08] bg-white/75 text-[#2b2c32]"
                      }`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={frameWrapClass}>
                <StaticDeviceFrame
                  device={story.device}
                  src={chapter.screen.src}
                  alt={chapter.screen.alt[lang]}
                  darkChrome={Boolean(chapter.screen.darkScreen)}
                  browserDomain={story.browserDomain}
                  sizes={frameSizes}
                />
              </div>
            </article>
          );

          if (reducedMotion) {
            return <div key={chapter.id}>{content}</div>;
          }

          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {content}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

interface GalleryLightboxProps {
  item: StoryGalleryItem | null;
  device: ProjectStoryConfig["device"];
  lang: Lang;
  onClose: () => void;
}

function GalleryLightbox({ item, device, lang, onClose }: GalleryLightboxProps) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onClose]);

  if (!item) return null;

  const isPhone = device === "iphone";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title[lang]}
      onClick={onClose}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/82 p-5 backdrop-blur-xl md:p-10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[90dvh] w-full max-w-[1040px] flex-col items-center gap-5"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={lang === "zh" ? "关闭预览" : "Close preview"}
          className="self-end rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/85 transition-colors hover:border-white/35 hover:text-white"
        >
          {lang === "zh" ? "关闭  ✕" : "Close  ✕"}
        </button>

        <div
          className={`relative overflow-hidden rounded-2xl border border-white/12 bg-[#0d1018] shadow-2xl ${
            isPhone
              ? "aspect-[560/1217] h-[min(72dvh,760px)] w-auto"
              : "aspect-[1800/1125] w-full max-w-[960px]"
          }`}
        >
          <Image
            src={item.src}
            alt={item.alt[lang]}
            fill
            sizes={isPhone ? "360px" : "(max-width: 1024px) 92vw, 960px"}
            className="object-contain"
          />
        </div>

        <div className="max-w-xl text-center">
          <p className="text-sm font-medium text-[#f5f5f7]">{item.title[lang]}</p>
          <p className="mt-1 text-xs leading-relaxed text-[#a1a1a8]">
            {item.caption[lang]}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ScrollStory({ story }: { story: ProjectStoryConfig }) {
  const { lang } = useLang();
  const zh = lang === "zh";
  const reducedMotion = Boolean(useReducedMotion());
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getDesktopServerSnapshot
  );

  const pinnedMode = isDesktop && !reducedMotion;
  const storyRef = useRef<HTMLElement>(null);
  const [lightboxItem, setLightboxItem] = useState<StoryGalleryItem | null>(null);

  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"],
  });

  /**
   * Deriving a clamped MotionValue via a function transformer intentionally
   * opts out of framer-motion 12's native WAAPI ViewTimeline acceleration,
   * which in Chrome desyncs non-[0..1] keyframes (causing hero ghosting and
   * backdrop reset once scrolled past the sticky target into the ending).
   */
  const clampedProgress = useTransform(scrollYProgress, (v) =>
    v <= 0 ? 0 : v >= 1 ? 1 : v
  );

  const handleJumpToProgress = useCallback(
    (targetProgress: number) => {
      const el = storyRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const scrollable = Math.max(0, el.offsetHeight - window.innerHeight);
      window.scrollTo({
        top: top + targetProgress * scrollable,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [reducedMotion]
  );

  const isPhone = story.device === "iphone";
  const offerWalkthrough = story.slug === "offer-radar";

  return (
    <div
      className={styles.storyRoot}
      style={{ backgroundColor: story.baseBackground }}
    >
      {/* Continuous GPU-composited backdrop layers for desktop pinned story */}
      {pinnedMode && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0"
        >
          {story.backdropLayers.map((layer, idx) => (
            <BackdropLayerView
              key={layer.id}
              layer={layer}
              index={idx}
              progress={clampedProgress}
            />
          ))}
        </div>
      )}

      {/* Adaptive floating top navigation */}
      <ProjectNav
        title={story.title}
        progress={clampedProgress}
        darkTransition={story.darkTransition}
        accentLight={story.accentLight}
        accentDark={story.accentDark}
      />

      <main className="relative z-10">
        {/* Continuous Scroll Story Region */}
        <section
          ref={storyRef}
          aria-label={story.title[lang]}
          className={pinnedMode ? "relative h-[640vh]" : "relative"}
        >
          {pinnedMode ? (
            <PinnedStageContent
              story={story}
              progress={clampedProgress}
              lang={lang}
              onJumpToProgress={handleJumpToProgress}
            />
          ) : (
            <StackedStory
              story={story}
              lang={lang}
              reducedMotion={reducedMotion}
            />
          )}
        </section>

        {/* Calm Ending: explicit solid ending surface matching the final backdrop stop */}
        <div
          className="relative z-10 text-[#f5f5f7]"
          style={{
            backgroundColor: story.endingBackground,
            marginBlockStart: offerWalkthrough && pinnedMode
              ? "calc(-1 * clamp(0px, (100svh - 42rem) * .55, 8rem))"
              : undefined,
          }}
        >
          <div className={`mx-auto max-w-[1160px] px-5 pb-24 md:px-8 ${offerWalkthrough ? "pt-10 md:pt-12" : "pt-20 md:pt-28"}`}>
            {/* Optional Product Walkthrough Film (Offer Radar) */}
            {story.video && (
              <section
                aria-label={story.video.title[lang]}
                className="mb-24 md:mb-32"
              >
                <div className="mb-10 max-w-2xl">
                  <p
                    className="mb-3 text-[11px] font-semibold tracking-[0.14em] uppercase"
                    style={{ color: story.accentDark }}
                  >
                    {story.video.eyebrow[lang]}
                  </p>
                  <h2 className="text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#f5f5f7]">
                    {story.video.title[lang]}
                  </h2>
                </div>

                <div className="overflow-hidden rounded-[22px] border border-white/[0.1] bg-[#06080f] p-2 shadow-[0_32px_90px_-24px_rgba(0,0,0,0.75)] md:p-3">
                  <video
                    className="aspect-video w-full rounded-[14px] bg-black"
                    aria-label={story.video.title[lang]}
                    poster={story.video.poster}
                    preload="none"
                    playsInline
                    controls
                  >
                    <source src={story.video.src} type="video/mp4" />
                  </video>
                </div>
                <p className="mt-4 text-xs text-[#8b8e9b]">
                  {story.video.caption[lang]}
                </p>
              </section>
            )}

            {/* Calm Screenshot Gallery */}
            <section
              aria-label={story.galleryHeading[lang]}
              className="mb-24 md:mb-32"
            >
              <div className="mb-12 max-w-2xl">
                <p
                  className="mb-3 text-[11px] font-semibold tracking-[0.14em] uppercase"
                  style={{ color: story.accentDark }}
                >
                  {zh ? "更多界面" : "GALLERY"}
                </p>
                <h2 className="mb-4 text-[clamp(1.85rem,3.6vw,2.9rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#f5f5f7]">
                  {story.galleryHeading[lang]}
                </h2>
                <p className="text-base leading-relaxed text-[#9ea2b0]">
                  {story.gallerySubheading[lang]}
                </p>
              </div>

              <div
                className={
                  isPhone
                    ? "grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4"
                    : "grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10"
                }
              >
                {story.gallery.map((item) => (
                  <button
                    key={item.src}
                    type="button"
                    onClick={() => setLightboxItem(item)}
                    className={`${styles.galleryCard} group flex flex-col rounded-3xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40`}
                  >
                    <div
                      className={
                        isPhone
                          ? "mx-auto mb-5 w-full max-w-[230px]"
                          : "mb-5 w-full"
                      }
                    >
                      <StaticDeviceFrame
                        device={story.device}
                        src={item.src}
                        alt={item.alt[lang]}
                        compact
                        darkChrome={Boolean(item.darkScreen)}
                        browserDomain={story.browserDomain}
                        sizes={
                          isPhone
                            ? "(max-width: 767px) 44vw, 230px"
                            : "(max-width: 767px) 92vw, 45vw"
                        }
                      />
                    </div>

                    <div className="px-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-[#f5f5f7]">
                          {item.title[lang]}
                        </h3>
                        <span
                          aria-hidden="true"
                          className="text-xs text-white/35 transition-opacity duration-200 group-hover:text-white/80"
                        >
                          ↗
                        </span>
                      </div>
                      <p className="mt-1.5 text-[13px] leading-[1.65] text-[#9599a8]">
                        {item.caption[lang]}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Typographic Architecture Specs */}
            <section
              aria-label={story.statsHeading[lang]}
              className="mb-20 border-t border-white/[0.08] pt-16 md:mb-24 md:pt-20"
            >
              <p
                className="mb-3 text-[11px] font-semibold tracking-[0.14em] uppercase"
                style={{ color: story.accentDark }}
              >
                {zh ? "关键指标" : "BY THE NUMBERS"}
              </p>
              <h2 className="mb-12 text-[clamp(1.65rem,3vw,2.4rem)] font-semibold tracking-[-0.03em] text-[#f5f5f7]">
                {story.statsHeading[lang]}
              </h2>

              <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {story.stats.map((stat) => (
                  <div
                    key={stat.value + stat.label.en}
                    className="border-t border-white/[0.09] pt-5"
                  >
                    <dt className="text-[clamp(2.1rem,3.4vw,2.85rem)] font-semibold leading-none tracking-[-0.035em] text-white">
                      {stat.value}
                    </dt>
                    <dd className="mt-2.5 text-sm font-medium text-[#d7dae4]">
                      {stat.label[lang]}
                    </dd>
                    <dd className="mt-1.5 text-[13px] leading-relaxed text-[#8d91a0]">
                      {stat.note[lang]}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Tech Stack, Platform Meta & Status */}
            <section
              aria-label={zh ? "技术栈与项目状态" : "Technology and status"}
              className="mb-16 grid gap-10 border-t border-white/[0.08] pt-14 md:grid-cols-[1.2fr_1fr] md:gap-14"
            >
              <div>
                <h2 className="mb-4 text-xs font-semibold tracking-[0.12em] text-[#8d91a0] uppercase">
                  {zh ? "技术栈" : "Tools & Stack"}
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {story.techTags[lang].map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-white/[0.1] bg-white/[0.04] px-3.5 py-1.5 text-sm text-[#d4d7e1]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                {story.metaPills && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {story.metaPills[lang].map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-white/[0.07] px-3 py-1 text-xs text-[#989ca9]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="mb-2 text-xs font-semibold tracking-[0.12em] text-[#8d91a0] uppercase">
                    {zh ? "当前进展" : "Status"}
                  </h2>
                  <p className="text-sm leading-relaxed text-[#d4d7e1]">
                    {story.status[lang]}
                  </p>
                </div>

                {story.disclaimer && (
                  <p className="text-xs leading-relaxed text-[#7e8290]">
                    {story.disclaimer[lang]}
                  </p>
                )}
              </div>
            </section>

            {/* Quiet Footer Navigation */}
            <footer className="flex flex-col justify-between gap-6 border-t border-white/[0.08] pt-10 sm:flex-row sm:items-center">
              <Link
                href="/#projects"
                className="group inline-flex items-center gap-2 text-sm font-medium text-[#9da1af] transition-colors hover:text-white"
              >
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-200 group-hover:-translate-x-0.5"
                >
                  ←
                </span>
                <span>{zh ? "返回全部项目" : "Back to all projects"}</span>
              </Link>

              <Link
                href={story.sibling.href}
                className="group inline-flex items-center gap-3 text-sm font-medium text-[#d8dbe6] transition-colors hover:text-white"
              >
                <span className="text-xs tracking-[0.08em] text-[#848897] uppercase">
                  {story.sibling.eyebrow[lang]}
                </span>
                <span>{story.sibling.title[lang]}</span>
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-200 group-hover:translate-x-0.5"
                  style={{ color: story.accentDark }}
                >
                  →
                </span>
              </Link>
            </footer>
          </div>
        </div>
      </main>

      <GalleryLightbox
        item={lightboxItem}
        device={story.device}
        lang={lang}
        onClose={() => setLightboxItem(null)}
      />
    </div>
  );
}
