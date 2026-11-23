"use client";

import { useSyncExternalStore } from "react";
import CindyAvatar from "@/components/home/CindyAvatar";
import SiteSwitchLink from "@/components/SiteSwitchLink";

/**
 * Hero entry to the Cindy tour. Two design variants share one markup (styles: app/(main)/main.css):
 *   "a" — frosted-glass capsule (default)
 *   "b" — ink capsule with a hairline edge and a divided arrow
 * SWITCH_VARIANT is the shipped choice. For side-by-side review only, `?switch=a|b` or
 * localStorage "wz-switch-variant" overrides it in this browser; neither touches wz-tour.
 */
export type SwitchVariant = "a" | "b";
export const SWITCH_VARIANT: SwitchVariant = "a";
const PREVIEW_KEY = "wz-switch-variant";

function isVariant(value: string | null): value is SwitchVariant {
  return value === "a" || value === "b";
}

function readVariant(): SwitchVariant {
  try {
    const query = new URLSearchParams(window.location.search).get("switch");
    if (isVariant(query)) return query;
    const saved = localStorage.getItem(PREVIEW_KEY);
    if (isVariant(saved)) return saved;
  } catch {
    // storage or URL unavailable: use the default
  }
  return SWITCH_VARIANT;
}

const noSubscription = () => () => {};

export default function HeroSwitch({ label }: { label: string }) {
  // Server render and hydration use the default; a preview override applies right after.
  const variant = useSyncExternalStore(noSubscription, readVariant, () => SWITCH_VARIANT);

  return (
    <SiteSwitchLink to="cindy" variant={variant} className="hero-switch">
      <span className="hero-switch__avatar" aria-hidden="true">
        <CindyAvatar size={13} />
      </span>
      <span className="hero-switch__label">{label}</span>
      <span className="hero-switch__sep" aria-hidden="true" />
      <span className="hero-switch__arrow" aria-hidden="true">→</span>
    </SiteSwitchLink>
  );
}
