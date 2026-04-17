"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import type { Lang } from "@/lib/i18n";

const LS_KEY = "wz-lang";
const EVT    = "wz-lang-change";

function readLang(): Lang {
  try {
    const v = localStorage.getItem(LS_KEY);
    return v === "zh" ? "zh" : "en";
  } catch {
    return "en";
  }
}

function writeLang(next: Lang) {
  try {
    localStorage.setItem(LS_KEY, next);
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event(EVT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === LS_KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(EVT, cb);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(EVT, cb);
  };
}

const getServerSnapshot: () => Lang = () => "en";

interface LangContextValue {
  lang: Lang;
  toggle: () => void;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  toggle: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, readLang, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  const toggle = () => writeLang(lang === "en" ? "zh" : "en");

  return (
    <LangContext.Provider value={{ lang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}
