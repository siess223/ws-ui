import React, { useEffect, useState } from "react";
import {
  DeviceEventEmitter,
  Keyboard,
  Platform,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import {
  KeyboardAvoidingView,
  KeyboardEvents,
} from "react-native-keyboard-controller";

export type WsKeyboardProps = {
  children: React.ReactNode;
  keyboardVerticalOffset?: number;
  style?: StyleProp<ViewStyle>;
  /** When false, renders children without avoiding (still a flex:1 host). */
  enabled?: boolean;
};

/**
 * `ws_keyboard` — form-screen keyboard avoidance for iOS + Android.
 *
 * Uses react-native-keyboard-controller. Keep `behavior="padding"` always on;
 * do not toggle `enabled` off while closing (freezes padding / white gap).
 *
 * Android: `automaticOffset` for system resize; when the keyboard is closed we
 * stamp `paddingBottom: 0` so MIUI leftover padding cannot stick after pickers.
 *
 * Chat screens should keep using KeyboardStickyView — not this wrapper.
 */
export default function WsKeyboard({
  children,
  keyboardVerticalOffset = 0,
  style,
  enabled = true,
}: WsKeyboardProps) {
  const [kbClosed, setKbClosed] = useState(true);

  useEffect(() => {
    if (Platform.OS !== "android" || !enabled) return;

    const open = () => setKbClosed(false);
    const closed = () => setKbClosed(true);

    const subscriptions = [
      KeyboardEvents.addListener("keyboardWillShow", open),
      Keyboard.addListener("keyboardDidShow", open),
      Keyboard.addListener("keyboardDidHide", closed),
      DeviceEventEmitter.addListener("keyboardControllerForceReset", closed),
    ];

    return () => subscriptions.forEach((s) => s.remove());
  }, [enabled]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <KeyboardAvoidingView
      style={[
        styles.layout,
        style,
        Platform.OS === "android" && kbClosed ? styles.stampZeroPadding : null,
      ]}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
      automaticOffset={Platform.OS === "android"}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  layout: { flex: 1 },
  stampZeroPadding: { paddingBottom: 0 },
});
