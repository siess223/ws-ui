import { useWsTheme as useTheme } from "../theme/context";
import React, { Children, type ReactNode } from "react";
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsSplitterSize = number | `${number}%` | "auto";

export type WsSplitterProps = {
  children: ReactNode;
  /** `horizontal` = side-by-side (row). Default. */
  direction?: "horizontal" | "vertical";
  /**
   * First pane size. Number = px; `"30%"` = percent of parent flex basis;
   * `"auto"` = content-sized. Default `104` (sidebar-friendly).
   */
  primarySize?: WsSplitterSize;
  style?: StyleProp<ViewStyle>;
  primaryStyle?: StyleProp<ViewStyle>;
  secondaryStyle?: StyleProp<ViewStyle>;
  /** Show a hairline between panes. Default true. */
  showSeparator?: boolean;
  separatorColor?: string;
};

/**
 * `ws_splitter` — two-pane layout (sidebar + content).
 * Fixed split only — mobile-safe (no drag resize).
 */
export default function WsSplitter({
  children,
  direction = "horizontal",
  primarySize = 104,
  style,
  primaryStyle,
  secondaryStyle,
  showSeparator = true,
  separatorColor,
}: WsSplitterProps) {
  const { colors } = useTheme();
  const panes = Children.toArray(children);
  const [primary, secondary] = panes;
  const isRow = direction === "horizontal";

  const primaryDimStyle = ((): ViewStyle => {
    if (primarySize === "auto") {
      return { flexGrow: 0, flexShrink: 0 };
    }
    if (typeof primarySize === "number") {
      return isRow
        ? { width: primarySize, flexGrow: 0, flexShrink: 0 }
        : { height: primarySize, flexGrow: 0, flexShrink: 0 };
    }
    // percent string e.g. "30%"
    return isRow
      ? { width: primarySize, flexGrow: 0, flexShrink: 0 }
      : { height: primarySize, flexGrow: 0, flexShrink: 0 };
  })();

  return (
    <View style={[styles.root, isRow ? styles.row : styles.column, style]}>
      <View style={[primaryDimStyle, primaryStyle]}>{primary}</View>

      {showSeparator ? (
        <View
          style={[
            isRow ? styles.sepVertical : styles.sepHorizontal,
            { backgroundColor: separatorColor ?? colors.divider },
          ]}
        />
      ) : null}

      <View style={[styles.secondary, secondaryStyle]}>{secondary}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  secondary: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
  },
  sepVertical: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
  },
  sepHorizontal: {
    height: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
  },
});
