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

export type WsErrorBlockStatus = "default" | "network" | "empty";

export type WsErrorBlockProps = {
  status?: WsErrorBlockStatus;
  title?: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
  retrying?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const STATUS_ICON: Record<WsErrorBlockStatus, keyof typeof Ionicons.glyphMap> = {
  default: "alert-circle-outline",
  network: "cloud-offline-outline",
  empty: "file-tray-outline",
};

/**
 * `ws_error_block` — full-area error / network-failure block
 * (antd-mobile ErrorBlock). Distinct from `WsEmpty` (no data) — this is
 * "something failed, try again".
 */
export default function WsErrorBlock({
  status = "default",
  title,
  description,
  retryLabel,
  onRetry,
  retrying = false,
  icon,
  children,
  style,
}: WsErrorBlockProps) {
  const { colors } = useTheme();
  const iconName = icon ?? STATUS_ICON[status];
  const iconColor = status === "empty" ? colors.textMuted : colors.error;

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Ionicons name={iconName} size={36} color={iconColor} />
      </View>

      {title ? (
        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      ) : null}
      {description ? (
        <Text style={[styles.description, { color: colors.textMuted }]}>
          {description}
        </Text>
      ) : null}

      {children}

      {onRetry ? (
        <WsButton
          title={retryLabel ?? "Try again"}
          onPress={onRetry}
          disabled={retrying}
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
  description: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 320,
  },
  button: { marginTop: 8, minWidth: 160 },
});
