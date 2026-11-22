"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import type { Lang } from "@/lib/i18n";
import type { DeviceKind, StoryScreen } from "@/lib/projectData/storyTypes";
import styles from "./projectStory.module.css";

/* Intrinsic screenshot dimensions. Screenshots render at their true aspect
   ratio (object-fit: contain), never `fill` + `object-cover`, so a missing or
   late stylesheet can never stretch them to the viewport. */
const IPHONE_SHOT = { width: 560, height: 1217 } as const;
const MACBOOK_SHOT = { width: 1800, height: 1125 } as const;

/* Critical containment/sizing is inline so it holds even without external CSS. */
const IPHONE_CHASSIS_STYLE: CSSProperties = {
  position: "relative",
  boxSizing: "border-box",
  width: "100%",
  // ≈520–600px tall at 1440x900, ≤65vh everywhere, ≤80% width on phones.
  maxWidth: "min(100%, 78vw, 30svh, 17rem)",
  marginInline: "auto",
};

const MACBOOK_WRAPPER_STYLE: CSSProperties = {
  position: "relative",
  boxSizing: "border-box",
  width: "100%",
  // Screen ≈ 0.625w plus ~64px of chrome → whole device stays ≤65vh tall.
  maxWidth: "min(100%, 96vw, calc((65svh - 64px) * 1.6))",
  marginInline: "auto",
};

const IPHONE_VIEWPORT_STYLE: CSSProperties = {
  position: "relative",
  width: "100%",
  aspectRatio: `${IPHONE_SHOT.width} / ${IPHONE_SHOT.height}`,
  overflow: "hidden",
};

const MACBOOK_VIEWPORT_STYLE: CSSProperties = {
  position: "relative",
  width: "100%",
  aspectRatio: `${MACBOOK_SHOT.width} / ${MACBOOK_SHOT.height}`,
  overflow: "hidden",
};

const SHOT_IMG_STYLE: CSSProperties = {
  display: "block",
  width: "100%",
  height: "100%",
  maxWidth: "100%",
  objectFit: "contain",
  objectPosition: "top center",
};

interface ScreenSlideProps {
  screen: StoryScreen;
  index: number;
  enterAt: number;
  coveredAt: number | null;
  progress: MotionValue<number>;
  lang: Lang;
  sizes: string;
  shot: { width: number; height: number };
}

/**
 * Renders one screenshot inside a pinned device viewport.
 * Every transform range spans [0, ..., 1] explicitly and runs on a non-WAAPI
 * clamped scroll MotionValue so cross-fades stay locked in sync with chapters.
 */
function ScreenSlide({
  screen,
  index,
  enterAt,
  coveredAt,
  progress,
  lang,
  sizes,
  shot,
}: ScreenSlideProps) {
  const isFirst = index === 0;
  const fadeWindow = 0.045;
  const inStart = Math.max(0.005, enterAt);
  const inEnd = Math.min(0.98, enterAt + fadeWindow);
  const outEnd = coveredAt !== null ? Math.min(0.995, coveredAt + 0.012) : null;

  const opacityRange = isFirst
    ? coveredAt !== null && outEnd !== null
      ? [0, coveredAt, outEnd, 1]
      : [0, 1]
    : coveredAt !== null && outEnd !== null
      ? [0, inStart, inEnd, coveredAt, outEnd, 1]
      : [0, inStart, inEnd, 1];

  const opacityOutput = isFirst
    ? coveredAt !== null && outEnd !== null
      ? [1, 1, 0, 0]
      : [1, 1]
    : coveredAt !== null && outEnd !== null
      ? [0, 0, 1, 1, 0, 0]
      : [0, 0, 1, 1];

  const yRange = isFirst ? [0, 1] : [0, inStart, inEnd, 1];
  const yOutput = isFirst ? [0, 0] : [16, 16, 0, 0];

  const scaleRange = isFirst ? [0, 1] : [0, inStart, inEnd, 1];
  const scaleOutput = isFirst ? [1, 1] : [1.02, 1.02, 1, 1];

  const opacity = useTransform(progress, opacityRange, opacityOutput);
  const y = useTransform(progress, yRange, yOutput);
  const scale = useTransform(progress, scaleRange, scaleOutput);

  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={{ position: "absolute", inset: 0, opacity, y, scale, zIndex: index + 1 }}
    >
      <Image
        src={screen.src}
        alt={screen.alt[lang]}
        width={shot.width}
        height={shot.height}
        sizes={sizes}
        preload={isFirst}
        loading={isFirst ? undefined : "lazy"}
        className="select-none"
        style={SHOT_IMG_STYLE}
        draggable={false}
      />
    </motion.div>
  );
}

