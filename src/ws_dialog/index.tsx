import { useWsTheme as useTheme } from "../theme/context";
import React, { type ReactNode } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsDialogAction = {
  key: string;
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
};

export type WsDialogProps = {
  visible: boolean;
  onClose: () => void;
  title?: ReactNode;
  content?: ReactNode;
  header?: ReactNode;
  actions?: WsDialogAction[];
  closeOnMask?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

/**
 * `ws_dialog` — centered confirm / alert dialog (antd-mobile Dialog).
 */
export default function WsDialog({
  visible,
  onClose,
  title,
  content,
  header,
  actions,
  closeOnMask = true,
  style,
  children,
}: WsDialogProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const body = children ?? content;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {closeOnMask ? (
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        ) : null}
        <View
          style={[
            styles.container,
            { width: width * 0.85, backgroundColor: colors.card },
            style,
          ]}
        >
          {header}
          {title != null ? (
            typeof title === "string" ? (
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {title}
              </Text>
            ) : (
              title
            )
          ) : null}
          {body != null ? (
            typeof body === "string" ? (
              <Text style={[styles.message, { color: colors.textSecondary }]}>
                {body}
              </Text>
            ) : (
              <View style={styles.bodyWrap}>{body}</View>
            )
          ) : null}
          {actions && actions.length > 0 ? (
            <View style={styles.actions}>
              {actions.map((action, index) => {
                const variant =
                  action.variant ??
                  (index === actions.length - 1 ? "primary" : "secondary");
                const isPrimary = variant === "primary";
                return (
                  <TouchableOpacity
                    key={action.key}
                    style={[
                      styles.actionBtn,
                      isPrimary
                        ? { backgroundColor: colors.primary }
                        : {
                            borderWidth: 1,
                            borderColor: colors.border,
                          },
                    ]}
                    onPress={action.onPress}
                  >
                    <Text
                      style={[
                        styles.actionText,
                        {
                          color: isPrimary ? colors.textOnPrimary : colors.textSecondary,
                        },
                      ]}
                    >
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  bodyWrap: {
    width: "100%",
    marginBottom: 24,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
