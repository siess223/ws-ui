import { useWsTheme as useTheme } from "../theme/context";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import WsPopup from "../ws_popup";

export type WsCascaderOption = {
  value: string;
  label: string;
  children?: WsCascaderOption[];
  disabled?: boolean;
};

export type WsCascaderProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  options: WsCascaderOption[];
  /** Currently selected path (e.g. ["regionId", "townshipId"]). */
  value?: string[];
  /** Fires with the full selected path + leaf option when a leaf is picked. */
  onSelect: (path: string[], leaf: WsCascaderOption) => void;
  emptyLabel?: string;
};

/**
 * `ws_cascader` — multi-level column picker (antd-mobile Cascader).
 * Each level is a column; tapping a node with children drills in, tapping a
 * leaf selects and closes.
 */
export default function WsCascader({
  visible,
  onClose,
  title,
  options,
  value = [],
  onSelect,
  emptyLabel = "No options",
}: WsCascaderProps) {
  const { colors } = useTheme();
  const [path, setPath] = useState<string[]>(value);

  useEffect(() => {
    if (visible) setPath(value);
  }, [visible, value]);

  /** Options at each level, following the current path. */
  const levels: WsCascaderOption[][] = [options];
  const selectedAtLevel: (string | undefined)[] = [];
  let cursor = options;
  for (const v of path) {
    const node = cursor.find((o) => o.value === v);
    if (!node) break;
    selectedAtLevel.push(v);
    if (node.children?.length) {
      levels.push(node.children);
      cursor = node.children;
    } else {
      break;
    }
  }

  const pick = (level: number, option: WsCascaderOption) => {
    if (option.disabled) return;
    const nextPath = [...path.slice(0, level), option.value];
    if (option.children?.length) {
      setPath(nextPath);
    } else {
      onSelect(nextPath, option);
      onClose();
    }
  };

  return (
    <WsPopup
      visible={visible}
      onClose={onClose}
      title={title}
      maxHeight="70%"
      scroll={false}
      bodyStyle={styles.body}
    >
      {/* Breadcrumb of the current path */}
      {path.length > 0 ? (
        <View style={[styles.crumbs, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => setPath([])}>
            <Text style={[styles.crumb, { color: colors.primary }]}>
              {title ?? "…"}
            </Text>
          </TouchableOpacity>
          {path.map((v, i) => {
            const label = levels[i]?.find((o) => o.value === v)?.label ?? v;
            return (
              <View key={`${v}-${i}`} style={styles.crumbRow}>
                <Ionicons
                  name="chevron-forward"
                  size={12}
                  color={colors.textMuted}
                />
                <TouchableOpacity onPress={() => setPath(path.slice(0, i + 1))}>
                  <Text style={[styles.crumb, { color: colors.primary }]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      ) : null}

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {(levels[Math.min(path.length, levels.length - 1)] ?? []).length ===
        0 ? (
          <View style={styles.empty}>
            <Text style={{ color: colors.textMuted }}>{emptyLabel}</Text>
          </View>
        ) : (
          (levels[Math.min(path.length, levels.length - 1)] ?? []).map(
            (option) => {
              const selected = selectedAtLevel.includes(option.value);
              const hasChildren = !!option.children?.length;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    { borderBottomColor: colors.border },
                    option.disabled && styles.disabled,
                  ]}
                  onPress={() => pick(path.length, option)}
                  disabled={option.disabled}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      {
                        color: selected ? colors.primary : colors.textPrimary,
                        fontWeight: selected ? "700" : "400",
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {hasChildren ? (
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={colors.textMuted}
                    />
                  ) : selected ? (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={colors.primary}
                    />
                  ) : null}
                </TouchableOpacity>
              );
            },
          )
        )}
      </ScrollView>
    </WsPopup>
  );
}

const styles = StyleSheet.create({
  body: { flexShrink: 1 },
  crumbs: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
    paddingBottom: 10,
    marginBottom: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  crumbRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  crumb: { fontSize: 13, fontWeight: "600" },
  list: { flexGrow: 0 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  disabled: { opacity: 0.4 },
  optionLabel: { fontSize: 16 },
  empty: { paddingVertical: 40, alignItems: "center" },
});
