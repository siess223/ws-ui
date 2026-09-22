import { useWsTheme as useTheme } from "../theme/context";
import { Ionicons } from "@expo/vector-icons";
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type SheetClose = (afterClose?: () => void) => void;

const WsActionSheetContext = createContext<SheetClose | null>(null);

/** Close the nearest WsActionSheet (after spring-out), then run optional callback. */
export function useWsActionSheetClose(): SheetClose {
  const close = useContext(WsActionSheetContext);
  if (!close) {
    return (after) => after?.();
  }
  return close;
}

export type WsActionSheetAction = {
  key: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  destructive?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export type WsActionSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  /** Extra body above action rows (status lists, etc.). */
  children?: ReactNode;
  actions?: WsActionSheetAction[];
  style?: StyleProp<ViewStyle>;
  showClose?: boolean;
};

/**
 * `ws_action_sheet` — spring bottom sheet with optional action rows
 * (antd-mobile ActionSheet).
 */
export default function WsActionSheet({
  visible,
  onClose,
  title,
  children,
  actions,
  style,
  showClose = true,
}: WsActionSheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(64)).current;

  const animateIn = useCallback(() => {
    backdropOpacity.stopAnimation();
    sheetTranslateY.stopAnimation();
    backdropOpacity.setValue(0);
    sheetTranslateY.setValue(64);
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.spring(sheetTranslateY, {
        toValue: 0,
        damping: 22,
        stiffness: 260,
        mass: 0.8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [backdropOpacity, sheetTranslateY]);

  const animateOut = useCallback(
    (after?: () => void) => {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 64,
          duration: 190,
          useNativeDriver: true,
        }),
      ]).start(() => {
        after?.();
      });
    },
    [backdropOpacity, sheetTranslateY],
  );

  const close: SheetClose = useCallback(
    (afterClose) => {
      animateOut(() => {
        onClose();
        afterClose?.();
      });
    },
    [animateOut, onClose],
  );

  const runAction = (action: WsActionSheetAction) => {
    if (action.disabled) return;
    close(() => action.onPress());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onShow={animateIn}
      onRequestClose={() => close()}
    >
      <WsActionSheetContext.Provider value={close}>
        <View style={styles.root}>
          <Animated.View
            pointerEvents="none"
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          />
          <Pressable style={styles.dismiss} onPress={() => close()} />
          <AnimatedPressable
            onPress={(e) => e.stopPropagation?.()}
            style={[
              styles.sheet,
              {
                backgroundColor: colors.card,
                borderTopColor: colors.border,
                paddingBottom: Math.max(insets.bottom, 14),
              },
              { transform: [{ translateY: sheetTranslateY }] },
              style,
            ]}
          >
            <View style={styles.handleArea}>
              <View
                style={[styles.handle, { backgroundColor: colors.border }]}
              />
            </View>

            {(title || showClose) && (
              <View
                style={[styles.header, { borderBottomColor: colors.border }]}
              >
                <Text style={[styles.headerText, { color: colors.textMuted }]}>
                  {title ?? ""}
                </Text>
                {showClose ? (
                  <TouchableOpacity
                    accessibilityRole="button"
                    hitSlop={8}
                    onPress={() => close()}
                    style={[
                      styles.closeBtn,
                      { backgroundColor: colors.background },
                    ]}
                  >
                    <Ionicons
                      name="close"
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.closeBtn} />
                )}
              </View>
            )}

            {children ? (
              <ScrollView
                style={styles.body}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {children}
              </ScrollView>
            ) : null}

            {children && actions && actions.length > 0 ? (
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
            ) : null}

            {actions && actions.length > 0 ? (
              <View style={styles.actions}>
                {actions.map((action) => {
                  const color = action.destructive
                    ? colors.error
                    : colors.textPrimary;
                  return (
                    <TouchableOpacity
                      key={action.key}
                      style={[
                        styles.actionRow,
                        action.disabled && styles.actionDisabled,
                      ]}
                      disabled={action.disabled}
                      onPress={() => runAction(action)}
                    >
                      {action.icon ? (
                        <View
                          style={[
                            styles.actionIcon,
                            {
                              backgroundColor: action.destructive
                                ? `${colors.error}14`
                                : `${colors.primary}14`,
                            },
                          ]}
                        >
                          <Ionicons
                            name={action.icon}
                            size={21}
                            color={
                              action.destructive ? colors.error : colors.primary
                            }
                          />
                        </View>
                      ) : null}
                      <Text style={[styles.actionLabel, { color }]}>
                        {action.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </AnimatedPressable>
        </View>
      </WsActionSheetContext.Provider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(15,23,42,0.48)",
  },
  dismiss: { ...StyleSheet.absoluteFill },
  sheet: {
    width: "100%",
    maxHeight: "86%",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    elevation: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    zIndex: 1,
  },
  handleArea: {
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: { width: 42, height: 4, borderRadius: 2 },
  header: {
    minHeight: 54,
    paddingHorizontal: 20,
    paddingBottom: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { maxHeight: 360 },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 5,
  },
  actions: { paddingBottom: 4 },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 20,
  },
  actionDisabled: { opacity: 0.4 },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
});
