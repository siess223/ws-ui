import { useWsTheme as useTheme } from "../theme/context";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsRateProps = {
  /** Current value (0..count). Supports halves via `allowHalf` display. */
  value: number;
  onChange?: (value: number) => void;
  count?: number;
  size?: number;
  /** Read-only display (review lists). Default false. */
  readonly?: boolean;
  /** Allow half-star selection. Default false. */
  allowHalf?: boolean;
  activeColor?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * `ws_rate` — star rating input / display (antd-mobile Rate).
 */
export default function WsRate({
  value,
  onChange,
  count = 5,
  size = 24,
  readonly = false,
  allowHalf = false,
  activeColor,
  style,
}: WsRateProps) {
  const { colors } = useTheme();
  const resolvedActiveColor = activeColor ?? colors.warning;

  const renderStar = (position: number) => {
    const filled = value >= position;
    const half = allowHalf && !filled && value >= position - 0.5;
    const name = filled ? "star" : half ? "star-half" : "star-outline";
    const color = filled || half ? resolvedActiveColor : colors.border;

    if (readonly || !onChange) {
      return (
        <Ionicons key={position} name={name} size={size} color={color} />
      );
    }

    return (
      <TouchableOpacity
        key={position}
        onPress={() => onChange(position)}
        activeOpacity={0.7}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel={`${position} star${position > 1 ? "s" : ""}`}
        accessibilityState={value === position ? { selected: true } : {}}
      >
        <Ionicons name={name} size={size} color={color} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.row, style]}>
      {Array.from({ length: count }, (_, i) => renderStar(i + 1))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
