import { needsMyanmarSafeLineHeight } from "../text/WsText";
import { useWsTheme as useTheme } from "../theme/context";
import { myanmarSafeLineHeight } from "../theme/myanmarTypography";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

export type WsTabsItem = {
  key: string;
  title: string;
  disabled?: boolean;
};

export type WsTabsProps = {
  items: WsTabsItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  /** Stretch tabs evenly across width. Default false (scroll). */
  stretch?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Underline uses ~90% of tab width when true. Default true. */
  compactUnderline?: boolean;
  /**
   * Pager scroll position (contentOffset.x). When set, underline and labels
   * track the horizontal page swipe instead of springing on activeKey.
   */
  scrollX?: Animated.Value;
  /** Page width used with `scrollX`. Default = window width. */
  pageWidth?: number;
  /** Tighter padding (home / activity headers). */
  compact?: boolean;
  testIDPrefix?: string;
};

/**
 * `ws_tabs` — underline tab strip (antd-mobile Tabs header).
 * Optional `scrollX` syncs underline/labels with a horizontal pager.
 */
export default function WsTabs({
  items,
  activeKey,
  defaultActiveKey,
  onChange,
  stretch = false,
  style,
  compactUnderline = true,
  scrollX,
  pageWidth = SCREEN_WIDTH,
  compact = false,
  testIDPrefix,
}: WsTabsProps) {
  const { colors } = useTheme();
  const [uncontrolled, setUncontrolled] = useState(
    defaultActiveKey ?? items[0]?.key ?? "",
  );
  const current = activeKey ?? uncontrolled;
  const [measures, setMeasures] = useState<
    Array<{ x: number; width: number } | null>
  >(() => Array(items.length).fill(null));
  const underlineWidth = useRef(new Animated.Value(0)).current;
  const underlineX = useRef(new Animated.Value(0)).current;
  const scrollOffsetX = useRef(new Animated.Value(0)).current;
  const tabsScrollRef = useRef<ScrollView>(null);
  const viewportWidthRef = useRef(0);
  /** Current strip scroll offset (mirrors scrollOffsetX for math). */
  const stripOffsetRef = useRef(0);
  /** Target the strip should settle on (used to avoid redundant scrollTo). */
  const settleTargetRef = useRef<number | null>(null);
  const pagerMode = scrollX != null;

  const onLayoutTab = (index: number, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setMeasures((prev) => {
      const next = [...prev];
      next[index] = { x, width };
      return next;
    });
  };

  /** Scroll the strip so the tab at `index` is fully visible (centered when possible). */
  const scrollStripToIndex = useCallback(
    (index: number, animated: boolean) => {
      const m = measures[index];
      const viewport = viewportWidthRef.current;
      if (!m || viewport <= 0) return;
      const target = Math.max(0, m.x - Math.max(12, (viewport - m.width) / 2));
      if (
        settleTargetRef.current !== null &&
        Math.abs(target - settleTargetRef.current) < 0.5
      ) {
        return;
      }
      settleTargetRef.current = target;
      tabsScrollRef.current?.scrollTo({ x: target, animated });
    },
    [measures],
  );

  /** Settle strip on the active tab (tap / page settle). */
  useEffect(() => {
    if (stretch) return;
    const activeIndex = items.findIndex((t) => t.key === current);
    if (activeIndex < 0) return;
    // Small delay lets pager-follow finish before we animate to final slot.
    const id = requestAnimationFrame(() => scrollStripToIndex(activeIndex, true));
    return () => cancelAnimationFrame(id);
  }, [current, measures, items, stretch, scrollStripToIndex]);

  /**
   * Continuous pager-follow: shift the strip proportionally between the
   * current and next tab centers while the user drags the pager.
   */
  useEffect(() => {
    if (!pagerMode || !scrollX || stretch) return;
    const id = scrollX.addListener(({ value }) => {
      const viewport = viewportWidthRef.current;
      if (viewport <= 0) return;
      const progress = value / pageWidth;
      const i = Math.floor(progress);
      const frac = progress - i;
      const a = measures[i];
      const b = measures[i + 1];
      if (!a) return;
      const centerOf = (m: { x: number; width: number }) =>
        Math.max(0, m.x - Math.max(12, (viewport - m.width) / 2));
      const target = b ? centerOf(a) + (centerOf(b) - centerOf(a)) * frac : centerOf(a);
      // Only nudge when meaningfully different — avoids JS churn each frame.
      if (Math.abs(target - stripOffsetRef.current) < 0.5) return;
      settleTargetRef.current = target;
      tabsScrollRef.current?.scrollTo({ x: target, animated: false });
    });
    return () => scrollX.removeListener(id);
  }, [pagerMode, scrollX, pageWidth, measures, stretch]);

  useEffect(() => {
    if (pagerMode) return;
    const activeIndex = items.findIndex((t) => t.key === current);
    const ready =
      measures.length === items.length && measures.every((m) => m !== null);
    if (!ready || activeIndex < 0) return;
    const m = measures[activeIndex]!;
    const targetWidth = compactUnderline
      ? Math.max(22, m.width * 0.9)
      : m.width;
    const targetX = compactUnderline
      ? m.x + (m.width - targetWidth) / 2
      : m.x;
    Animated.parallel([
      Animated.spring(underlineWidth, {
        toValue: targetWidth,
        useNativeDriver: false,
        tension: 80,
        friction: 10,
      }),
      Animated.spring(underlineX, {
        toValue: targetX,
        useNativeDriver: false,
        tension: 80,
        friction: 10,
      }),
    ]).start();
  }, [
    current,
    measures,
    items,
    underlineWidth,
    underlineX,
    compactUnderline,
    pagerMode,
  ]);

  const pagerUnderlineStyle = useMemo(() => {
    if (!pagerMode || !scrollX) return null;
    const isReady =
      measures.length === items.length && measures.every((m) => m !== null);
    if (!isReady) return { opacity: 0 as const };

    const inputRange = items.map((_, i) => i * pageWidth);
    const widthOutput = measures.map((m) =>
      compactUnderline ? Math.max(22, m!.width * 0.9) : m!.width,
    );
    const xOutput = measures.map((m, i) => {
      const w = widthOutput[i];
      return compactUnderline ? m!.x + (m!.width - w) / 2 : m!.x;
    });

    const w = scrollX.interpolate({
      inputRange,
      outputRange: widthOutput,
      extrapolate: "clamp",
    });
    const tx = scrollX.interpolate({
      inputRange,
      outputRange: xOutput,
      extrapolate: "clamp",
    });
    const adjustedTx = Animated.subtract(tx, scrollOffsetX);

    return {
      width: w,
      transform: [{ translateX: adjustedTx }],
      opacity: 1 as const,
    };
  }, [
    pagerMode,
    scrollX,
    measures,
    items,
    pageWidth,
    compactUnderline,
    scrollOffsetX,
  ]);

  const select = (key: string, disabled?: boolean) => {
    if (disabled) return;
    if (activeKey == null) setUncontrolled(key);
    onChange?.(key);
  };

  const handleTabsScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    stripOffsetRef.current = x;
    scrollOffsetX.setValue(x);
  };

  const handleStripDragStart = () => {
    // User grabbed the strip — clear settle target so pager-follow can resume
    // after the next page settles.
    settleTargetRef.current = null;
  };

  const myanmarLabelStyle = (title: string) =>
    needsMyanmarSafeLineHeight(title)
      ? {
          fontFamily: "NotoSansMyanmar-SemiBold",
          fontWeight: "normal" as const,
          lineHeight: myanmarSafeLineHeight(14, 28),
        }
      : {
          // Animated.Text bypasses MyanmarAwareText — keep English on Noto Sans.
          fontFamily: "NotoSans-SemiBold",
          fontWeight: "normal" as const,
        };

  const row = (
    <>
      {items.map((tab, index) => {
        const active = tab.key === current;

        if (pagerMode && scrollX) {
          const inputRange = [
            (index - 1) * pageWidth,
            index * pageWidth,
            (index + 1) * pageWidth,
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.94, 1.08, 0.94],
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.65, 1, 0.65],
            extrapolate: "clamp",
          });
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [0, -1, 0],
            extrapolate: "clamp",
          });
          const color = scrollX.interpolate({
            inputRange,
            outputRange: [
              colors.textMuted,
              colors.textPrimary,
              colors.textMuted,
            ],
            extrapolate: "clamp",
          });

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => select(tab.key, tab.disabled)}
              onLayout={(e) => onLayoutTab(index, e)}
              disabled={tab.disabled}
              testID={testIDPrefix ? `${testIDPrefix}${tab.key}` : undefined}
              style={[
                styles.tab,
                compact && styles.tabCompact,
                stretch && styles.tabStretch,
                tab.disabled && styles.disabled,
              ]}
              accessibilityRole="tab"
              accessibilityState={active ? { selected: true } : {}}
              activeOpacity={0.7}
            >
              <Animated.Text
                style={[
                  styles.tabText,
                  compact && styles.tabTextCompact,
                  myanmarLabelStyle(tab.title),
                  {
                    color,
                    opacity,
                    transform: [{ scale }, { translateY }],
                    fontWeight: "600",
                  },
                ]}
                numberOfLines={1}
              >
                {tab.title}
              </Animated.Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => select(tab.key, tab.disabled)}
            onLayout={(e) => onLayoutTab(index, e)}
            disabled={tab.disabled}
            testID={testIDPrefix ? `${testIDPrefix}${tab.key}` : undefined}
            style={[
              styles.tab,
              compact && styles.tabCompact,
              stretch && styles.tabStretch,
              tab.disabled && styles.disabled,
            ]}
            accessibilityRole="tab"
            accessibilityState={active ? { selected: true } : {}}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                compact && styles.tabTextCompact,
                myanmarLabelStyle(tab.title),
                {
                  color: active ? colors.textPrimary : colors.textMuted,
                  fontWeight: active ? "700" : "500",
                },
              ]}
              numberOfLines={1}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </>
  );

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.underline,
          compact && styles.underlineCompact,
          { backgroundColor: colors.textPrimary },
          pagerMode
            ? pagerUnderlineStyle
            : {
                width: underlineWidth,
                transform: [{ translateX: underlineX }],
              },
        ]}
      />
      {stretch ? (
        <View style={styles.stretchRow}>{row}</View>
      ) : (
        <ScrollView
          ref={tabsScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          onLayout={(e) => {
            viewportWidthRef.current = e.nativeEvent.layout.width;
          }}
          onScroll={pagerMode ? handleTabsScroll : undefined}
          scrollEventThrottle={pagerMode ? 16 : undefined}
          onScrollBeginDrag={handleStripDragStart}
        >
          {row}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    minWidth: 0,
  },
  scroll: {
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  stretchRow: {
    flex: 1,
    flexDirection: "row",
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  tabCompact: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginRight: 12,
  },
  tabStretch: {
    flex: 1,
    alignItems: "center",
    marginRight: 0,
  },
  tabText: {
    fontSize: 15,
  },
  tabTextCompact: {
    fontSize: 14,
  },
  disabled: { opacity: 0.4 },
  underline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 2,
    borderRadius: 1,
    zIndex: 1,
  },
  underlineCompact: {
    bottom: 2,
    height: 2,
    borderRadius: 1.5,
  },
});
