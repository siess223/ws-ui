import { useWsTheme as useTheme } from "../theme/context";
import { StatusBar } from "expo-status-bar";
import React, { type ReactNode } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  SafeAreaView,
  type Edge,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import WsKeyboard from "../ws_keyboard";

export type WsLayoutEdges = Edge[];

export type WsLayoutProps = {
  children: ReactNode;
  /** Optional top slot (custom header, close row…). Not inside ScrollView. */
  header?: ReactNode;
  /** Sticky bottom slot (CTA bar). Gets bottom safe-area padding on both OSes. */
  footer?: ReactNode;
  /**
   * Safe-area edges applied to the outer shell.
   * Default: `['top']` — footer handles the home-indicator / nav-bar inset.
   */
  edges?: WsLayoutEdges;
  /** Theme background; override when needed (e.g. auth card screens). */
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  /** Wrap body in keyboard-avoiding view (forms). Off by default. */
  keyboard?: boolean;
  keyboardVerticalOffset?: number;
  /**
   * Body scrolls. Uses platform keyboard dismiss:
   * iOS `interactive`, Android `on-drag`.
   */
  scroll?: boolean;
  /** Extra bottom padding inside scroll content (above footer). */
  scrollBottomInset?: number;
  statusBarStyle?: "auto" | "inverted" | "light" | "dark";
  /** When true, StatusBar is not rendered (parent owns it). */
  hideStatusBar?: boolean;
};

/**
 * `ws_layout` — cross-platform screen shell (iOS + Android).
 *
 * Handles safe area, optional keyboard avoidance, optional scroll, and a
 * sticky footer that clears the home indicator / gesture bar on both OSes.
 *
 * @example
 * <WsLayout keyboard scroll footer={<SaveBar />}>
 *   <WsFormField ... />
 * </WsLayout>
 */
export default function WsLayout({
  children,
  header,
  footer,
  edges = ["top"],
  backgroundColor,
  style,
  contentStyle,
  keyboard = false,
  keyboardVerticalOffset = 0,
  scroll = false,
  scrollBottomInset = 24,
  statusBarStyle,
  hideStatusBar = false,
}: WsLayoutProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bg = backgroundColor ?? colors.background;

  const footerPad = Math.max(
    insets.bottom,
    Platform.select({ ios: 8, android: 8, default: 8 })!,
  );

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: scrollBottomInset },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentStyle]}>{children}</View>
  );

  const main = (
    <>
      {header}
      <WsKeyboard
        enabled={keyboard}
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={styles.flex}
      >
        {body}
      </WsKeyboard>
      {footer ? (
        <View
          style={[
            styles.footer,
            {
              paddingBottom: footerPad,
              backgroundColor: bg,
              borderTopColor: colors.border,
            },
          ]}
        >
          {footer}
        </View>
      ) : null}
    </>
  );

  return (
    <SafeAreaView
      style={[styles.shell, { backgroundColor: bg }, style]}
      edges={edges}
    >
      {hideStatusBar ? null : (
        <StatusBar style={statusBarStyle ?? colors.statusBarStyle} />
      )}
      {main}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
});
