import { useWsTheme as useTheme } from "../theme/context";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, type ReactNode } from "react";
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type WsCollapseItem = {
  key: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

export type WsCollapseProps = {
  items: WsCollapseItem[];
  /** Controlled expanded keys. */
  activeKeys?: string[];
  defaultActiveKeys?: string[];
  onChange?: (keys: string[]) => void;
  /** Only one panel open at a time. Default false. */
  accordion?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * `ws_collapse` — accordion panels (antd-mobile Collapse).
 */
export default function WsCollapse({
  items,
  activeKeys,
  defaultActiveKeys = [],
  onChange,
  accordion = false,
  style,
}: WsCollapseProps) {
  const { colors } = useTheme();
  const [uncontrolled, setUncontrolled] =
    useState<string[]>(defaultActiveKeys);
  const current = activeKeys ?? uncontrolled;

  const toggle = (key: string, disabled?: boolean) => {
    if (disabled) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const open = current.includes(key);
    const next = open
      ? current.filter((k) => k !== key)
      : accordion
        ? [key]
        : [...current, key];
    if (activeKeys == null) setUncontrolled(next);
    onChange?.(next);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
        style,
      ]}
    >
      {items.map((item, index) => {
        const open = current.includes(item.key);
        return (
          <View
            key={item.key}
            style={
              index > 0
                ? {
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: colors.border,
                  }
                : undefined
            }
          >
            <TouchableOpacity
              style={[styles.header, item.disabled && styles.disabled]}
              onPress={() => toggle(item.key, item.disabled)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
            >
              <View style={styles.headerTitle}>
                {typeof item.title === "string" ? (
                  <Text style={[styles.title, { color: colors.textPrimary }]}>
                    {item.title}
                  </Text>
                ) : (
                  item.title
                )}
              </View>
              <Ionicons
                name="chevron-down"
                size={16}
                color={colors.textMuted}
                style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
              />
            </TouchableOpacity>
            {open ? (
              <View style={styles.content}>{item.content}</View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 8,
  },
  headerTitle: { flex: 1 },
  title: { fontSize: 15, fontWeight: "600" },
  disabled: { opacity: 0.4 },
  content: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
});
