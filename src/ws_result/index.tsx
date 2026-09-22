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
import WsButton from "../ws_button";

export type WsResultStatus = "success" | "error" | "info" | "warning" | "waiting";

export type WsResultProps = {
  status?: WsResultStatus;
  title: string;
  description?: string;
  /** Primary action (e.g. "View order"). */
  actionLabel?: string;
  onAction?: () => void;
  /** Secondary ghost action (e.g. "Back home"). */
  secondaryLabel?: string;
  onSecondary?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const STATUS_ICON: Record<WsResultStatus, keyof typeof Ionicons.glyphMap> = {
  success: "checkmark-circle",
  error: "close-circle",
  info: "information-circle",
  warning: "warning",
  waiting: "time",
};

/**
 * `ws_result` — full-page outcome screen (antd-mobile Result).
 */
export default function WsResult({
  status = "success",
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  icon,
  children,
  style,
}: WsResultProps) {
  const { colors } = useTheme();

  const toneColor: Record<WsResultStatus, string> = {
    success: colors.success,
    error: colors.error,
    info: colors.primary,
    warning: colors.warning,
    waiting: colors.textMuted,
  };
  const color = toneColor[status];
  const iconName = icon ?? STATUS_ICON[status];

  return (
    <View style={[styles.container, style]}>
      <Ionicons name={iconName} size={72} color={color} />
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      {description ? (
        <Text style={[styles.description, { color: colors.textMuted }]}>
          {description}
        </Text>
      ) : null}

      {children}

      {actionLabel && onAction ? (
        <WsButton title={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
      {secondaryLabel && onSecondary ? (
        <WsButton
          title={secondaryLabel}
          onPress={onSecondary}
          variant="ghost"
          style={styles.secondary}
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
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 320,
  },
  action: { marginTop: 16, minWidth: 200 },
  secondary: { marginTop: 4, minWidth: 200 },
});
