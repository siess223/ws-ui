import { useWsTheme as useTheme } from "../theme/context";
import React, { type ReactNode } from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

export type WsDividerProps = {
  /** Default horizontal. */
  type?: "horizontal" | "vertical";
  /** Line color; defaults to `colors.divider`. */
  color?: string;
  /** Thickness in px. Default hairline. */
  thickness?: number;
  /** Outer margin along the cross axis (vertical margin when horizontal). */
  margin?: number;
  /** Optional center label (horizontal only). */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

/**
 * `ws_divider` — hairline separator, optional center label (e.g. "OR").
 */
export default function WsDivider({
  type = "horizontal",
  color,
  thickness = StyleSheet.hairlineWidth,
  margin = 0,
  children,
  style,
  textStyle,
}: WsDividerProps) {
  const { colors } = useTheme();
  const lineColor = color ?? colors.divider;

  if (type === "vertical") {
    return (
      <View
        style={[
          styles.vertical,
          {
            width: thickness,
            backgroundColor: lineColor,
            marginHorizontal: margin,
          },
          style,
        ]}
      />
    );
  }

  if (children == null || children === false) {
    return (
      <View
        style={[
          styles.horizontal,
          {
            height: thickness,
            backgroundColor: lineColor,
            marginVertical: margin,
          },
          style,
        ]}
      />
    );
  }

  return (
    <View style={[styles.labeledRow, { marginVertical: margin }, style]}>
      <View
        style={[
          styles.labeledLine,
          { height: thickness, backgroundColor: lineColor },
        ]}
      />
      {typeof children === "string" || typeof children === "number" ? (
        <Text style={[styles.label, { color: colors.textMuted }, textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
      <View
        style={[
          styles.labeledLine,
          { height: thickness, backgroundColor: lineColor },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  horizontal: {
    alignSelf: "stretch",
  },
  vertical: {
    alignSelf: "stretch",
  },
  labeledRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  labeledLine: {
    flex: 1,
  },
  label: {
    fontWeight: "600",
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
