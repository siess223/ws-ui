import { Platform, StyleSheet } from "react-native";
import { inputTokens } from "./input";

/** Soft bordered controls. */
export const softControlStyles = StyleSheet.create({
  input: {
    borderRadius: inputTokens.radiusSoft,
    paddingHorizontal: inputTokens.softPaddingHorizontal,
    paddingVertical: inputTokens.softPaddingVertical,
    fontSize: inputTokens.softFontSize,
    ...(Platform.OS === "android" ? { lineHeight: 22 } : null),
    borderWidth: 0.6,
    minHeight: inputTokens.minHeight,
  },
  dropdown: {
    borderRadius: inputTokens.radiusSoft,
    paddingHorizontal: inputTokens.softPaddingHorizontal,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 0.6,
    minHeight: inputTokens.minHeight,
  },
});
