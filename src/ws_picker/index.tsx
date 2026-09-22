import { useWsTheme as useTheme } from "../theme/context";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import WsPopup from "../ws_popup";

export type WsPickerOption<T extends string = string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

export type WsPickerProps<T extends string = string> = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  options: WsPickerOption<T>[];
  value?: T | null;
  onSelect: (value: T, option: WsPickerOption<T>) => void;
  /** Show confirm button instead of select-and-close. Default false. */
  confirm?: boolean;
  confirmLabel?: string;
  emptyLabel?: string;
};

/**
 * `ws_picker` — bottom-sheet single-column picker (antd-mobile Picker).
 * Select-and-close by default; pass `confirm` for a two-step confirm flow.
 */
export default function WsPicker<T extends string = string>({
  visible,
  onClose,
  title,
  options,
  value,
  onSelect,
  confirm = false,
  confirmLabel = "Confirm",
  emptyLabel = "No options",
}: WsPickerProps<T>) {
  const { colors } = useTheme();
  const [pending, setPending] = useState<T | null>(value ?? null);

  useEffect(() => {
    if (visible) setPending(value ?? null);
  }, [visible, value]);

  const handleSelect = (option: WsPickerOption<T>) => {
    if (option.disabled) return;
    if (confirm) {
      setPending(option.value);
    } else {
      onSelect(option.value, option);
      onClose();
    }
  };

  const handleConfirm = () => {
    const option = options.find((o) => o.value === pending);
    if (option) onSelect(option.value, option);
    onClose();
  };

  return (
    <WsPopup
      visible={visible}
      onClose={onClose}
      title={title}
      maxHeight="60%"
      scroll={false}
      bodyStyle={styles.body}
    >
      {options.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ color: colors.textMuted }}>{emptyLabel}</Text>
        </View>
      ) : (
        <FlatList
          data={options}
          keyExtractor={(item) => item.value}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const selected = (confirm ? pending : value) === item.value;
            return (
              <TouchableOpacity
                style={[
                  styles.option,
                  { borderBottomColor: colors.border },
                  item.disabled && styles.optionDisabled,
                ]}
                onPress={() => handleSelect(item)}
                disabled={item.disabled}
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
                  {item.label}
                </Text>
                {selected ? (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                ) : null}
              </TouchableOpacity>
            );
          }}
        />
      )}

      {confirm ? (
        <TouchableOpacity
          style={[styles.confirmBtn, { backgroundColor: colors.primary }]}
          onPress={handleConfirm}
          disabled={pending == null}
        >
          <Text style={[styles.confirmText, { color: colors.textOnPrimary }]}>
            {confirmLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </WsPopup>
  );
}

const styles = StyleSheet.create({
  body: { flexShrink: 1 },
  list: { flexGrow: 0 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionDisabled: { opacity: 0.4 },
  optionLabel: { fontSize: 16 },
  empty: { paddingVertical: 40, alignItems: "center" },
  confirmBtn: {
    marginTop: 12,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmText: { fontSize: 16, fontWeight: "600" },
});
