import { useWsTheme as useTheme } from "../theme/context";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import WsPopup from "../ws_popup";

export type WsDatePickerProps = {
  visible: boolean;
  onClose: () => void;
  value?: Date;
  onChange: (date: Date) => void;
  mode?: "date" | "time" | "datetime";
  title?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  confirmLabel?: string;
};

/**
 * `ws_date_picker` — themed wrapper over `@react-native-community/datetimepicker`
 * (antd-mobile DatePicker). On iOS renders the spinner inside a `WsPopup`
 * with a confirm button; on Android the native dialog shows directly.
 */
export default function WsDatePicker({
  visible,
  onClose,
  value,
  onChange,
  mode = "date",
  title,
  minimumDate,
  maximumDate,
  confirmLabel = "Done",
}: WsDatePickerProps) {
  const { colors } = useTheme();
  const [pending, setPending] = React.useState<Date>(value ?? new Date());

  React.useEffect(() => {
    if (visible) setPending(value ?? new Date());
  }, [visible, value]);

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      onClose();
      if (event.type === "set" && date) onChange(date);
      return;
    }
    if (date) setPending(date);
  };

  // Android: native dialog, no sheet.
  if (Platform.OS === "android") {
    if (!visible) return null;
    return (
      <DateTimePicker
        value={value ?? new Date()}
        mode={mode === "datetime" ? "date" : mode}
        display="default"
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onChange={handleChange}
      />
    );
  }

  // iOS: spinner inside a bottom popup with confirm.
  return (
    <WsPopup
      visible={visible}
      onClose={onClose}
      title={title}
      maxHeight="46%"
      scroll={false}
    >
      <View style={styles.pickerWrap}>
        <DateTimePicker
          value={pending}
          mode={mode === "datetime" ? "datetime" : mode}
          display="spinner"
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onChange={handleChange}
          style={styles.picker}
        />
        <TouchableOpacity
          style={[styles.confirm, { backgroundColor: colors.primary }]}
          onPress={() => {
            onChange(pending);
            onClose();
          }}
        >
          <Text style={styles.confirmText}>{confirmLabel}</Text>
        </TouchableOpacity>
      </View>
    </WsPopup>
  );
}

const styles = StyleSheet.create({
  pickerWrap: { alignItems: "stretch" },
  picker: { alignSelf: "center" },
  confirm: {
    marginTop: 8,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
