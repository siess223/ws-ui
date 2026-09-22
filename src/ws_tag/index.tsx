import { useWsTheme as useTheme } from "../theme/context";
import { Ionicons } from "@expo/vector-icons";
import React, { type ReactNode } from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsTagTone =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "neutral";

export type WsTagProps = {
  children?: ReactNode;
  /** Convenience string label. */
  label?: string;
  tone?: WsTagTone;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: "sm" | "md";
  style?: StyleProp<ViewStyle>;
  /** Soft filled pill (default) vs outline-only. */
  fill?: "soft" | "solid" | "outline";
};

/**
 * `ws_tag` — status / meta pill (antd-mobile Tag).
 */
export default function WsTag({
  children,
  label,
  tone = "default",
  icon,
  size = "sm",
  style,
  fill = "soft",
}: WsTagProps) {
  const { colors } = useTheme();
  const tint = {
    default: colors.textSecondary,
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    neutral: colors.textMuted,
  }[tone];

  const isMd = size === "md";
  const bg =
    fill === "solid"
      ? tint
      : fill === "outline"
        ? "transparent"
        : `${tint}1A`;
  const border = fill === "solid" ? tint : `${tint}40`;
  const fg = fill === "solid" ? colors.textOnPrimary : tint;
  const text = label ?? children;

  return (
    <View
      style={[
        styles.tag,
        isMd ? styles.tagMd : styles.tagSm,
        { backgroundColor: bg, borderColor: border },
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={isMd ? 15 : 13} color={fg} /> : null}
      {typeof text === "string" || typeof text === "number" ? (
        <Text style={[styles.label, isMd && styles.labelMd, { color: fg }]}>
          {text}
        </Text>
      ) : (
        text
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagMd: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
  labelMd: {
    fontSize: 13,
  },
});
