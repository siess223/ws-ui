import { useWsTheme as useTheme } from "../theme/context";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  View,
  type DimensionValue,
  type ViewStyle,
} from "react-native";

export type WsSkeletonProps = {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

/**
 * `ws_skeleton` — pulsing placeholder block (antd-mobile Skeleton).
 */
export default function WsSkeleton({
  width = "100%",
  height = 20,
  borderRadius = 4,
  style,
}: WsSkeletonProps) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <View style={[{ width, height }, style]}>
      <Animated.View
        style={[
          styles.skeleton,
          {
            width: "100%",
            height: "100%",
            borderRadius,
            backgroundColor: colors.border,
          },
          { opacity },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: "hidden",
  },
});
