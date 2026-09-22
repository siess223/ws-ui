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

export type WsJumboTabItem = {
  key: string;
  title: string;
  description?: string;
  /** Optional trailing count badge in the title row. */
  count?: number;
  disabled?: boolean;
};

export type WsJumboTabsProps = {
  items: WsJumboTabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  style?: StyleProp<ViewStyle>;
  /** Optional panel content keyed by tab key. */
  renderContent?: (key: string) => ReactNode;
};

/**
 * `ws_jumbo_tabs` — large tabs with title + description (antd-mobile JumboTabs).
 */
export default function WsJumboTabs({
  items,
  activeKey,
  defaultActiveKey,
  onChange,
  style,
  renderContent,
}: WsJumboTabsProps) {
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
    <View style={style}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {items.map((item) => {
          const active = item.key === current;
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => select(item.key, item.disabled)}
              disabled={item.disabled}
              style={[
                styles.item,
                {
                  borderBottomColor: active ? colors.primary : "transparent",
                  opacity: item.disabled ? 0.4 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityState={active ? { selected: true } : {}}
            >
              <View style={styles.titleRow}>
                <Text
                  style={[
                    styles.title,
                    {
                      color: active ? colors.primary : colors.textPrimary,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                {item.count != null ? (
                  <Text
                    style={[
                      styles.count,
                      { color: active ? colors.primary : colors.textMuted },
                    ]}
                  >
                    {item.count}
                  </Text>
                ) : null}
              </View>
              {item.description ? (
                <Text
                  style={[styles.desc, { color: colors.textMuted }]}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {renderContent ? (
        <View style={styles.panel}>{renderContent(current)}</View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 8,
    gap: 4,
  },
  item: {
    minWidth: 120,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  count: {
    fontSize: 13,
    fontWeight: "600",
  },
  desc: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
  },
  panel: {
    paddingTop: 12,
  },
});
