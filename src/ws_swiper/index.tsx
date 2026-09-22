import { useWsTheme as useTheme } from "../theme/context";
import React, {
  Children,
  useState,
  type ReactNode,
} from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsSwiperProps = {
  children?: ReactNode;
  /** Controlled index. */
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  width?: number;
  height?: number;
  showDots?: boolean;
  /** Inactive pager dot color. */
  dotColor?: string;
  /** Active pager dot color. */
  dotActiveColor?: string;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * `ws_swiper` — horizontal paging carousel (antd-mobile Swiper).
 */
export default function WsSwiper({
  children,
  index,
  defaultIndex = 0,
  onIndexChange,
  width: widthProp,
  height,
  showDots = true,
  dotColor,
  dotActiveColor,
  style,
  contentContainerStyle,
}: WsSwiperProps) {
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const width = widthProp ?? windowWidth;
  const slides = Children.toArray(children);
  const [uncontrolled, setUncontrolled] = useState(defaultIndex);
  const current = index ?? uncontrolled;
  const inactiveDot = dotColor ?? colors.border;
  const activeDot = dotActiveColor ?? colors.primary;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    if (next === current) return;
    if (index == null) setUncontrolled(next);
    onIndexChange?.(next);
  };

  return (
    <View style={[{ width, height }, style]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={contentContainerStyle}
      >
        {slides.map((slide, i) => (
          <View key={i} style={{ width, height }}>
            {slide}
          </View>
        ))}
      </ScrollView>
      {showDots && slides.length > 1 ? (
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === current ? activeDot : inactiveDot,
                  opacity: i === current ? 1 : 0.7,
                },
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  dots: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
});
