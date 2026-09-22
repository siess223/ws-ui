import { useWsTheme as useTheme } from "../theme/context";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import WsInput from "../ws_input";

export type WsSearchBarProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (text: string) => void;
  onSearch?: (text: string) => void;
  onClear?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  /** Show cancel button while focused / non-empty. Default false. */
  showCancel?: boolean;
  cancelLabel?: string;
  autoFocus?: boolean;
  /** Rounder pill style. Default false (rounded rect). */
  pill?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * `ws_search_bar` — standalone search input with clear + optional cancel
 * (antd-mobile SearchBar). For the header variant with a solid search
 * button, see `WsHeaderSearch`.
 */
export default function WsSearchBar({
  value,
  defaultValue = "",
  onChange,
  onSearch,
  onClear,
  onCancel,
  placeholder,
  showCancel = false,
  cancelLabel,
  autoFocus = false,
  pill = false,
  style,
  testID,
}: WsSearchBarProps) {
  const { colors } = useTheme();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const current = value ?? uncontrolled;

  const emit = (text: string) => {
    if (value == null) setUncontrolled(text);
    onChange?.(text);
  };

  const clear = () => {
    emit("");
    onClear?.();
  };

  const cancel = () => {
    emit("");
    setFocused(false);
    onCancel?.();
  };

  const showCancelBtn = showCancel && (focused || current.length > 0);

  return (
    <View style={[styles.row, style]}>
      <View
        style={[
          styles.field,
          {
            backgroundColor: colors.background,
            borderColor: focused ? colors.primary : colors.border,
            borderRadius: pill ? 22 : 10,
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={17}
          color={colors.textMuted}
          style={styles.searchIcon}
        />
        <WsInput
          fill
          value={current}
          onChangeText={emit}
          onSubmitEditing={() => onSearch?.(current)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          returnKeyType="search"
          autoFocus={autoFocus}
          autoCorrect={false}
          autoCapitalize="none"
          testID={testID}
          style={styles.input}
        />
        {current.length > 0 ? (
          <TouchableOpacity
            onPress={clear}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="clear"
          >
            <Ionicons
              name="close-circle"
              size={17}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {showCancelBtn ? (
        <TouchableOpacity
          onPress={cancel}
          accessibilityRole="button"
          style={styles.cancel}
        >
          <Text style={[styles.cancelText, { color: colors.primary }]}>
            {cancelLabel ?? "Cancel"}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  field: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 10,
    minHeight: 38,
    gap: 6,
  },
  searchIcon: { flexShrink: 0 },
  input: {
    fontSize: 14,
    paddingVertical: 7,
    minHeight: undefined,
  },
  cancel: { paddingVertical: 6 },
  cancelText: { fontSize: 14, fontWeight: "600" },
});
