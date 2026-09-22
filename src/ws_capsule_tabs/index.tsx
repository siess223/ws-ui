import { useWsTheme as useTheme } from "../theme/context";
import Text from "../text/WsText";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsCapsuleTabItem = {
  key: string;
  title: string;
  /** Shown as `title (count)` when defined. */
  count?: number;
  disabled?: boolean;
};

export type WsCapsuleTabsProps = {
  items?: WsCapsuleTabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  /** @deprecated Prefer `items` + `activeKey` + `onChange`. */
  chips?: { id: string; label: string; count?: number }[];
  /** @deprecated */
  activeId?: string;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * `ws_capsule_tabs` — pill / capsule tab strip (antd-mobile CapsuleTabs).
 */
export default function WsCapsuleTabs({
  items,
  activeKey,
  defaultActiveKey,
  onChange,
  chips,
  activeId,
  style,
  contentContainerStyle,
}: WsCapsuleTabsProps) {
  const { colors } = useTheme();
  const list: WsCapsuleTabItem[] =
    items ??
    (chips ?? []).map((c) => ({
      key: c.id,
      title: c.label,
      count: c.count,
    }));

  const [uncontrolled, setUncontrolled] = useState(
    defaultActiveKey ?? list[0]?.key ?? "",
  );
  const current = activeKey ?? activeId ?? uncontrolled;

  const select = (key: string, disabled?: boolean) => {
    if (disabled) return;
    if (activeKey == null && activeId == null) setUncontrolled(key);
    onChange?.(key);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={style}
      contentContainerStyle={[styles.container, contentContainerStyle]}
    >
      {list.map((item) => {
        const isActive = item.key === current;
        return (
          <TouchableOpacity
            key={item.key}
            onPress={() => select(item.key, item.disabled)}
            activeOpacity={0.8}
            disabled={item.disabled}
            accessibilityRole="button"
            accessibilityState={isActive ? { selected: true } : {}}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? colors.primary : colors.card,
                borderColor: isActive ? colors.primary : colors.border,
                opacity: item.disabled ? 0.4 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: isActive ? colors.textOnPrimary : colors.textSecondary },
              ]}
              numberOfLines={1}
            >
              {item.count === undefined
                ? item.title
                : `${item.title} (${item.count})`}
            </Text>
          </TouchableOpacity>
        );
      })}
      <View style={styles.tail} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 10,
    alignItems: "center",
  },
  chip: {
    height: 38,
    justifyContent: "center",
    paddingHorizontal: 18,
    borderRadius: 19,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 22,
  },
  tail: {
    width: 8,
  },
});
