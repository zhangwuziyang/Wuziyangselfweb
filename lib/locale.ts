import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n";

/** Chinese pages live under /zh; English pages keep the unprefixed paths. */
export const ZH_PREFIX = "/zh";

export function langFromPath(pathname: string | null): Lang {
  return pathname === ZH_PREFIX || pathname?.startsWith(`${ZH_PREFIX}/`) ? "zh" : "en";
}

/** "/zh/university" → "/university", "/zh" → "/" */
export function stripLocale(pathname: string): string {
  if (langFromPath(pathname) === "en") return pathname;
  return pathname.slice(ZH_PREFIX.length) || "/";
}

/** Map an English path (optionally with a #hash) to its page in `lang`. */
export function localizePath(path: string, lang: Lang): string {
  if (lang === "en" || !path.startsWith("/")) return path;
  if (path === "/") return ZH_PREFIX;
  if (path.startsWith("/#")) return `${ZH_PREFIX}${path.slice(1)}`;
  return `${ZH_PREFIX}${path}`;
}

/** Canonical URL plus hreflang links for a page that exists in both languages. */
export function localeAlternates(path: string, lang: Lang): Metadata["alternates"] {
  return {
    canonical: localizePath(path, lang),
    languages: {
      en: path,
      "zh-CN": localizePath(path, "zh"),
      "x-default": path,
    },
  };
}
