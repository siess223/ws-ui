import React, { forwardRef, useMemo } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
} from "react-native";
import { useWsTheme as useTheme } from "../theme/context";
import {
  containsMyanmarText,
  isMyanmarUiLanguage,
  myanmarSafeLineHeight,
  resolveLatinFontFamily,
  resolveMyanmarFontFamily,
} from "../theme/myanmarTypography";
import { inputTokens } from "../tokens";

export type WsInputProps = TextInputProps & {
  /**
   * Grow to fill a horizontal row (icon + input + trailing).
   * Leave false when the field is a full-width bordered control.
   */
  fill?: boolean;
};

/**
 * iOS TextInput clips glyph tops when lineHeight is set (worse with Noto Sans).
 * Later `lineHeight: undefined` in a style array does NOT clear an earlier
 * value, so callers passing textStyles.body still clip unless we flatten-omit.
 */
export function withoutIosInputLineHeight(
  style: StyleProp<TextStyle>,
): StyleProp<TextStyle> {
  if (Platform.OS !== "ios") return style;
  const flat = StyleSheet.flatten(style) as TextStyle | undefined;
  if (flat == null || flat.lineHeight == null) return style;
  const { lineHeight: _ignored, ...rest } = flat;
  return rest;
}

/**
 * `ws_input` - Waansaung base TextInput.
 * Single RN TextInput exit: theme colors + iOS/Android padding quirks.
 * Font follows content / UI language so English stays on Noto Sans both platforms.
 *
 * Android placeholder uses the same Paint as typed text. A Latin-tight
 * lineHeight (e.g. 20-22) with NotoSansMyanmar makes empty hints look high
 * or clipped - keyboard language does not change this; metrics do.
 */
const WsInput = forwardRef<TextInput, WsInputProps>(
  (
    {
      style,
      fill = false,
      secureTextEntry = false,
      placeholder,
      placeholderTextColor,
      multiline = false,
      underlineColorAndroid,
      value,
      ...rest
    },
    ref,
  ) => {
    const { colors, language } = useTheme();
    const myanmarUi = isMyanmarUiLanguage(language);
    const needsMyanmarMetrics =
      myanmarUi ||
      containsMyanmarText(value) ||
      ((!value || value.length === 0) && containsMyanmarText(placeholder));
    const fontFamily = needsMyanmarMetrics
      ? resolveMyanmarFontFamily("400")
      : resolveLatinFontFamily("400");

    const inputStyle = useMemo(() => {
      const caller = StyleSheet.flatten(style) as TextStyle | undefined;
      const fontSize =
        typeof caller?.fontSize === "number"
          ? caller.fontSize
          : inputTokens.fontSize;
      const callerLineHeight =
        typeof caller?.lineHeight === "number" ? caller.lineHeight : 0;
      // Latin default when caller omitted lineHeight. Myanmar must win last —
      // WsHeaderSearch used to pass textStyles.bodySmall (lineHeight 24) which
      // overrode the safe metrics and clipped stacked marks on Android.
      const latinLineHeight =
        typeof caller?.lineHeight === "number"
          ? undefined
          : inputTokens.lineHeight;

      return withoutIosInputLineHeight([
        styles.base,
        typeof latinLineHeight === "number"
          ? { lineHeight: latinLineHeight }
          : null,
        fill && styles.fill,
        multiline && styles.multiline,
        { color: colors.textPrimary, fontFamily, fontWeight: "normal" },
        style,
        needsMyanmarMetrics && Platform.OS === "android"
          ? {
              lineHeight: myanmarSafeLineHeight(fontSize, callerLineHeight),
            }
          : null,
      ]);
    }, [
      colors.textPrimary,
      fill,
      fontFamily,
      multiline,
      needsMyanmarMetrics,
      style,
    ]);

    return (
      <TextInput
        ref={ref}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor ?? colors.textMuted}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        underlineColorAndroid={underlineColorAndroid ?? "transparent"}
        {...(Platform.OS === "android"
          ? {
              includeFontPadding: false,
              textAlignVertical: multiline
                ? ("top" as const)
                : ("center" as const),
            }
          : {})}
        style={inputStyle}
        {...rest}
      />
    );
  },
);

WsInput.displayName = "WsInput";

export default WsInput;

const styles = StyleSheet.create({
  base: {
    fontSize: inputTokens.fontSize,
    // lineHeight applied in component - Myanmar UI needs a taller box on
    // Android or the empty placeholder sits high / clips stacked marks.
    paddingVertical: inputTokens.paddingVertical,
    paddingHorizontal: 0,
    margin: 0,
    ...(Platform.OS === "android" ? { textAlignVertical: "center" } : null),
  },
  fill: {
    flex: 1,
    minHeight: inputTokens.minHeight,
  },
  multiline: {
    // Do not pin lineHeight here - a Latin 22px box makes Myanmar glyphs
    // reflow/oscillate contentSize. Callers (WsTextArea) set a stable
    // lineHeight when needed.
    ...(Platform.OS === "android" ? { textAlignVertical: "top" } : null),
  },
});
