"use client";

import { createContext, useCallback, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Lang } from "@/lib/i18n";
import { langFromPath, localizePath, stripLocale } from "@/lib/locale";

const LS_KEY = "wz-lang";

function readPreference(): Lang | null {
  try {
    const v = localStorage.getItem(LS_KEY);
    return v === "zh" || v === "en" ? v : null;
  } catch {
    return null;
  }
}

function writePreference(next: Lang) {
  try {
    localStorage.setItem(LS_KEY, next);
  } catch {
    // ignore
  }
}

interface LangContextValue {
  lang: Lang;
  toggle: () => void;
  /** Localise an internal English path such as "/university" or "/#about". */
  href: (path: string) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  toggle: () => {},
  href: (path) => path,
});

/**
 * The language comes from the URL (/zh/... is Chinese), so the server renders
 * the right language. The visitor's last choice is remembered and applied when
 * they land on an English page again.
 */
export function LangProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const lang = langFromPath(pathname);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  useEffect(() => {
    if (lang === "en" && readPreference() === "zh") {
      router.replace(localizePath(pathname, "zh") + window.location.hash);
    }
    // Only on first load: later switches go through toggle().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = useCallback(() => {
    const next: Lang = lang === "en" ? "zh" : "en";
    writePreference(next);
    router.push(localizePath(stripLocale(pathname), next) + window.location.hash, { scroll: false });
  }, [lang, pathname, router]);

  const href = useCallback((path: string) => localizePath(path, lang), [lang]);

  return (
    <LangContext.Provider value={{ lang, toggle, href }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}
