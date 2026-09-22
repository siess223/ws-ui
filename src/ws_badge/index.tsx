import { useWsTheme as useTheme } from "../theme/context";
import React, { type ReactNode } from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsBadgeProps = {
  /** Number / string content. Use `dot` for a plain dot. */
  content?: ReactNode | number | "dot";
  /** When content is a number, clamp display (e.g. 99 → 99+). Default 99. */
  max?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * `ws_badge` — count / dot badge (antd-mobile Badge).
 */
export default function WsBadge({
  content,
  max = 99,
  color,
  style,
}: WsBadgeProps) {
  const { colors } = useTheme();
  const bg = color ?? colors.error;

  if (content == null || content === 0 || content === false) return null;

  if (content === "dot") {
    return <View style={[styles.dot, { backgroundColor: bg }, style]} />;
  }

  const label =
    typeof content === "number"
      ? content > max
        ? `${max}+`
        : String(content)
      : content;

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      {typeof label === "string" || typeof label === "number" ? (
        <Text style={[styles.text, { color: colors.textOnPrimary }]}>{label}</Text>
      ) : (
        label
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 11,
    fontWeight: "800",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
