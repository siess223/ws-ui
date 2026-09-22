import { useWsTheme as useTheme } from "../theme/context";
import React, { useCallback } from "react";
import {
  RefreshControl,
  StyleSheet,
  type RefreshControlProps,
} from "react-native";

export type WsPullToRefreshProps = React.PropsWithChildren<{
  refreshing: boolean;
  onRefresh: () => void;
  /** Extra RefreshControl overrides. */
  props?: Partial<RefreshControlProps>;
  /**
   * Android's ScrollView injects this when it clones `refreshControl`.
   * It must reach the native RefreshControl or its SwipeRefreshLayout has no
   * scroll-view child and renders an empty surface.
   */
  style?: RefreshControlProps["style"];
}>;

/**
 * `ws_pull_to_refresh` — themed RefreshControl (antd-mobile PullToRefresh).
 * Pass to a ScrollView/FlatList `refreshControl` prop:
 *
 * ```tsx
 * refreshControl={wsPullToRefresh({ refreshing, onRefresh })}
 * ```
 * or use the component form `<WsPullToRefresh … />` inline.
 */
export default function WsPullToRefresh({
  refreshing,
  onRefresh,
  props,
  children,
  style,
}: WsPullToRefreshProps) {
  const { colors } = useTheme();
  const { style: customStyle, ...refreshControlProps } = props ?? {};

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.primary}
      colors={[colors.primary]}
      progressBackgroundColor={colors.card}
      {...refreshControlProps}
      // On Android, React Native clones the element passed to
      // `refreshControl` and supplies both `style` and the underlying
      // ScrollView as children. Forward both rather than swallowing them in
      // this wrapper; iOS does not require this special treatment.
      style={StyleSheet.compose(style, customStyle)}
    >
      {children}
    </RefreshControl>
  );
}

const createNativeRefreshControl = (
  refreshing: boolean,
  onRefresh: () => void,
  colors: ReturnType<typeof useTheme>["colors"],
) =>
  React.createElement(RefreshControl, {
    refreshing,
    onRefresh,
    tintColor: colors.primary,
    colors: [colors.primary],
    progressBackgroundColor: colors.card,
  });

/** Element factory for `refreshControl={…}` props (avoids JSX in prop). */
export function useWsRefreshControl() {
  const { colors } = useTheme();
  return useCallback(
    (refreshing: boolean, onRefresh: () => void) =>
      createNativeRefreshControl(refreshing, onRefresh, colors),
    [colors],
  );
}
