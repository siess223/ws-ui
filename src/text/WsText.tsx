import type { ReactNode } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  type TextProps,
  type TextStyle,
} from "react-native";
import {
  containsMyanmarText,
  myanmarSafeLineHeight,
  resolveLatinFontFamily,
  resolveMyanmarFontFamily,
} from "../theme/myanmarTypography";

export {
  containsMyanmarText,
  myanmarSafeLineHeight,
  resolveLatinFontFamily,
  resolveMyanmarFontFamily,
} from "../theme/myanmarTypography";

/** True when children need extra vertical room for stacked Myanmar marks. */
export function needsMyanmarSafeLineHeight(value: ReactNode): boolean {
  return containsMyanmarText(value);
}

function isBundledFontFamily(fontFamily: string | undefined): boolean {
  return (
    typeof fontFamily === "string" &&
    (fontFamily.startsWith("NotoSansMyanmar") ||
      fontFamily.startsWith("NotoSans-"))
  );
}

/**
 * Text that picks Noto Sans / Noto Sans Myanmar from the children.
 * Weight is carried by the font file name.
 */
export default function WsText({ children, style, ...props }: TextProps) {
  const needsMyanmarLayout = needsMyanmarSafeLineHeight(children);
  const flattenedStyle = StyleSheet.flatten(style) as TextStyle | undefined;
  const fontSize =
    typeof flattenedStyle?.fontSize === "number" ? flattenedStyle.fontSize : 14;
  const currentLineHeight =
    typeof flattenedStyle?.lineHeight === "number"
      ? flattenedStyle.lineHeight
      : 0;

  const alreadyBundled = isBundledFontFamily(flattenedStyle?.fontFamily);
  const fontFamily = alreadyBundled
    ? flattenedStyle!.fontFamily!
    : needsMyanmarLayout
      ? resolveMyanmarFontFamily(flattenedStyle?.fontWeight)
      : resolveLatinFontFamily(flattenedStyle?.fontWeight);

  const platformStyle: TextStyle = {
    fontFamily,
    fontWeight: "normal",
    ...(Platform.OS === "android" ? { includeFontPadding: false } : null),
  };

  if (needsMyanmarLayout) {
    platformStyle.lineHeight = myanmarSafeLineHeight(
      fontSize,
      currentLineHeight,
    );
  }

  return (
    <Text {...props} style={[style, platformStyle]}>
      {children}
    </Text>
  );
}