interface StageFrameProps {
  screens: StoryScreen[];
  enterPoints: number[];
  progress: MotionValue<number>;
  lang: Lang;
  darkTransition?: [number, number];
  browserDomain?: string;
}

export function IPhoneStageFrame({
  screens,
  enterPoints,
  progress,
  lang,
}: StageFrameProps) {
  const sizes = "(max-width: 767px) 78vw, 272px";

  return (
    <div className={styles.iphoneChassis} style={IPHONE_CHASSIS_STYLE}>
      <span aria-hidden="true" className={`${styles.iphoneButton} ${styles.iphoneActionBtn}`} />
      <span aria-hidden="true" className={`${styles.iphoneButton} ${styles.iphoneVolUpBtn}`} />
      <span aria-hidden="true" className={`${styles.iphoneButton} ${styles.iphoneVolDownBtn}`} />
      <span aria-hidden="true" className={`${styles.iphoneButton} ${styles.iphonePowerBtn}`} />

      <div className={styles.iphoneBezel}>
        <div className={styles.iphoneViewport} style={IPHONE_VIEWPORT_STYLE}>
          {screens.map((screen, idx) => {
            const nextEnter = idx < screens.length - 1 ? enterPoints[idx + 1] : null;
            const coveredAt = nextEnter !== null ? Math.min(0.985, nextEnter + 0.048) : null;
            return (
              <ScreenSlide
                key={screen.src}
                screen={screen}
                index={idx}
                enterAt={enterPoints[idx]}
                coveredAt={coveredAt}
                progress={progress}
                lang={lang}
                sizes={sizes}
                shot={IPHONE_SHOT}
              />
            );
          })}
          <div aria-hidden="true" className={styles.iphoneGlassSheen} />
        </div>
      </div>
    </div>
  );
}

function BrowserTrafficLights() {
  return (
    <div className="flex items-center gap-[5px]" aria-hidden="true">
      <span className="h-[7px] w-[7px] rounded-full bg-[#ff5f57]/85" />
      <span className="h-[7px] w-[7px] rounded-full bg-[#febc2e]/85" />
      <span className="h-[7px] w-[7px] rounded-full bg-[#28c840]/85" />
    </div>
  );
}

export function MacBookStageFrame({
  screens,
  enterPoints,
  progress,
  lang,
  darkTransition = [0.81, 0.87],
  browserDomain = "offerradar.cn",
}: StageFrameProps) {
  const sizes = "(max-width: 767px) 92vw, (max-width: 1280px) 52vw, 620px";
  const darkChromeOpacity = useTransform(
    progress,
    [0, darkTransition[0], darkTransition[1], 1],
    [0, 0, 1, 1]
  );

  return (
    <div className={styles.macbookWrapper} style={MACBOOK_WRAPPER_STYLE}>
      <div className={styles.macbookLid}>
        <span aria-hidden="true" className={styles.macbookCamera} />
        <div className={styles.macbookScreenWrap}>
          {/* Adaptive macOS browser bar: light layer underneath, dark layer fades in */}
          <div className="relative h-[26px]">
            <div className={`${styles.browserBar} ${styles.browserBarLight} absolute inset-0`}>
              <BrowserTrafficLights />
              <span className="rounded-full bg-black/[0.045] px-3 py-[2px] text-[10px] font-medium tracking-[0.02em] text-slate-600/80">
                {browserDomain}
              </span>
              <span className="w-8" aria-hidden="true" />
            </div>
            <motion.div
              aria-hidden="true"
              className={`${styles.browserBar} ${styles.browserBarDark} absolute inset-0`}
              style={{ opacity: darkChromeOpacity }}
            >
              <BrowserTrafficLights />
              <span className="rounded-full bg-white/[0.07] px-3 py-[2px] text-[10px] font-medium tracking-[0.02em] text-slate-300/80">
                {browserDomain}
              </span>
              <span className="w-8" />
            </motion.div>
          </div>

          <div className={styles.macbookViewport} style={MACBOOK_VIEWPORT_STYLE}>
            {screens.map((screen, idx) => {
              const nextEnter = idx < screens.length - 1 ? enterPoints[idx + 1] : null;
              const coveredAt = nextEnter !== null ? Math.min(0.985, nextEnter + 0.048) : null;
              return (
                <ScreenSlide
                  key={screen.src}
                  screen={screen}
                  index={idx}
                  enterAt={enterPoints[idx]}
                  coveredAt={coveredAt}
                  progress={progress}
                  lang={lang}
                  sizes={sizes}
                  shot={MACBOOK_SHOT}
                />
              );
            })}
            <div aria-hidden="true" className={styles.macbookGlassSheen} />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className={styles.macbookDeck} />
    </div>
  );
}

