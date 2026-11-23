"use client";

import type { ReactNode } from "react";
import { useLang } from "@/context/LangContext";

export function Localized({ en, zh }: { en: ReactNode; zh: ReactNode }) {
  const { lang } = useLang();
  return lang === "zh" ? zh : en;
}
