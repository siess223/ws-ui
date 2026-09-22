import { useWsTheme as useTheme } from "../theme/context";
import React, { useState, type ReactNode } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type WsTabBarItem = {
  key: string;
  title?: ReactNode;
  icon?: ReactNode | ((active: boolean) => ReactNode);
  badge?: ReactNode | number | "dot";
  disabled?: boolean;
};

export type WsTabBarProps = {
  items: WsTabBarItem[];
  activeKey?: string | null;
  defaultActiveKey?: string | null;
  onChange?: (key: string) => void;
  /** Pad bottom home-indicator. Default true. */
  safeArea?: boolean;
  /** Optional raised center slot (e.g. publish CTA). */
  centerSlot?: ReactNode;
  style?: StyleProp<ViewStyle>;
  barStyle?: StyleProp<ViewStyle>;
};

/**
 * `ws_tab_bar` — bottom tab bar (antd-mobile TabBar).
 * Pure UI — routing / auth stay in the host (e.g. AppTabBar).
 */
export default function WsTabBar({
  items,
  activeKey,
  defaultActiveKey,
  onChange,
  safeArea = true,
  centerSlot,
  style,
  barStyle,
}: WsTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [uncontrolled, setUncontrolled] = useState<string | null>(
    defaultActiveKey ?? items[0]?.key ?? null,
  );
  const current = activeKey !== undefined ? activeKey : uncontrolled;

  const select = (key: string, disabled?: boolean) => {
    if (disabled) return;
    if (activeKey === undefined) setUncontrolled(key);
    onChange?.(key);
  };

  const left = centerSlot ? items.slice(0, Math.floor(items.length / 2)) : items;
  const right = centerSlot ? items.slice(Math.floor(items.length / 2)) : [];

  const renderItem = (item: WsTabBarItem) => {
    const active = current === item.key;
    const icon =
      typeof item.icon === "function" ? item.icon(active) : item.icon;
    const title =
      typeof item.title === "function"
        ? (item.title as (a: boolean) => ReactNode)(active)
        : item.title;

    const badge =
      item.badge === "dot" ? (
        <View style={[styles.dot, { backgroundColor: colors.primary }]} />
      ) : typeof item.badge === "number" && item.badge > 0 ? (
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.badgeText, { color: colors.textOnPrimary }]}>
            {item.badge > 99 ? "99+" : item.badge}
          </Text>
        </View>
      ) : item.badge != null && item.badge !== 0 ? (
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          {typeof item.badge === "string" || typeof item.badge === "number" ? (
            <Text style={[styles.badgeText, { color: colors.textOnPrimary }]}>{item.badge}</Text>
          ) : (
            item.badge
          )}
        </View>
      ) : null;

    return (
      <TouchableOpacity
        key={item.key}
        accessibilityRole="button"
        accessibilityState={active ? { selected: true } : {}}
        disabled={item.disabled}
        onPress={() => select(item.key, item.disabled)}
        style={[styles.item, item.disabled && styles.disabled]}
        activeOpacity={0.7}
      >
        <View style={styles.iconWrap}>
          {icon}
          {badge}
        </View>
        {title != null ? (
          typeof title === "string" || typeof title === "number" ? (
            <Text
              style={[
                styles.title,
                { color: active ? colors.primary : colors.textMuted },
              ]}
              numberOfLines={2}
            >
              {title}
            </Text>
          ) : (
            title
          )
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[{ backgroundColor: colors.card }, style]}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
          barStyle,
        ]}
      >
        <View style={styles.row}>
          {left.map(renderItem)}
          {centerSlot ? <View style={styles.centerSlot}>{centerSlot}</View> : null}
          {right.map(renderItem)}
        </View>
      </View>
      {safeArea ? (
        <View
          style={{
            height: Math.max(insets.bottom, 8),
            backgroundColor: colors.card,
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: 62,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  disabled: { opacity: 0.4 },
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
  },
  centerSlot: {
    width: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  dot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
