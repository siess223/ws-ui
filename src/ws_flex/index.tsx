import React, { type ReactNode } from "react";
import {
  View,
  type FlexAlignType,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsFlexJustify =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";

export type WsFlexProps = {
  children?: ReactNode;
  direction?: ViewStyle["flexDirection"];
  align?: FlexAlignType | "stretch";
  justify?: WsFlexJustify;
  wrap?: ViewStyle["flexWrap"];
  gap?: number;
  flex?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * `ws_flex` — thin flexbox row/column helper.
 */
export default function WsFlex({
  children,
  direction = "row",
  align = "stretch",
  justify = "flex-start",
  wrap = "nowrap",
  gap,
  flex,
  style,
}: WsFlexProps) {
  return (
    <View
      style={[
        {
          flexDirection: direction,
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap,
          gap,
          flex,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
