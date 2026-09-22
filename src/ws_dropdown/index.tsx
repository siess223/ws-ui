import { useWsTheme as useTheme } from "../theme/context";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState, type ReactNode } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsDropdownItem = {
  key: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  destructive?: boolean;
  disabled?: boolean;
};

export type WsDropdownProps = {
  /** The anchor element (button) that opens the menu. */
  anchor: (open: boolean) => ReactNode;
  items: WsDropdownItem[];
  onSelect: (key: string) => void;
  /** Menu alignment relative to anchor. Default "right". */
  align?: "left" | "right";
  style?: StyleProp<ViewStyle>;
};

/**
 * `ws_dropdown` — anchor-attached popup menu (antd-mobile Dropdown).
 * Measures the anchor and renders a small floating menu near it.
 */
export default function WsDropdown({
  anchor,
  items,
  onSelect,
  align = "right",
  style,
}: WsDropdownProps) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<View>(null);
  const [anchorPos, setAnchorPos] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const openMenu = () => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setAnchorPos({ x, y, width, height });
      setOpen(true);
    });
  };

  const select = (item: WsDropdownItem) => {
    if (item.disabled) return;
    setOpen(false);
    onSelect(item.key);
  };

  const menuLeft =
    align === "right"
      ? anchorPos.x + anchorPos.width - 180
      : anchorPos.x;

  return (
    <View style={style}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={openMenu}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <View ref={anchorRef} collapsable={false}>
          {anchor(open)}
        </View>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View
            style={[
              styles.menu,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                top: anchorPos.y + anchorPos.height + 4,
                left: Math.max(8, menuLeft),
              },
            ]}
          >
            <ScrollView style={styles.menuScroll} bounces={false}>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.item,
                    { borderBottomColor: colors.border },
                    item.disabled && styles.disabled,
                  ]}
                  disabled={item.disabled}
                  onPress={() => select(item)}
                >
                  {item.icon ? (
                    <Ionicons
                      name={item.icon}
                      size={17}
                      color={item.destructive ? colors.error : colors.textPrimary}
                    />
                  ) : null}
                  <Text
                    style={[
                      styles.itemLabel,
                      { color: item.destructive ? colors.error : colors.textPrimary },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1 },
  menu: {
    position: "absolute",
    width: 180,
    maxHeight: 320,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  menuScroll: { flexGrow: 0 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  disabled: { opacity: 0.4 },
  itemLabel: { fontSize: 14, fontWeight: "500" },
});