interface StaticDeviceFrameProps {
  device: DeviceKind;
  src: string;
  alt: string;
  compact?: boolean;
  darkChrome?: boolean;
  browserDomain?: string;
  eager?: boolean;
  sizes: string;
}

export function StaticDeviceFrame({
  device,
  src,
  alt,
  compact = false,
  darkChrome = false,
  browserDomain = "offerradar.cn",
  eager = false,
  sizes,
}: StaticDeviceFrameProps) {
  if (device === "iphone") {
    return (
      <div
        className={`${styles.iphoneChassis} ${compact ? styles.iphoneChassisCompact : ""}`}
        style={IPHONE_CHASSIS_STYLE}
      >
        {!compact && (
          <>
            <span aria-hidden="true" className={`${styles.iphoneButton} ${styles.iphoneActionBtn}`} />
            <span aria-hidden="true" className={`${styles.iphoneButton} ${styles.iphoneVolUpBtn}`} />
            <span aria-hidden="true" className={`${styles.iphoneButton} ${styles.iphoneVolDownBtn}`} />
            <span aria-hidden="true" className={`${styles.iphoneButton} ${styles.iphonePowerBtn}`} />
          </>
        )}
        <div className={styles.iphoneBezel}>
          <div className={styles.iphoneViewport} style={IPHONE_VIEWPORT_STYLE}>
            <Image
              src={src}
              alt={alt}
              width={IPHONE_SHOT.width}
              height={IPHONE_SHOT.height}
              sizes={sizes}
              preload={eager}
              loading={eager ? undefined : "lazy"}
              className="select-none"
              style={SHOT_IMG_STYLE}
              draggable={false}
            />
            <div aria-hidden="true" className={styles.iphoneGlassSheen} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.macbookWrapper} style={MACBOOK_WRAPPER_STYLE}>
      <div className={`${styles.macbookLid} ${compact ? styles.macbookLidCompact : ""}`}>
        {!compact && <span aria-hidden="true" className={styles.macbookCamera} />}
        <div className={styles.macbookScreenWrap}>
          <div
            className={`${styles.browserBar} ${compact ? styles.browserBarCompact : ""} ${
              darkChrome ? styles.browserBarDark : styles.browserBarLight
            }`}
          >
            <BrowserTrafficLights />
            <span
              className={`rounded-full px-2.5 py-[1px] text-[10px] font-medium tracking-[0.02em] ${
                darkChrome
                  ? "bg-white/[0.07] text-slate-300/80"
                  : "bg-black/[0.045] text-slate-600/80"
              }`}
            >
              {browserDomain}
            </span>
            <span className="w-7" aria-hidden="true" />
          </div>
          <div className={styles.macbookViewport} style={MACBOOK_VIEWPORT_STYLE}>
            <Image
              src={src}
              alt={alt}
              width={MACBOOK_SHOT.width}
              height={MACBOOK_SHOT.height}
              sizes={sizes}
              preload={eager}
              loading={eager ? undefined : "lazy"}
              className="select-none"
              style={SHOT_IMG_STYLE}
              draggable={false}
            />
            <div aria-hidden="true" className={styles.macbookGlassSheen} />
          </div>
        </div>
      </div>
      {!compact && <div aria-hidden="true" className={styles.macbookDeck} />}
    </div>
  );
}
