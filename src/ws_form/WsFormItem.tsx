import { useWsTheme as useTheme } from "../theme/context";
import { Ionicons } from "@expo/vector-icons";
import React, { type ReactNode } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsFormItemProps = {
  label?: string;
  /** Mark label with a required asterisk. */
  required?: boolean;
  /** Field error message — renders red helper under the row. */
  error?: string;
  /** Helper text when there's no error. */
  hint?: string;
  /** Right-side control. Defaults to `children`. */
  control?: ReactNode;
  children?: ReactNode;
  /** Row press (for picker-style fields). */
  onPress?: () => void;
  /** Show chevron on the right (picker-style fields). */
  arrow?: boolean;
  /** Hide bottom divider (last item). */
  last?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * `ws_form_item` — label + control row inside `WsForm`
 * (antd-mobile Form.Item).
 */
export default function WsFormItem({
  label,
  required = false,
  error,
  hint,
  control,
  children,
  onPress,
  arrow = false,
  last = false,
  style,
}: WsFormItemProps) {
  const { colors } = useTheme();
  const body = control ?? children;

  const row = (
    <View
      style={[
        styles.row,
        !last && { borderBottomColor: colors.border, borderBottomWidth: StyleSheet.hairlineWidth },
        style,
      ]}
    >
      {label ? (
        <View style={styles.labelCol}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            {label}
            {required ? <Text style={{ color: colors.error }}> *</Text> : null}
          </Text>
        </View>
      ) : null}
      <View style={styles.controlCol}>{body}</View>
      {arrow ? (
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      ) : null}
    </View>
  );

  return (
    <View>
      {onPress ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          {row}
        </TouchableOpacity>
      ) : (
        row
      )}
      {error ? (
        <Text style={[styles.helper, { color: colors.error }]}>{error}</Text>
      ) : hint ? (
        <Text style={[styles.helper, { color: colors.textMuted }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    minHeight: 48,
  },
  labelCol: { width: 96, flexShrink: 0 },
  label: { fontSize: 14, fontWeight: "500" },
  controlCol: { flex: 1, minWidth: 0 },
  helper: {
    fontSize: 12,
    marginHorizontal: 14,
    marginTop: 4,
    marginBottom: 6,
  },
});
