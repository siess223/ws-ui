import { useWsTheme as useTheme } from "../theme/context";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsSegmentedItem = {
  key: string;
  label: string;
  disabled?: boolean;
};

export type WsSegmentedProps = {
  items: WsSegmentedItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * `ws_segmented` — compact segmented control (antd-mobile Segmented).
 * Tighter alternative to `WsTabs` for binary/small option switches.
 */
export default function WsSegmented({
  items,
  activeKey,
  defaultActiveKey,
  onChange,
  style,
}: WsSegmentedProps) {
  const { colors } = useTheme();
  const [uncontrolled, setUncontrolled] = useState(
    defaultActiveKey ?? items[0]?.key ?? "",
  );
  const current = activeKey ?? uncontrolled;

  const select = (key: string, disabled?: boolean) => {
    if (disabled) return;
    if (activeKey == null) setUncontrolled(key);
    onChange?.(key);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
        style,
      ]}
    >
      {items.map((item) => {
        const active = item.key === current;
        return (
          <TouchableOpacity
            key={item.key}
            onPress={() => select(item.key, item.disabled)}
            disabled={item.disabled}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[
              styles.segment,
              active && {
                backgroundColor: colors.card,
                shadowColor: "#000",
              },
              item.disabled && styles.disabled,
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: active ? colors.textPrimary : colors.textMuted,
                  fontWeight: active ? "700" : "500",
                },
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    // Shadow only applies when active (backgroundColor set inline).
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  disabled: { opacity: 0.4 },
  label: { fontSize: 13 },
});
