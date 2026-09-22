import { useWsTheme as useTheme } from "../theme/context";
import { MaterialIcons } from "@expo/vector-icons";
import React, { type ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsCheckboxProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  /** @deprecated Prefer onChange(checked). */
  onToggle?: () => void;
  label?: ReactNode;
  disabled?: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * `ws_checkbox` — checkbox with optional label (antd-mobile Checkbox).
 */
export default function WsCheckbox({
  checked,
  onChange,
  onToggle,
  label,
  disabled = false,
  size = 22,
  style,
}: WsCheckboxProps) {
  const { colors } = useTheme();

  const handlePress = () => {
    if (disabled) return;
    onToggle?.();
    onChange?.(!checked);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
      style={({ pressed }) => [
        styles.row,
        { opacity: disabled ? 0.4 : pressed ? 0.8 : 1 },
        style,
      ]}
    >
      <MaterialIcons
        name={checked ? "check-box" : "check-box-outline-blank"}
        size={size}
        color={checked ? colors.primary : colors.textMuted}
      />
      {label != null ? (
        typeof label === "string" || typeof label === "number" ? (
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {label}
          </Text>
        ) : (
          <View style={styles.labelWrap}>{label}</View>
        )
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    minHeight: 32,
    paddingVertical: 4,
  },
  label: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "500",
    flexShrink: 1,
  },
  labelWrap: {
    marginLeft: 6,
    flexShrink: 1,
  },
});
