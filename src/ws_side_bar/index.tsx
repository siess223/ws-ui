import { useWsTheme as useTheme } from "../theme/context";
import React, { useState, type ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsSideBarItem = {
  key: string;
  title: string;
  badge?: ReactNode | number;
  disabled?: boolean;
};

export type WsSideBarProps = {
  items: WsSideBarItem[];
  activeKey?: string | null;
  defaultActiveKey?: string | null;
  onChange?: (key: string) => void;
  style?: StyleProp<ViewStyle>;
  /** Extra top slot (e.g. "All"). */
  header?: ReactNode;
};

/**
 * `ws_side_bar` — vertical side navigation (antd-mobile SideBar).
 * Active item shows a primary bar on the leading edge.
 */
export default function WsSideBar({
  items,
  activeKey,
  defaultActiveKey,
  onChange,
  style,
  header,
}: WsSideBarProps) {
  const { colors } = useTheme();
  const [uncontrolled, setUncontrolled] = useState<string | null>(
    defaultActiveKey ?? items[0]?.key ?? null,
  );
  const current = activeKey !== undefined ? activeKey : uncontrolled;

  const select = (key: string, disabled?: boolean) => {
    if (disabled) return;
    if (activeKey === undefined) setUncontrolled(key);
    onChange?.(key);
  };

  const renderRow = (
    key: string,
    title: string,
    active: boolean,
    disabled?: boolean,
    badge?: ReactNode | number,
  ) => (
    <TouchableOpacity
      key={key}
      onPress={() => select(key, disabled)}
      disabled={disabled}
      style={[
        styles.item,
        active && { backgroundColor: colors.card },
        disabled && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityState={active ? { selected: true } : {}}
    >
      {active ? (
        <View
          style={[styles.activeBar, { backgroundColor: colors.primary }]}
        />
      ) : null}
      <Text
        style={[
          styles.title,
          {
            color: active ? colors.primary : colors.textSecondary,
            fontWeight: active ? "600" : "400",
          },
        ]}
        numberOfLines={2}
      >
        {title}
      </Text>
      {badge != null && badge !== 0 ? (
        <View style={styles.badgeWrap}>
          {typeof badge === "string" || typeof badge === "number" ? (
            <Text style={[styles.badgeText, { color: colors.textMuted }]}>
              {badge}
            </Text>
          ) : (
            badge
          )}
        </View>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[{ backgroundColor: colors.surface }, style]}
      showsVerticalScrollIndicator={false}
    >
      {header}
      {items.map((item) =>
        renderRow(
          item.key,
          item.title,
          current === item.key,
          item.disabled,
          item.badge,
        ),
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  activeBar: {
    position: "absolute",
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  title: {
    fontSize: 13,
    textAlign: "center",
  },
  badgeWrap: {
    marginTop: 2,
  },
  badgeText: {
    fontSize: 11,
  },
  disabled: { opacity: 0.4 },
});
