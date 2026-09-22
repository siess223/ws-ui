import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  type NativeSyntheticEvent,
  type TextInput,
  type TextInputContentSizeChangeEventData,
} from "react-native";
import { useWsTheme as useTheme } from "../theme/context";
import {
  containsMyanmarText,
  isMyanmarUiLanguage,
  MYANMAR_LINE_HEIGHT_MULTIPLIER,
} from "../theme/myanmarTypography";
import { shouldShowCharacterCount } from "../theme/characterCount";
import { inputTokens } from "../tokens";
import WsInput, { type WsInputProps } from "../ws_input";

/** Approx Latin line box when converting rows → px. */
const ROW_LINE_HEIGHT = Platform.select({
  ios: 22,
  android: 22,
  default: 22,
})!;

/**
 * Ignore sub-pixel / shaping noise from contentSize (Myanmar fonts
 * especially oscillate by a few px while glyphs settle).
 */
const HEIGHT_HYSTERESIS_PX = 3;

/**
 * Single-line Myanmar contentSize is often taller than the visual line.
 * Require this much above minHeight before treating the field as expanded.
 */
const SINGLE_LINE_SLACK_PX = 10;

export type WsTextAreaAutoSize =
  | boolean
  | {
      minHeight?: number;
      maxHeight?: number;
      minRows?: number;
      maxRows?: number;
      /**
       * Chat-style: keep height locked at minHeight until content clearly
       * needs a second line (slack). Avoids iOS top-align looking high and
       * stops Myanmar contentSize noise from expanding/shrinking the shell.
       */
      centerSingleLine?: boolean;
    };

export type WsTextAreaProps = Omit<WsInputProps, "multiline"> & {
  /** Fixed rows when `autoSize` is off. Default 2. */
  rows?: number;
  /** Grow with content (antd-mobile TextArea `autoSize`). */
  autoSize?: WsTextAreaAutoSize;
  showCount?: boolean;
  /** Fires whenever the resolved height changes (autoSize). */
  onHeightChange?: (height: number) => void;
};

function resolveLimits(
  autoSize: WsTextAreaAutoSize | undefined,
  rows: number,
): {
  enabled: boolean;
  minHeight: number;
  maxHeight: number;
  centerSingleLine: boolean;
} {
  const rowsHeight = Math.max(1, rows) * ROW_LINE_HEIGHT;

  if (!autoSize) {
    return {
      enabled: false,
      minHeight: rowsHeight,
      maxHeight: rowsHeight,
      centerSingleLine: false,
    };
  }

  if (autoSize === true) {
    return {
      enabled: true,
      minHeight: ROW_LINE_HEIGHT,
      maxHeight: ROW_LINE_HEIGHT * 8,
      centerSingleLine: false,
    };
  }

  const minHeight =
    autoSize.minHeight ??
    (autoSize.minRows != null
      ? autoSize.minRows * ROW_LINE_HEIGHT
      : rowsHeight);
  const maxHeight =
    autoSize.maxHeight ??
    (autoSize.maxRows != null
      ? autoSize.maxRows * ROW_LINE_HEIGHT
      : Math.max(minHeight, ROW_LINE_HEIGHT * 8));

  return {
    enabled: true,
    minHeight,
    maxHeight: Math.max(minHeight, maxHeight),
    centerSingleLine: !!autoSize.centerSingleLine,
  };
}

