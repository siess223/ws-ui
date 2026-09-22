import { useWsTheme as useTheme } from "../theme/context";
import React, { type ReactNode } from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsFormProps = {
  children: ReactNode;
  /** Group title above the form (e.g. "Basic info"). */
  title?: string;
  /** Card-style grouped background. Default true. */
  card?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * `ws_form` — form container (antd-mobile Form). Groups fields with a
 * consistent card background + dividers. Field rows use `WsFormItem`.
 */
export default function WsForm({
  children,
  title,
  card = true,
  style,
}: WsFormProps) {
  const { colors } = useTheme();

  return (
    <View style={style}>
      {title ? (
        <Text style={[styles.title, { color: colors.textMuted }]}>{title}</Text>
      ) : null}
      <View
        style={
          card
            ? [
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]
            : undefined
        }
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginHorizontal: 4,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
});
