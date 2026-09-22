import Text from "../text/WsText";
import { useWsTheme as useTheme } from "../theme/context";
import React, { memo, type ReactNode } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsButtonVariant = "primary" | "secondary" | "ghost";

export type WsButtonProps = {
  title?: string;
  children?: ReactNode;
  onPress: () => void;
  testID?: string;
  disabled?: boolean;
  variant?: WsButtonVariant;
  style?: StyleProp<ViewStyle>;
};

/**
 * `ws_button` — primary / secondary / ghost CTA (antd-mobile Button analogue).
 */
function WsButton({
  title,
  children,
  onPress,
  testID,
  disabled = false,
  variant = "primary",
  style,
}: WsButtonProps) {
  const { colors } = useTheme();
  const isPrimary = variant === "primary";
  const isGhost = variant === "ghost";
  const label = title ?? (typeof children === "string" ? children : undefined);

  const dynamicButtonStyle = isPrimary
    ? { backgroundColor: colors.primary, borderColor: colors.primary }
    : isGhost
      ? { backgroundColor: "transparent", borderColor: "transparent" }
      : { backgroundColor: colors.surface, borderColor: colors.border };

  const dynamicTextStyle = isPrimary
    ? { color: colors.textOnPrimary }
    : isGhost
      ? { color: colors.primary }
      : { color: colors.textPrimary };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        dynamicButtonStyle,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      testID={testID}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={label}
    >
      {children != null && typeof children !== "string" ? (
        children
      ) : (
        <Text
          style={[
            styles.buttonText,
            dynamicTextStyle,
            disabled && { color: colors.textMuted },
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 28,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default memo(WsButton);
