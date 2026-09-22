import { useWsTheme as useTheme } from "../theme/context";
import { headerToolbar } from "../theme/layout";
import { spacing } from "../theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import React, { type ReactNode } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "../text/WsText";

export type WsNavBarProps = {
  /** Title (antd-mobile `children`). */
  children?: ReactNode;
  /** Convenience string title when children omitted. */
  title?: string;
  onBack?: () => void;
  /** Show back chevron. Default true when onBack is set. */
  backIcon?: boolean | ReactNode;
  /** Extra content after back (antd-mobile `left`). */
  left?: ReactNode;
  right?: ReactNode;
  /** @deprecated Prefer `right`. */
  rightAction?: ReactNode;
  transparent?: boolean;
  /** When true, do not add top safe-area padding. */
  skipSafeArea?: boolean;
  size?: "default" | "compact";
  /** Title alignment. Chat profile rows use `left`. Default `center`. */
  titleAlign?: "center" | "left";
  style?: StyleProp<ViewStyle>;
  /** @deprecated Prefer `children` / `title`. */
  showBack?: boolean;
};

/**
 * `ws_nav_bar` — top navigation bar (antd-mobile NavBar / ScreenHeader).
 */
export default function WsNavBar({
  children,
  title,
  onBack,
  backIcon = true,
  left,
  right,
  rightAction,
  transparent = false,
  skipSafeArea = false,
  size = "compact",
  titleAlign = "center",
  style,
  showBack = true,
}: WsNavBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const isCompact = size === "compact";
  const showBackBtn = showBack && onBack && backIcon !== false;
  const rightNode = right ?? rightAction ?? null;
  const titleNode = children ?? title;

  return (
    <View
      style={[
        {
          paddingTop: skipSafeArea ? 0 : insets.top,
          backgroundColor: transparent ? "transparent" : colors.background,
          borderBottomColor: colors.border,
          borderBottomWidth: transparent ? 0 : StyleSheet.hairlineWidth,
        },
        style,
      ]}
    >
      <View style={[styles.row, isCompact ? styles.rowCompact : styles.rowDefault]}>
        <View style={styles.side}>
          {showBackBtn ? (
            <TouchableOpacity
              style={styles.sideButton}
              onPress={onBack}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              {backIcon === true ? (
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={colors.textPrimary}
                />
              ) : (
                backIcon
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.sideButton} />
          )}
          {left}
        </View>

        <View
          style={[
            styles.titleWrap,
            titleAlign === "left" && styles.titleWrapLeft,
          ]}
        >
          {typeof titleNode === "string" ? (
            <Text
              style={[
                styles.title,
                titleAlign === "left" && styles.titleLeft,
                { color: colors.textPrimary },
              ]}
              numberOfLines={1}
            >
              {titleNode}
            </Text>
          ) : (
            titleNode
          )}
        </View>

        <View style={[styles.side, styles.sideRight]}>
          {rightNode ?? <View style={styles.sideButton} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowCompact: {
    paddingHorizontal: spacing.sm,
    paddingVertical: headerToolbar.paddingVertical,
    minHeight: headerToolbar.height,
  },
  rowDefault: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    minHeight: 48,
  },
  side: {
    minWidth: headerToolbar.sideButtonSize,
    flexDirection: "row",
    alignItems: "center",
  },
  sideRight: {
    justifyContent: "flex-end",
  },
  sideButton: {
    width: headerToolbar.sideButtonSize,
    height: headerToolbar.sideButtonSize,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrapLeft: {
    alignItems: "stretch",
  },
  title: {
    fontSize: headerToolbar.titleFontSize,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: Math.ceil(headerToolbar.titleFontSize * 1.35),
  },
  titleLeft: {
    textAlign: "left",
  },
});
