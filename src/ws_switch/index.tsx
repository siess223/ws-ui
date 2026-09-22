import { useWsTheme as useTheme } from "../theme/context";
import React from "react";
import { Switch, type SwitchProps } from "react-native";

export type WsSwitchProps = Omit<
  SwitchProps,
  "trackColor" | "thumbColor" | "ios_backgroundColor"
> & {
  trackColor?: SwitchProps["trackColor"];
  thumbColor?: string;
  ios_backgroundColor?: string;
};

/**
 * `ws_switch` — themed Switch (antd-mobile Switch).
 * Defaults: false track = border, true track = primary.
 */
export default function WsSwitch({
  value,
  trackColor,
  thumbColor,
  ios_backgroundColor,
  ...rest
}: WsSwitchProps) {
  const { colors } = useTheme();

  return (
    <Switch
      value={value}
      trackColor={
        trackColor ?? { false: colors.border, true: colors.primary }
      }
      thumbColor={thumbColor ?? colors.card}
      ios_backgroundColor={ios_backgroundColor ?? colors.border}
      {...rest}
    />
  );
}
