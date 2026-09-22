import { useWsTheme as useTheme } from "../theme/context";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsStepItem = {
  key: string;
  title: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export type WsStepsProps = {
  steps: WsStepItem[];
  /** 0-based current step index. */
  current: number;
  onChange?: (index: number) => void;
  /** Allow tapping future steps. Default false. */
  allowJumpAhead?: boolean;
  direction?: "horizontal" | "vertical";
  style?: StyleProp<ViewStyle>;
};

/**
 * `ws_steps` — step indicator (antd-mobile Steps).
 * Horizontal = form wizard dots; vertical = simple timeline.
 */
export default function WsSteps({
  steps,
  current,
  onChange,
  allowJumpAhead = false,
  direction = "horizontal",
  style,
}: WsStepsProps) {
  const { colors } = useTheme();

  if (direction === "vertical") {
    return (
      <View style={style}>
        {steps.map((step, index) => {
          const done = index < current;
          const active = index === current;
          const reached = done || active;
          const isLast = index === steps.length - 1;
          return (
            <View key={step.key} style={styles.vRow}>
              <View style={styles.vIconCol}>
                <View
                  style={[
                    styles.vCircle,
                    {
                      backgroundColor: reached
                        ? colors.primaryLight
                        : colors.surface,
                      borderColor: reached ? colors.primary : colors.border,
                    },
                  ]}
                >
                  {step.icon ? (
                    <Ionicons
                      name={step.icon}
                      size={16}
                      color={reached ? colors.primary : colors.textMuted}
                    />
                  ) : done ? (
                    <Ionicons name="checkmark" size={14} color={colors.primary} />
                  ) : (
                    <Text
                      style={{
                        color: reached ? colors.primary : colors.textMuted,
                        fontWeight: "700",
                        fontSize: 11,
                      }}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
                {!isLast ? (
                  <View
                    style={[
                      styles.vConnector,
                      {
                        backgroundColor: done ? colors.primary : colors.border,
                      },
                    ]}
                  />
                ) : null}
              </View>
              <View style={styles.vLabelCol}>
                <Text
                  style={[
                    styles.vTitle,
                    {
                      color: reached ? colors.textPrimary : colors.textMuted,
                      fontWeight: active ? "700" : "400",
                    },
                  ]}
                >
                  {step.title}
                </Text>
                {step.description ? (
                  <Text style={[styles.vDesc, { color: colors.textMuted }]}>
                    {step.description}
                  </Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  return (
    <View style={[styles.hRow, style]}>
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        const disabled = !allowJumpAhead && index > current;
        return (
          <TouchableOpacity
            key={step.key}
            style={styles.hItem}
            onPress={() => onChange?.(index)}
            disabled={disabled || !onChange}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.hDot,
                {
                  backgroundColor:
                    done || active ? colors.primary : colors.card,
                  borderColor: done || active ? colors.primary : colors.border,
                },
              ]}
            >
              {done ? (
                <Ionicons name="checkmark" size={14} color={colors.textOnPrimary} />
              ) : (
                <Text
                  style={[
                    styles.hDotText,
                    { color: active ? colors.textOnPrimary : colors.textMuted },
                  ]}
                >
                  {index + 1}
                </Text>
              )}
            </View>
            <Text
              style={[
                styles.hLabel,
                {
                  color: active
                    ? colors.textPrimary
                    : done
                      ? colors.primary
                      : colors.textMuted,
                  fontWeight: active ? "700" : "500",
                },
              ]}
              numberOfLines={1}
            >
              {step.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  hRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  hItem: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  hDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  hDotText: {
    fontSize: 11,
    fontWeight: "700",
  },
  hLabel: {
    fontSize: 12,
  },
  vRow: { flexDirection: "row", alignItems: "flex-start" },
  vIconCol: { alignItems: "center", width: 36 },
  vCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  vConnector: { width: 2, height: 28, marginTop: 2 },
  vLabelCol: { flex: 1, paddingLeft: 12, paddingBottom: 16 },
  vTitle: { fontSize: 14 },
  vDesc: { fontSize: 12, marginTop: 2, lineHeight: 16 },
});
