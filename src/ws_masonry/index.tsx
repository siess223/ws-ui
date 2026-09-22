import {
  FlashList,
  type FlashListRef,
  type ViewToken,
} from "@shopify/flash-list";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
  type ViewabilityConfig,
} from "react-native";

/** Compatible with home-tab "scroll to top" callers that expect FlashList-like API. */
export type WsMasonryRef = {
  scrollToOffset: (params: { offset: number; animated?: boolean }) => void;
};

/** @deprecated Use `WsMasonryRef`. */
export type MasonryListRef = WsMasonryRef;

export type WsMasonryProps<T> = {
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: (info: { item: T; index: number }) => ReactNode;
  /**
   * @deprecated No longer used — FlashList v2 measures real item sizes.
   * Kept optional so existing callers compile; remove from call sites later.
   */
  estimateHeight?: (item: T, index: number) => number;
  /** Improves recycling when the list mixes different card layouts. */
  getItemType?: (item: T, index: number) => string | number | undefined;
  ListHeaderComponent?: ReactElement | null;
  ListFooterComponent?: ReactElement | null;
  ListEmptyComponent?: ReactElement | null;
  refreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  /** Distance from bottom as a fraction of viewport height. Default 0.5. */
  onEndReachedThreshold?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  /**
   * @deprecated No longer used — FlashList's built-in RefreshControl does not
   * expose tint colors. Kept so existing callers compile.
   */
  refreshColor?: string;
  /** Extra gap between the two columns. */
  columnGap?: number;
  /**
   * Called when a card has been ≥50% visible for ≥1s (impression standard).
   * Fires at most once per item per mount.
   */
  onItemVisible?: (info: { item: T; index: number }) => void;
};

/** @deprecated Use `WsMasonryProps`. */
export type MasonryTwoColumnListProps<T> = WsMasonryProps<T>;

/**
 * Impression standard: ≥50% of the item visible for ≥1s.
 * Must stay a stable reference — FlashList does not support changing
 * viewabilityConfig on the fly.
 */
const IMPRESSION_VIEWABILITY_CONFIG: ViewabilityConfig = {
  itemVisiblePercentThreshold: 50,
  minimumViewTime: 1000,
};

/**
 * `ws_masonry` — virtualized two-column masonry (FlashList v2).
 * Only visible cards are mounted/recycled — do NOT replace with ScrollView+map.
 */
function WsMasonryInner<T>(props: WsMasonryProps<T>, ref: Ref<WsMasonryRef>) {
  const {
    data,
    keyExtractor,
    renderItem,
    getItemType,
    ListHeaderComponent,
    ListFooterComponent,
    ListEmptyComponent,
    refreshing = false,
    onRefresh,
    onEndReached,
    onEndReachedThreshold = 0.5,
    contentContainerStyle,
    style,
    columnGap = 4,
    onItemVisible,
  } = props;

  const listRef = useRef<FlashListRef<T>>(null);

  useImperativeHandle(ref, () => ({
    scrollToOffset: ({ offset, animated = true }) => {
      listRef.current?.scrollToOffset({ offset, animated });
    },
  }));

  const reportedKeys = useRef(new Set<string>());

  const handleViewableItemsChanged = useCallback(
    (info: { viewableItems: ViewToken<T>[]; changed: ViewToken<T>[] }) => {
      if (!onItemVisible) return;
      for (const token of info.viewableItems) {
        if (!token.isViewable || token.index == null || token.item == null) {
          continue;
        }
        if (reportedKeys.current.has(token.key)) continue;
        reportedKeys.current.add(token.key);
        onItemVisible({ item: token.item, index: token.index });
      }
    },
    [onItemVisible],
  );

  const wrappedRenderItem = useCallback(
    ({ item, index }: { item: T; index: number }) => (
      <View style={[styles.cardWrap, { paddingHorizontal: columnGap / 2 }]}>
        {renderItem({ item, index })}
      </View>
    ),
    [renderItem, columnGap],
  );

  const isEmpty = data.length === 0;

  const listStyle = useMemo(
    () => (style == null ? undefined : (StyleSheet.flatten(style) as ViewStyle)),
    [style],
  );

  return (
    <FlashList
      ref={listRef}
      masonry
      numColumns={2}
      data={data}
      renderItem={wrappedRenderItem}
      keyExtractor={keyExtractor}
      getItemType={getItemType}
      style={listStyle}
      contentContainerStyle={[
        styles.content,
        isEmpty && styles.contentEmpty,
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      onViewableItemsChanged={
        onItemVisible ? handleViewableItemsChanged : undefined
      }
      viewabilityConfig={
        onItemVisible ? IMPRESSION_VIEWABILITY_CONFIG : undefined
      }
    />
  );
}

const WsMasonry = forwardRef(WsMasonryInner) as <T>(
  props: WsMasonryProps<T> & {
    ref?: Ref<WsMasonryRef>;
  },
) => ReactElement | null;

export default WsMasonry;

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  contentEmpty: {
    flexGrow: 1,
  },
  cardWrap: {
    marginBottom: 4,
  },
});
