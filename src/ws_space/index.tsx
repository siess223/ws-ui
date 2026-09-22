import React, { Children, Fragment, type ReactNode } from "react";
import {
  View,
  type FlexAlignType,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { spacing, type SpacingKey } from "../theme/spacing";

export type WsSpaceSize = number | SpacingKey;

export type WsSpaceProps = {
  children?: ReactNode;
  /** Default vertical (stack). */
  direction?: "horizontal" | "vertical";
  /** Gap between children. Number (px) or theme spacing key. Default `md` (12). */
  size?: WsSpaceSize;
  align?: FlexAlignType | "stretch";
  justify?: ViewStyle["justifyContent"];
  wrap?: boolean;
  /** Optional separator rendered between items. */
  split?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

function resolveSize(size: WsSpaceSize): number {
  if (typeof size === "number") return size;
  return spacing[size];
}

/**
 * `ws_space` — consistent gaps between children (antd Space analogue).
 */
export default function WsSpace({
  children,
  direction = "vertical",
  size = "md",
  align = "stretch",
  justify = "flex-start",
  wrap = false,
  split,
  style,
}: WsSpaceProps) {
  const gap = resolveSize(size);
  const items = Children.toArray(children);

  const body =
    split == null
      ? items
      : items.flatMap((child, index) => {
          if (index === 0) return [child];
          return [
            <Fragment key={`ws-space-split-${index}`}>{split}</Fragment>,
            child,
          ];
        });

  return (
    <View
      style={[
        {
          flexDirection: direction === "horizontal" ? "row" : "column",
          alignItems: align,
          justifyContent: justify,
          flexWrap: wrap ? "wrap" : "nowrap",
          gap: split == null ? gap : undefined,
        },
        split != null && direction === "horizontal"
          ? { columnGap: gap }
          : null,
        split != null && direction === "vertical" ? { rowGap: gap } : null,
        style,
      ]}
    >
      {body}
    </View>
  );
}
