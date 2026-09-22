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

export type WsStepperProps = {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * `ws_stepper` — minus / value / plus counter (antd-mobile Stepper).
 */
export default function WsStepper({
  value,
  defaultValue = 1,
  onChange,
  min = 1,
  max,
  step = 1,
  disabled = false,
  style,
}: WsStepperProps) {
  const { colors } = useTheme();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = value ?? uncontrolled;

  const emit = (v: number) => {
    let next = v;
    if (max != null) next = Math.min(max, next);
    next = Math.max(min, next);
    if (value == null) setUncontrolled(next);
    onChange?.(next);
  };

  const canDecrease = !disabled && current - step >= min;
  const canIncrease = !disabled && (max == null || current + step <= max);

  return (
    <View
      style={[styles.container, { borderColor: colors.border }, style]}
    >
      <TouchableOpacity
        onPress={() => canDecrease && emit(current - step)}
        disabled={!canDecrease}
        style={styles.btn}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="decrease"
      >
        <Text
          style={[
            styles.btnText,
            { color: canDecrease ? colors.textPrimary : colors.textMuted },
          ]}
        >
          −
        </Text>
      </TouchableOpacity>
      <Text style={[styles.value, { color: colors.textPrimary }]}>
        {current}
      </Text>
      <TouchableOpacity
        onPress={() => canIncrease && emit(current + step)}
        disabled={!canIncrease}
        style={styles.btn}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="increase"
      >
        <Text
          style={[
            styles.btnText,
            { color: canIncrease ? colors.textPrimary : colors.textMuted },
          ]}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  btnText: {
    fontSize: 18,
    fontWeight: "600",
  },
  value: {
    minWidth: 32,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
});
