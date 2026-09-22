import React, { type ReactNode } from "react";
import {
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsAutoCenterProps = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Style on the inner content box. */
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * `ws_auto_center` — center content when it is narrower than the row;
 * when content fills the width it stays start-aligned (antd-mobile AutoCenter).
 */
export default function WsAutoCenter({
  children,
  style,
  contentStyle,
}: WsAutoCenterProps) {
  return (
    <View style={[{ width: "100%", alignItems: "center" }, style]}>
      <View style={[{ maxWidth: "100%" }, contentStyle]}>{children}</View>
    </View>
  );
}
