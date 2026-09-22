import { Platform } from "react-native";

/** Shared layout tokens for app bars and toolbars. */
export const headerToolbar = {
  height: Platform.select({ ios: 52, android: 48, default: 48 })!,
  paddingVertical: Platform.select({ ios: 8, android: 6, default: 6 })!,
  sideButtonSize: 40,
  titleFontSize: 18,
} as const;
