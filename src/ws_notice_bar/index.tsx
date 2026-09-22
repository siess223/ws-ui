import { useWsTheme as useTheme } from "../theme/context";
import { Ionicons } from "@expo/vector-icons";
import React, { type ReactNode } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsNoticeBarTone = "info" | "warning" | "error" | "success";

export type WsNoticeBarProps = {
  content: ReactNode;
  tone?: WsNoticeBarTone;
  icon?: keyof typeof Ionicons.glyphMap | null;
  /** Show close button. */
  closable?: boolean;
  onClose?: () => void;
  /** Whole-bar press (e.g. re-probe). */
  onPress?: () => void;
  /** Wrap in marquee-style long text later; for now single line. */
  wrap?: boolean;
  style?: StyleProp<ViewStyle>;
};

const TONE_ICON: Record<WsNoticeBarTone, keyof typeof Ionicons.glyphMap> = {
  info: "information-circle-outline",
  warning: "warning-outline",
  error: "alert-circle-outline",
  success: "checkmark-circle-outline",
};

/**
 * `ws_notice_bar` — inline notice strip (antd-mobile NoticeBar).
 * For the floating offline/service banners, see OfflineBanner /
 * ServiceUnavailableBanner which layer positioning on top of this look.
 */
export default function WsNoticeBar({
  content,
  tone = "info",
  icon,
  closable = false,
  onClose,
  onPress,
  wrap = false,
  style,
}: WsNoticeBarProps) {
  const { colors } = useTheme();

  const palette: Record<WsNoticeBarTone, { bg: string; fg: string }> = {
    info: { bg: `${colors.primary}14`, fg: colors.primary },
    warning: { bg: `${colors.warning}1A`, fg: colors.warning },
    error: { bg: `${colors.error}14`, fg: colors.error },
    success: { bg: `${colors.success}14`, fg: colors.success },
  };
  const { bg, fg } = palette[tone];
  const iconName = icon === undefined ? TONE_ICON[tone] : icon;

  const inner = (
    <>
      {iconName ? (
        <Ionicons name={iconName} size={16} color={fg} style={styles.icon} />
      ) : null}
      <Text
        style={[styles.text, { color: fg }, wrap && styles.textWrap]}
        numberOfLines={wrap ? undefined : 1}
      >
        {content}
      </Text>
      {closable ? (
        <TouchableOpacity
          onPress={onClose}
          hitSlop={8}
          accessibilityRole="button"
          style={styles.close}
        >
          <Ionicons name="close" size={14} color={fg} />
        </TouchableOpacity>
      ) : null}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.75}
        accessibilityRole="button"
        style={[styles.bar, { backgroundColor: bg }, style]}
      >
        {inner}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.bar, { backgroundColor: bg }, style]}>{inner}</View>;
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  icon: { marginRight: 2 },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  textWrap: { flexShrink: 1 },
  close: { marginLeft: 4 },
});