function clampHeight(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * `ws_text_area` — multiline input (antd-mobile TextArea).
 * Built on `WsInput`; use `autoSize` for chat / growing fields.
 */
const WsTextArea = forwardRef<TextInput, WsTextAreaProps>(
  function WsTextArea(
    {
      rows = 2,
      autoSize,
      showCount = false,
      maxLength,
      value,
      placeholder,
      style,
      onContentSizeChange,
      onHeightChange,
      fill = false,
      ...rest
    },
    ref,
  ) {
    const { colors, language } = useTheme();
    const limits = useMemo(
      () => resolveLimits(autoSize, rows),
      [autoSize, rows],
    );
    const [height, setHeight] = useState(limits.minHeight);
    const valueLenRef = useRef(
      typeof value === "string" ? value.length : 0,
    );

    const onHeightChangeRef = useRef(onHeightChange);
    onHeightChangeRef.current = onHeightChange;

    // Empty fields still paint the placeholder with the same line box —
    // Myanmar UI / Myanmar hint must not keep the Latin 22px metrics.
    const hasMyanmar =
      isMyanmarUiLanguage(language) ||
      containsMyanmarText(value) ||
      ((!value || value.length === 0) && containsMyanmarText(placeholder));
    const fontSize =
      StyleSheet.flatten(style)?.fontSize ?? inputTokens.fontSize;
    // Stable line box stops Android contentSize from oscillating on Myanmar.
    const androidLineHeight = hasMyanmar
      ? Math.ceil(Number(fontSize) * MYANMAR_LINE_HEIGHT_MULTIPLIER)
      : ROW_LINE_HEIGHT;

    useEffect(() => {
      if (value === "" || value == null) {
        valueLenRef.current = 0;
        setHeight(limits.minHeight);
      }
    }, [value, limits.minHeight]);

    useEffect(() => {
      setHeight((prev) =>
        clampHeight(prev, limits.minHeight, limits.maxHeight),
      );
    }, [limits.minHeight, limits.maxHeight]);

    useEffect(() => {
      onHeightChangeRef.current?.(height);
    }, [height]);

    const expanded = height > limits.minHeight;
    const atMaxHeight = height >= limits.maxHeight;
    const valueText = typeof value === "string" ? value : "";
    const explicitLineCount = Math.max(1, valueText.split("\n").length);
    // Explicit Enter lines are a reliable floor — iOS often under-reports
    // contentSize while height is locked and scroll is disabled.
    const lineFloor = clampHeight(
      limits.minHeight + Math.max(0, explicitLineCount - 1) * ROW_LINE_HEIGHT,
      limits.minHeight,
      limits.maxHeight,
    );

    const handleContentSizeChange = useCallback(
      (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
        onContentSizeChange?.(event);
        if (!limits.enabled) return;

        const contentHeight = Math.ceil(event.nativeEvent.contentSize.height);
        const valueLen = typeof value === "string" ? value.length : 0;
        const shortened = valueLen < valueLenRef.current;
        valueLenRef.current = valueLen;
        const hasExplicitNewline =
          typeof value === "string" && value.includes("\n");
        const nextLineFloor = clampHeight(
          limits.minHeight +
            Math.max(
              0,
              Math.max(1, typeof value === "string" ? value.split("\n").length : 1) -
                1,
            ) *
              ROW_LINE_HEIGHT,
          limits.minHeight,
          limits.maxHeight,
        );

        setHeight((prev) => {
          let next: number;

          if (limits.centerSingleLine && !hasExplicitNewline) {
            // Stay at min until clearly multi-line — Myanmar single-line
            // contentSize is often minHeight+a few px and must not expand.
            // Skip this gate when the user already pressed Enter.
            // iOS (with scrollEnabled) reports contentSize more tightly; a
            // large slack would swallow Latin soft-wrap (2 lines ≈ minHeight).
            const slack =
              Platform.OS === "ios" ? 4 : SINGLE_LINE_SLACK_PX;
            if (contentHeight <= limits.minHeight + slack) {
              next = limits.minHeight;
            } else {
              next = clampHeight(
                contentHeight,
                limits.minHeight,
                limits.maxHeight,
              );
            }
          } else {
            next = clampHeight(
              contentHeight,
              limits.minHeight,
              limits.maxHeight,
            );
          }

          // Never shorter than explicit line count (iOS contentSize lag).
          next = Math.max(next, nextLineFloor);

          // While typing (not deleting), never shrink — prevents Myanmar
          // shaping noise from collapsing the field and shaking the list.
          if (!shortened && next < prev) {
            next = prev;
          }

          if (Math.abs(next - prev) < HEIGHT_HYSTERESIS_PX) {
            return prev;
          }
          return next;
        });
      },
      [
        limits.centerSingleLine,
        limits.enabled,
        limits.maxHeight,
        limits.minHeight,
        onContentSizeChange,
        value,
      ],
    );

    // Keep height at least the Enter-line floor even when contentSize is quiet.
    useEffect(() => {
      if (!limits.enabled) return;
      setHeight((prev) => {
        if (lineFloor <= prev) return prev;
        return lineFloor;
      });
    }, [limits.enabled, lineFloor]);

    const valueLength = typeof value === "string" ? value.length : 0;
    const counterVisible =
      showCount &&
      maxLength !== undefined &&
      shouldShowCharacterCount(valueLength, maxLength);
    const atLimit = maxLength !== undefined && valueLength >= maxLength;

    const input = (
      <WsInput
        ref={ref}
        fill={fill}
        multiline
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        textAlignVertical={
          // iOS multiline + "center" clips the second line while height
          // catches up; keep top-aligned on iOS for autosize chat fields.
          Platform.OS === "ios" ||
          expanded ||
          !limits.centerSingleLine
            ? "top"
            : "center"
        }
        // iOS: scrollEnabled=false + locked height makes contentSize equal
        // the viewport, so the field never grows and line 2+ is clipped.
        // Keep scrolling available whenever autosize is on (cheap while
        // height tracks content; required once we hit maxHeight).
        scrollEnabled={
          limits.enabled
            ? Platform.OS === "ios" || atMaxHeight
            : undefined
        }
        onContentSizeChange={handleContentSizeChange}
        style={[
          styles.input,
          Platform.OS === "android" ? { lineHeight: androidLineHeight } : null,
          !limits.enabled && { minHeight: limits.minHeight },
          // Always lock height when auto-sizing. Unlocking for "center"
          // made Myanmar contentSize fight the layout and shake the chat.
          limits.enabled && { height },
          style,
        ]}
        {...rest}
      />
    );

    if (!counterVisible) return input;

    return (
      <View>
        {input}
        <Text
          style={[
            styles.counter,
            { color: atLimit ? colors.error : colors.textMuted },
          ]}
        >
          {valueLength}/{maxLength}
        </Text>
      </View>
    );
  },
);

WsTextArea.displayName = "WsTextArea";

export default WsTextArea;

const styles = StyleSheet.create({
  input: {
    fontSize: inputTokens.fontSize,
    paddingTop: Platform.OS === "ios" ? 6 : 4,
    paddingBottom: Platform.OS === "ios" ? 6 : 4,
    paddingHorizontal: 0,
    margin: 0,
  },
  counter: {
    fontSize: inputTokens.helperSize,
    marginTop: 4,
    alignSelf: "flex-end",
  },
});
