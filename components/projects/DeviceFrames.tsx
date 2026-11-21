"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";
import type { Lang } from "@/lib/i18n";
import type { DeviceKind, StoryScreen } from "@/lib/projectData/storyTypes";
import styles from "./projectStory.module.css";

interface ScreenSlideProps {
  screen: StoryScreen;
  index: number;
  enterAt: number;
  coveredAt: number | null;
  progress: MotionValue<number>;
  lang: Lang;
  sizes: string;
}

/**
 * Renders one screenshot inside a pinned device viewport.
 * Incoming screens glide gently over the fully opaque outgoing screen before
 * the outgoing screen drops to opacity 0, preventing mid-fade bleed-through.
 */
function ScreenSlide({
  screen,
  index,
  enterAt,
  coveredAt,
  progress,
  lang,
  sizes,
}: ScreenSlideProps) {
  const isFirst = index === 0;
  const fadeWindow = 0.045;
  const inStart = Math.max(0, enterAt - 0.01);
  const inEnd = Math.min(0.99, enterAt + fadeWindow);

  const opacityRange = isFirst
    ? coveredAt !== null
      ? [0, coveredAt, Math.min(1, coveredAt + 0.015)]
      : [0, 1]
    : coveredAt !== null
      ? [inStart, inEnd, coveredAt, Math.min(1, coveredAt + 0.015)]
      : [inStart, inEnd, 1];

  const opacityOutput = isFirst
    ? coveredAt !== null
      ? [1, 1, 0]
      : [1, 1]
    : coveredAt !== null
      ? [0, 1, 1, 0]
      : [0, 1, 1];

  const yRange = isFirst ? [0, 1] : [inStart, inEnd];
  const yOutput = isFirst ? [0, 0] : [16, 0];

  const scaleRange = isFirst ? [0, 1] : [inStart, inEnd];
  const scaleOutput = isFirst ? [1, 1] : [1.022, 1];

  const opacity = useTransform(progress, opacityRange, opacityOutput);
  const y = useTransform(progress, yRange, yOutput);
  const scale = useTransform(progress, scaleRange, scaleOutput);

  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={{ opacity, y, scale, zIndex: index + 1 }}
    >
      <Image
        src={screen.src}
        alt={screen.alt[lang]}
        fill
        sizes={sizes}
        preload={isFirst}
        loading={isFirst ? undefined : "lazy"}
        className="object-cover object-top select-none"
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
  const sizes = "(max-width: 767px) 76vw, 340px";

  return (
    <div className={styles.iphoneChassis}>
      <span aria-hidden="true" className={`${styles.iphoneButton} ${styles.iphoneActionBtn}`} />
      <span aria-hidden="true" className={`${styles.iphoneButton} ${styles.iphoneVolUpBtn}`} />
      <span aria-hidden="true" className={`${styles.iphoneButton} ${styles.iphoneVolDownBtn}`} />
      <span aria-hidden="true" className={`${styles.iphoneButton} ${styles.iphonePowerBtn}`} />

      <div className={styles.iphoneBezel}>
        <div className={styles.iphoneViewport}>
          {screens.map((screen, idx) => {
            const nextEnter = idx < screens.length - 1 ? enterPoints[idx + 1] : null;
            const coveredAt = nextEnter !== null ? Math.min(0.99, nextEnter + 0.048) : null;
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
  darkTransition = [0.77, 0.83],
  browserDomain = "offerradar.cn",
}: StageFrameProps) {
  const sizes = "(max-width: 767px) 92vw, (max-width: 1280px) 54vw, 760px";
  const darkChromeOpacity = useTransform(progress, darkTransition, [0, 1]);

  return (
    <div className={styles.macbookWrapper}>
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

          <div className={styles.macbookViewport}>
            {screens.map((screen, idx) => {
              const nextEnter = idx < screens.length - 1 ? enterPoints[idx + 1] : null;
              const coveredAt = nextEnter !== null ? Math.min(0.99, nextEnter + 0.048) : null;
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
      <div className={`${styles.iphoneChassis} ${compact ? styles.iphoneChassisCompact : ""}`}>
        {!compact && (
          <>
            <span aria-hidden="true" className={`${styles.iphoneButton} ${styles.iphoneActionBtn}`} />
            <span aria-hidden="true" className={`${styles.iphoneButton} ${styles.iphoneVolUpBtn}`} />
            <span aria-hidden="true" className={`${styles.iphoneButton} ${styles.iphoneVolDownBtn}`} />
            <span aria-hidden="true" className={`${styles.iphoneButton} ${styles.iphonePowerBtn}`} />
          </>
        )}
        <div className={styles.iphoneBezel}>
          <div className={styles.iphoneViewport}>
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              preload={eager}
              loading={eager ? undefined : "lazy"}
              className="object-cover object-top select-none"
              draggable={false}
            />
            <div aria-hidden="true" className={styles.iphoneGlassSheen} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.macbookWrapper}>
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
          <div className={styles.macbookViewport}>
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              preload={eager}
              loading={eager ? undefined : "lazy"}
              className="object-cover object-top select-none"
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
