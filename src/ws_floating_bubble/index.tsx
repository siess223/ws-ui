import { useWsTheme as useTheme } from "../theme/context";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, type ReactNode } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BUBBLE_SIZE = 48;
const EDGE_GAP = 12;

export type WsFloatingBubbleProps = {
  onPress?: () => void;
  /** Custom bubble content. Default: chat icon. */
  children?: ReactNode;
  icon?: keyof typeof Ionicons.glyphMap;
  /** Initial position from the right edge / above bottom. */
  initialOffset?: { x?: number; y?: number };
  style?: StyleProp<ViewStyle>;
};

/**
 * `ws_floating_bubble` — draggable floating action bubble that snaps to the
 * nearest horizontal edge (antd-mobile FloatingBubble).
 */
export default function WsFloatingBubble({
  onPress,
  children,
  icon = "chatbubble-ellipses",
  initialOffset,
  style,
}: WsFloatingBubbleProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const startX = SCREEN_WIDTH - BUBBLE_SIZE - (initialOffset?.x ?? EDGE_GAP);
  const startY =
    SCREEN_HEIGHT - BUBBLE_SIZE - (initialOffset?.y ?? 160) - insets.bottom;

  const pan = useRef(new Animated.ValueXY({ x: startX, y: startY })).current;
  const startPos = useRef({ x: startX, y: startY });

  const clampY = (y: number) =>
    Math.max(
      insets.top + EDGE_GAP,
      Math.min(SCREEN_HEIGHT - BUBBLE_SIZE - insets.bottom - EDGE_GAP, y),
    );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 4 || Math.abs(g.dy) > 4,
      onPanResponderGrant: () => {
        pan.stopAnimation((v) => {
          startPos.current = v;
        });
      },
      onPanResponderMove: (_, g) => {
        pan.setValue({
          x: startPos.current.x + g.dx,
          y: clampY(startPos.current.y + g.dy),
        });
      },
      onPanResponderRelease: (_, g) => {
        const rawX = startPos.current.x + g.dx;
        const rawY = clampY(startPos.current.y + g.dy);
        // Snap to nearest horizontal edge.
        const snapX =
          rawX + BUBBLE_SIZE / 2 < SCREEN_WIDTH / 2
            ? EDGE_GAP
            : SCREEN_WIDTH - BUBBLE_SIZE - EDGE_GAP;
        startPos.current = { x: snapX, y: rawY };
        Animated.spring(pan, {
          toValue: { x: snapX, y: rawY },
          useNativeDriver: false,
          damping: 20,
          stiffness: 220,
          mass: 0.7,
        }).start();
      },
    }),
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.position, { transform: pan.getTranslateTransform() }, style]}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        style={[
          styles.bubble,
          {
            backgroundColor: colors.primary,
          },
        ]}
      >
        {children ?? (
          <Ionicons name={icon} size={22} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  position: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 50,
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
});
