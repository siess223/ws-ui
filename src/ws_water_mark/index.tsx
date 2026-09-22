import React from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsWaterMarkProps = {
  /** Watermark text (e.g. user phone / name). */
  text: string;
  children?: React.ReactNode;
  /** Rotation of each tile. Default -22deg. */
  rotate?: number;
  /** Tile spacing. */
  gapX?: number;
  gapY?: number;
  opacity?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

const TILE_COLUMNS = 4;
const TILE_ROWS = 10;

/**
 * `ws_water_mark` — repeated diagonal text watermark overlay
 * (antd-mobile WaterMark). Wraps content; overlay ignores touches.
 */
export default function WsWaterMark({
  text,
  children,
  rotate = -22,
  gapX = 32,
  gapY = 48,
  opacity = 0.06,
  color = "#000000",
  style,
}: WsWaterMarkProps) {
  return (
    <View style={[styles.container, style]}>
      {children}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={styles.tileGrid}>
          {Array.from({ length: TILE_ROWS * TILE_COLUMNS }, (_, i) => (
            <Text
              key={i}
              style={[
                styles.tile,
                {
                  color,
                  opacity,
                  marginRight: gapX,
                  marginBottom: gapY,
                  transform: [{ rotate: `${rotate}deg` }],
                },
              ]}
              numberOfLines={1}
            >
              {text}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "relative" },
  tileGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
    flex: 1,
    overflow: "hidden",
  },
  tile: {
    fontSize: 13,
    fontWeight: "600",
  },
});
