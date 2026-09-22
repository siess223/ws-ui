import { useWsTheme as useTheme } from "../theme/context";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type WsNumberKeyboardProps = {
  /** Called for digit / decimal keys. */
  onKey: (key: string) => void;
  onDelete: () => void;
  onConfirm?: () => void;
  /** Show decimal point key. Default false. */
  decimal?: boolean;
  /** Confirm button label. Hidden when `onConfirm` is not provided. */
  confirmLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

/**
 * `ws_number_keyboard` — custom numeric keypad (antd-mobile NumberKeyboard).
 * Use for amounts / OTP-style numeric entry where the system keyboard is
 * undesirable.
 */
export default function WsNumberKeyboard({
  onKey,
  onDelete,
  onConfirm,
  decimal = false,
  confirmLabel = "OK",
  style,
}: WsNumberKeyboardProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const renderKey = (
    key: string,
    handler: () => void,
    opts?: { icon?: keyof typeof Ionicons.glyphMap; wide?: boolean },
  ) => (
    <TouchableOpacity
      key={key}
      onPress={handler}
      activeOpacity={0.6}
      accessibilityRole="button"
      accessibilityLabel={key}
      style={[
        styles.key,
        { backgroundColor: colors.card },
        opts?.wide && styles.keyWide,
      ]}
    >
      {opts?.icon ? (
        <Ionicons name={opts.icon} size={22} color={colors.textPrimary} />
      ) : (
        <Text style={[styles.keyText, { color: colors.textPrimary }]}>
          {key}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingBottom: Math.max(insets.bottom, 8),
        },
        style,
      ]}
    >
      <View style={styles.grid}>
        {KEYS.map((k) => renderKey(k, () => onKey(k)))}
        {decimal
          ? renderKey(".", () => onKey("."))
          : renderKey("", () => {}, { icon: undefined })}
        {renderKey("0", () => onKey("0"))}
        {renderKey("del", onDelete, { icon: "backspace-outline" })}
      </View>
      {onConfirm ? (
        <TouchableOpacity
          onPress={onConfirm}
          activeOpacity={0.8}
          accessibilityRole="button"
          style={[styles.confirm, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.confirmText}>{confirmLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingHorizontal: 8,
    gap: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  key: {
    width: "32%",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
  },
  keyWide: { flexGrow: 2 },
  keyText: {
    fontSize: 20,
    fontWeight: "600",
  },
  confirm: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
