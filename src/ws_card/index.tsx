import { shadows, type ShadowKey } from "../theme/shadows";
import { useWsTheme as useTheme } from "../theme/context";
import React, { type ReactNode } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsCardProps = {
  children?: ReactNode;
  onPress?: () => void;
  padding?: number;
  radius?: number;
  bordered?: boolean;
  shadow?: ShadowKey | false;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
};

/**
 * `ws_card` — bordered rounded surface (antd-mobile Card).
 */
export default function WsCard({
  children,
  onPress,
  padding = 0,
  radius = 18,
  bordered = true,
  shadow = "sm",
  style,
  backgroundColor,
}: WsCardProps) {
  const { colors } = useTheme();
  const shell = [
    styles.base,
    {
      backgroundColor: backgroundColor ?? colors.card,
      borderRadius: radius,
      padding,
      borderWidth: bordered ? StyleSheet.hairlineWidth : 0,
      borderColor: colors.border,
    },
    shadow ? shadows[shadow] : null,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={shell}
        onPress={onPress}
        activeOpacity={0.75}
        accessibilityRole="button"
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={shell}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
  },
});
