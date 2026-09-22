import { Platform } from "react-native";
import { radius } from "./radius";
import { spacing } from "./spacing";

/**
 * Design tokens for text fields.
 * Keep fontSize >= 16 on iOS for parity / zoom safety.
 *
 * Do not put lineHeight on iOS TextInput — it clips ascenders (worse with
 * bundled Noto Sans). Android can keep a lineHeight for vertical rhythm.
 */
export const inputTokens = {
  fontSize: 16,
  /** Android-only; leave unset on iOS TextInput. */
  lineHeight: Platform.select({ ios: undefined, android: 22, default: 22 }),
  minHeight: Platform.select({ ios: 48, android: 48, default: 48 })!,
  paddingVertical: Platform.select({ ios: 12, android: 10, default: 12 })!,
  paddingHorizontal: spacing.md + 2,
  radius: radius.sm,
  radiusComfortable: 10,
  radiusSoft: 16,
  labelSize: 14,
  helperSize: 12,
  iconSize: 22,
  authRowMinHeight: Platform.select({ ios: 58, android: 56, default: 58 })!,
  softFontSize: 15,
  softPaddingHorizontal: 18,
  softPaddingVertical: Platform.select({ ios: 14, android: 12, default: 14 })!,
} as const;
