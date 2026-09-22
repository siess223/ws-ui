import { useWsTheme as useTheme } from "../theme/context";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export type WsImageViewerProps = {
  visible: boolean;
  onClose: () => void;
  /** Single image. */
  imageUrl?: string;
  /** Multiple images (gallery mode). */
  images?: string[];
  initialIndex?: number;
  /** Show "n / total" counter in gallery mode. Default true. */
  showCounter?: boolean;
};

/**
 * `ws_image_viewer` — fullscreen image viewer (antd-mobile ImageViewer).
 * Single image or swipeable gallery with counter.
 */
export default function WsImageViewer({
  visible,
  onClose,
  imageUrl,
  images,
  initialIndex = 0,
  showCounter = true,
}: WsImageViewerProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const list = images ?? (imageUrl ? [imageUrl] : []);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (visible && initialIndex !== currentIndex) {
      setCurrentIndex(initialIndex);
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, initialIndex]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }, []);

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.closeButton, { top: insets.top + 12 }]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="close"
        >
          <Ionicons name="close" size={28} color={colors.textOnPrimary} />
        </TouchableOpacity>

        {showCounter && list.length > 1 ? (
          <View style={[styles.counterContainer, { top: insets.top + 12 }]}>
            <Text style={[styles.counterText, { color: colors.textOnPrimary }]}>
              {currentIndex + 1} / {list.length}
            </Text>
          </View>
        ) : null}

        <FlatList
          ref={flatListRef}
          data={list}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item}-${index}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          initialScrollIndex={list.length > 1 ? initialIndex : undefined}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },
  closeButton: {
    position: "absolute",
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(5, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  counterContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 5,
  },
  counterText: {
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  imageContainer: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
