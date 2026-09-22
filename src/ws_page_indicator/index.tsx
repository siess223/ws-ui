import { useWsTheme as useTheme } from "../theme/context";
import React from "react";
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsPageIndicatorProps = {
  total: number;
  current: number;
  /** Active dot color. Default theme primary. */
  activeColor?: string;
  /** Inactive dot color. Default theme border. */
  color?: string;
  /** Elongated active dot (pill). Default false. */
  pill?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * `ws_page_indicator` — pager dots (antd-mobile PageIndicator).
 * `WsSwiper` renders these internally; use this when building a custom pager.
 */
export default function WsPageIndicator({
  total,
  current,
  activeColor,
  color,
  pill = false,
  style,
}: WsPageIndicatorProps) {
  const { colors } = useTheme();
  const active = activeColor ?? colors.primary;
  const inactive = color ?? colors.border;

  if (total <= 1) return null;

  return (
    <View style={[styles.row, style]}>
      {Array.from({ length: total }, (_, i) => {
        const isActive = i === current;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              pill && isActive && styles.dotPill,
              {
                backgroundColor: isActive ? active : inactive,
                opacity: isActive ? 1 : 0.7,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  dotPill: {
    width: 18,
  },
});
