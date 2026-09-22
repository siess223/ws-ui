import { useWsTheme as useTheme } from "../theme/context";
import React, { useRef, type ReactNode } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export type WsFloatingPanelProps = {
  /** Snap heights from the bottom, ascending. Default [120, 45%]. */
  anchors?: number[];
  /** Initial anchor index. Default 0. */
  defaultAnchor?: number;
  onAnchorChange?: (index: number) => void;
  children?: ReactNode;
  /** Drag handle bar. Default true. */
  showHandle?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * `ws_floating_panel` — draggable bottom panel snapping between anchors
 * (antd-mobile FloatingPanel). Anchors are pixel heights from screen bottom.
 */
export default function WsFloatingPanel({
  anchors = [120, Math.round(SCREEN_HEIGHT * 0.45)],
  defaultAnchor = 0,
  onAnchorChange,
  children,
  showHandle = true,
  style,
}: WsFloatingPanelProps) {
  const { colors } = useTheme();
  const sorted = [...anchors].sort((a, b) => a - b);
  const height = useRef(new Animated.Value(sorted[defaultAnchor] ?? sorted[0])).current;
  const startHeight = useRef(sorted[defaultAnchor] ?? sorted[0]);
  const currentIndex = useRef(defaultAnchor);

  const snapTo = (index: number) => {
    const clamped = Math.max(0, Math.min(sorted.length - 1, index));
    currentIndex.current = clamped;
    Animated.spring(height, {
      toValue: sorted[clamped],
      useNativeDriver: false,
      damping: 24,
      stiffness: 260,
      mass: 0.8,
    }).start();
    onAnchorChange?.(clamped);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
      onPanResponderGrant: () => {
        height.stopAnimation((v) => {
          startHeight.current = v;
        });
      },
      onPanResponderMove: (_, g) => {
        const next = startHeight.current - g.dy;
        const lo = sorted[0] * 0.6;
        const hi = sorted[sorted.length - 1] * 1.15;
        height.setValue(Math.max(lo, Math.min(hi, next)));
      },
      onPanResponderRelease: (_, g) => {
        const current = startHeight.current - g.dy;
        // Nearest anchor, biased by flick velocity.
        let best = 0;
        let bestDist = Infinity;
        sorted.forEach((a, i) => {
          const d = Math.abs(a - current);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        if (g.vy < -0.6 && best < sorted.length - 1) best += 1;
        if (g.vy > 0.6 && best > 0) best -= 1;
        snapTo(best);
      },
    }),
  ).current;

  return (
    <Animated.View
      style={[
        styles.panel,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          height,
        },
        style,
      ]}
    >
      {showHandle ? (
        <View style={styles.handleArea} {...panResponder.panHandlers}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
        </View>
      ) : null}
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    elevation: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  handleArea: {
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: { width: 40, height: 4, borderRadius: 2 },
  content: { flex: 1 },
});
