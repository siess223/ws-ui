import { useWsTheme as useTheme } from "../theme/context";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type WsBackTopProps = {
  visible: boolean;
  onPress: () => void;
  /** Distance from bottom (above tab bar etc.). Default 96. */
  bottom?: number;
  right?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * `ws_back_top` — floating "back to top" button (antd-mobile BackTop).
 * Host controls visibility from its scroll offset.
 */
export default function WsBackTop({
  visible,
  onPress,
  bottom = 96,
  right = 16,
  style,
}: WsBackTopProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="back to top"
      style={[
        styles.button,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          bottom: bottom + insets.bottom,
          right,
        },
        style,
      ]}
    >
      <Ionicons name="arrow-up" size={20} color={colors.textPrimary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    zIndex: 20,
  },
});
