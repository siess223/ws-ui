import Text from "../text/WsText";
import { useWsTheme as useTheme } from "../theme/context";
import { Ionicons } from "@expo/vector-icons";
import React, { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import WsButton from "../ws_button";

export type WsEmptyProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionLoading?: boolean;
  children?: ReactNode;
};

/**
 * `ws_empty` — empty / no-data placeholder (antd-mobile Empty).
 */
export default function WsEmpty({
  icon = "file-tray-outline",
  title,
  subtitle,
  actionLabel,
  onAction,
  actionLoading = false,
  children,
}: WsEmptyProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Ionicons name={icon} size={36} color={colors.textMuted} />
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>

      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          {subtitle}
        </Text>
      ) : null}

      {children}

      {actionLabel && onAction ? (
        <WsButton
          title={actionLoading ? "..." : actionLabel}
          onPress={onAction}
          disabled={actionLoading}
          style={styles.button}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
    gap: 12,
  },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 320,
  },
  button: {
    marginTop: 8,
    minWidth: 160,
  },
});
