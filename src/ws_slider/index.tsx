import { useWsTheme as useTheme } from "../theme/context";
import React, { useRef, useState } from "react";
import {
  PanResponder,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsSliderProps = {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * `ws_slider` — single-thumb drag slider (antd-mobile Slider).
 * Pure RN PanResponder implementation — no extra dependency.
 */
export default function WsSlider({
  value,
  defaultValue = 0,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  style,
}: WsSliderProps) {
  const { colors } = useTheme();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = value ?? uncontrolled;
  const trackWidth = useRef(0);
  const startValue = useRef(current);

  const clamp = (v: number) => {
    const stepped = Math.round(v / step) * step;
    return Math.min(max, Math.max(min, stepped));
  };

  const emit = (v: number) => {
    const next = clamp(v);
    if (value == null) setUncontrolled(next);
    onChange?.(next);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: () => {
        startValue.current = current;
      },
      onPanResponderMove: (_, gesture) => {
        if (trackWidth.current <= 0) return;
        const delta = (gesture.dx / trackWidth.current) * (max - min);
        emit(startValue.current + delta);
      },
    }),
  ).current;

  const onTrackLayout = (e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;
  };

  const ratio = max > min ? (current - min) / (max - min) : 0;

  return (
    <View
      style={[styles.container, disabled && styles.disabled, style]}
      {...panResponder.panHandlers}
    >
      <View
        style={[styles.track, { backgroundColor: colors.border }]}
        onLayout={onTrackLayout}
      >
        <View
          style={[
            styles.fill,
            { backgroundColor: colors.primary, width: `${ratio * 100}%` },
          ]}
        />
      </View>
      <View
        style={[
          styles.thumb,
          {
            backgroundColor: colors.card,
            borderColor: colors.primary,
            left: `${ratio * 100}%`,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 32,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  disabled: { opacity: 0.4 },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 2,
  },
  thumb: {
    position: "absolute",
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    marginLeft: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
});
