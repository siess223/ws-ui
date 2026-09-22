import React, { Children, isValidElement, type ReactNode } from "react";
import {
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsGridGap = number | { row?: number; column?: number };

export type WsGridProps = {
  children?: ReactNode;
  /** Column count. Default 2. */
  columns?: number;
  /** Uniform gap, or `{ row, column }`. Default 12. */
  gap?: WsGridGap;
  style?: StyleProp<ViewStyle>;
  /** Style applied to each cell wrapper. */
  itemStyle?: StyleProp<ViewStyle>;
};

function resolveGap(gap: WsGridGap): { row: number; column: number } {
  if (typeof gap === "number") return { row: gap, column: gap };
  return { row: gap.row ?? 0, column: gap.column ?? 0 };
}

/**
 * `ws_grid` — static (non-virtualized) N-column grid.
 * Prefer `WsMasonry` for long scrollable feeds.
 */
export default function WsGrid({
  children,
  columns = 2,
  gap = 12,
  style,
  itemStyle,
}: WsGridProps) {
  const { row, column } = resolveGap(gap);
  const cols = Math.max(1, Math.floor(columns));
  const items = Children.toArray(children);

  // Percentage width with gap accounted via flex + margin on cells.
  const cellBasis = `${100 / cols}%` as `${number}%`;

  return (
    <View
      style={[
        {
          flexDirection: "row",
          flexWrap: "wrap",
          marginHorizontal: column > 0 ? -column / 2 : 0,
          marginVertical: row > 0 ? -row / 2 : 0,
        },
        style,
      ]}
    >
      {items.map((child, index) => (
        <View
          key={
            isValidElement(child) && child.key != null
              ? String(child.key)
              : `ws-grid-${index}`
          }
          style={[
            {
              width: cellBasis,
              paddingHorizontal: column / 2,
              paddingVertical: row / 2,
            },
            itemStyle,
          ]}
        >
          {child}
        </View>
      ))}
    </View>
  );
}
