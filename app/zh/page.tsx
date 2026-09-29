import type { Metadata } from "next";
import { localeAlternates } from "@/lib/locale";

export { default } from "../page";

export const metadata: Metadata = {
  alternates: localeAlternates("/", "zh"),
};
