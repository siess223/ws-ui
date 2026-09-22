import React, { type ReactNode } from "react";
import {
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  SafeAreaView,
  type Edge,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export type WsSafeAreaPosition = "top" | "bottom";
export type WsSafeAreaEdges = Edge[];

export type WsSafeAreaProps = {
  /**
   * antd-mobile style: render a spacer with inset height for one edge.
   * When set (and no children), acts as a fixed-height pad.
   */
  position?: WsSafeAreaPosition;
  /**
   * Wrapper mode: apply safe-area padding on these edges.
   * Default `['top', 'bottom']` when `children` is provided.
   */
  edges?: WsSafeAreaEdges;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
};

/**
 * `ws_safe_area` — safe-area spacer or screen wrapper (antd-mobile SafeArea).
 *
 * Spacer:
 *   <WsSafeArea position="bottom" />
 *
 * Wrapper:
 *   <WsSafeArea edges={['top', 'bottom']} style={{ flex: 1 }}>…</WsSafeArea>
 */
export default function WsSafeArea({
  position,
  edges,
  children,
  style,
  backgroundColor,
}: WsSafeAreaProps) {
  const insets = useSafeAreaInsets();

  // Spacer mode (antd-mobile default API)
  if (children == null && position) {
    const height = position === "top" ? insets.top : insets.bottom;
    return (
      <View
        style={[
          { height, backgroundColor },
          style,
        ]}
      />
    );
  }

  // Wrapper mode
  return (
    <SafeAreaView
      style={[{ flex: children != null ? 1 : undefined, backgroundColor }, style]}
      edges={edges ?? (position ? [position] : ["top", "bottom"])}
    >
      {children}
    </SafeAreaView>
  );
}
