import { useWsTheme as useTheme } from "../theme/context";
import React, {
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type SectionListData,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsIndexBarSection<T = unknown> = {
  index: string;
  title?: string;
  data: T[];
};

export type WsIndexBarProps<T = unknown> = {
  sections: WsIndexBarSection<T>[];
  renderItem: (info: { item: T; index: number; section: WsIndexBarSection<T> }) => ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  sticky?: boolean;
  onIndexChange?: (index: string) => void;
  style?: StyleProp<ViewStyle>;
  /** Index rail on the right. Default true. */
  showIndexRail?: boolean;
};

/**
 * `ws_index_bar` — alphabet / index jump list (antd-mobile IndexBar).
 */
export default function WsIndexBar<T>({
  sections,
  renderItem,
  keyExtractor,
  sticky = true,
  onIndexChange,
  style,
  showIndexRail = true,
}: WsIndexBarProps<T>) {
  const { colors } = useTheme();
  const listRef = useRef<SectionList<T, WsIndexBarSection<T>>>(null);
  const indexes = useMemo(() => sections.map((s) => s.index), [sections]);

  const scrollToIndex = useCallback(
    (index: string) => {
      const sectionIndex = sections.findIndex((s) => s.index === index);
      if (sectionIndex < 0) return;
      listRef.current?.scrollToLocation({
        sectionIndex,
        itemIndex: 0,
        animated: true,
        viewOffset: 0,
      });
      onIndexChange?.(index);
    },
    [sections, onIndexChange],
  );

  return (
    <View style={[styles.root, style]}>
      <SectionList
        ref={listRef}
        sections={sections as SectionListData<T, WsIndexBarSection<T>>[]}
        keyExtractor={(item, index) =>
          keyExtractor?.(item, index) ?? String(index)
        }
        stickySectionHeadersEnabled={sticky}
        renderSectionHeader={({ section }) => (
          <View
            style={[styles.header, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.headerText, { color: colors.textMuted }]}>
              {section.title ?? section.index}
            </Text>
          </View>
        )}
        renderItem={({ item, index, section }) => (
          <>{renderItem({ item, index, section })}</>
        )}
        showsVerticalScrollIndicator={false}
      />
      {showIndexRail ? (
        <View style={styles.rail} pointerEvents="box-none">
          {indexes.map((idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => scrollToIndex(idx)}
              hitSlop={{ top: 2, bottom: 2, left: 6, right: 6 }}
            >
              <Text style={[styles.railText, { color: colors.primary }]}>
                {idx}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  headerText: {
    fontSize: 13,
    fontWeight: "700",
  },
  rail: {
    position: "absolute",
    right: 4,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  railText: {
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 14,
    paddingVertical: 1,
  },
});
