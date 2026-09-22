import type { ReactNode } from "react";
import type { TextStyle } from "react-native";

/**
 * Myanmar glyphs stack combining marks above/below the base character.
 * Latin-tuned line heights (~1.25–1.5) clip those marks; ~1.85 leaves room.
 */
export const MYANMAR_LINE_HEIGHT_MULTIPLIER = 1.85;

/** Unicode Myanmar blocks (basic + extended-A). */
export const MYANMAR_CHARACTERS = /[\u1000-\u109F\uAA60-\uAA7F]/u;

/**
 * Map CSS-style fontWeight → embedded NotoSansMyanmar file.
 * Weight must live in the file name on iOS — synthesizing bold breaks shaping.
 */
export const MYANMAR_FONT_BY_WEIGHT: Record<string, string> = {
  "100": "NotoSansMyanmar-Regular",
  "200": "NotoSansMyanmar-Regular",
  "300": "NotoSansMyanmar-Regular",
  "400": "NotoSansMyanmar-Regular",
  normal: "NotoSansMyanmar-Regular",
  "500": "NotoSansMyanmar-Medium",
  "600": "NotoSansMyanmar-SemiBold",
  "700": "NotoSansMyanmar-Bold",
  bold: "NotoSansMyanmar-Bold",
  "800": "NotoSansMyanmar-ExtraBold",
  "900": "NotoSansMyanmar-ExtraBold",
};

/**
 * Latin / English UI: same Noto Sans files on iOS and Android.
 * Weight lives in the file name — keep fontWeight "normal" when applying.
 */
export const LATIN_FONT_BY_WEIGHT: Record<string, string> = {
  "100": "NotoSans-Regular",
  "200": "NotoSans-Regular",
  "300": "NotoSans-Regular",
  "400": "NotoSans-Regular",
  normal: "NotoSans-Regular",
  "500": "NotoSans-Medium",
  "600": "NotoSans-SemiBold",
  "700": "NotoSans-Bold",
  bold: "NotoSans-Bold",
  "800": "NotoSans-ExtraBold",
  "900": "NotoSans-ExtraBold",
};

/** Language codes that mean the UI chrome is Myanmar. */
export function isMyanmarUiLanguage(language: string | undefined): boolean {
  if (!language) return false;
  const base = language.toLowerCase().split("-")[0];
  return base === "mm" || base === "my" || base === "bur";
}

export function resolveMyanmarFontFamily(
  fontWeight: TextStyle["fontWeight"] | undefined,
): string {
  const key = String(fontWeight ?? "400");
  return MYANMAR_FONT_BY_WEIGHT[key] ?? "NotoSansMyanmar-Regular";
}

export function resolveLatinFontFamily(
  fontWeight: TextStyle["fontWeight"] | undefined,
): string {
  const key = String(fontWeight ?? "400");
  return LATIN_FONT_BY_WEIGHT[key] ?? "NotoSans-Regular";
}

export function myanmarSafeLineHeight(
  fontSize: number,
  currentLineHeight = 0,
): number {
  return Math.max(
    currentLineHeight,
    Math.ceil(fontSize * MYANMAR_LINE_HEIGHT_MULTIPLIER),
  );
}

/**
 * Walk strings and nested React children.
 * Does not treat bare numbers as Myanmar.
 */
export function containsMyanmarText(value: ReactNode): boolean {
  if (typeof value === "string") return MYANMAR_CHARACTERS.test(value);
  if (typeof value === "number" || value == null || typeof value === "boolean") {
    return false;
  }
  if (Array.isArray(value)) return value.some(containsMyanmarText);
  if (typeof value === "object" && "props" in value) {
    const props = (value as { props?: { children?: ReactNode } }).props;
    return containsMyanmarText(props?.children);
  }
  return false;
}
