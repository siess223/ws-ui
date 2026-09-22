import { Ionicons } from "@expo/vector-icons";
import React, { type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useWsTheme as useTheme } from "../theme/context";
import { inputTokens } from "../tokens";

export type WsLabeledFieldProps = {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  flex?: boolean;
  children: ReactNode;
};

/**
 * `ws_labeled_field` �?label + icon shell around any control (jobs forms).
 */
export default function WsLabeledField({
  label,
  icon,
  error,
  flex,
  children,
}: WsLabeledFieldProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.fieldWrapper, flex ? styles.flex : null]}>
      {label || icon ? (
        <View style={styles.labelContainer}>
          {icon ? (
            <Ionicons
              name={icon}
              size={18}
              color={colors.primary}
              style={styles.icon}
            />
          ) : null}
          {label ? (
            <Text style={[styles.label, { color: colors.textPrimary }]}>
              {label}
            </Text>
          ) : null}
        </View>
      ) : null}
      {children}
      {error ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldWrapper: { marginBottom: 24 },
  flex: { flex: 1 },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: { marginRight: 8 },
  label: {
    fontSize: inputTokens.labelSize,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  errorText: {
    fontSize: inputTokens.helperSize,
    marginTop: 6,
  },
});
