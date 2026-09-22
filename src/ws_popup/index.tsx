import { useWsTheme as useTheme } from "../theme/context";
import React, { type ReactNode } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type WsPopupProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  /** Max sheet height, e.g. `"70%"`. Default `70%`. */
  maxHeight?: `${number}%` | number;
  /** Show drag handle. Default true. */
  showHandle?: boolean;
  /** Wrap body in ScrollView. Default true. */
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  bodyStyle?: StyleProp<ViewStyle>;
  /** Optional custom header (replaces title row). */
  header?: ReactNode;
  closeOnMask?: boolean;
};

/**
 * `ws_popup` — bottom sheet popup (antd-mobile Popup).
 */
export default function WsPopup({
  visible,
  onClose,
  title,
  children,
  maxHeight = "70%",
  showHandle = true,
  scroll = true,
  style,
  bodyStyle,
  header,
  closeOnMask = true,
}: WsPopupProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const body = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={bodyStyle}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1, flexShrink: 1 }, bodyStyle]}>{children}</View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {closeOnMask ? (
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        ) : null}
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.card,
              paddingBottom: Math.max(insets.bottom, 16),
              maxHeight,
            },
            style,
          ]}
        >
          {showHandle ? (
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          ) : null}
          {header ??
            (title ? (
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {title}
              </Text>
            ) : null)}
          {body}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    zIndex: 1,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
  },
});
