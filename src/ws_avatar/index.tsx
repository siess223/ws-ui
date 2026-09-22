import { useWsTheme as useTheme } from "../theme/context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type WsAvatarSize = "small" | "default" | "large" | number;

export type WsAvatarProps = {
  /** Image URL. Falls back to initials / icon when missing or failed. */
  src?: string | null;
  /** Name used to derive initials fallback. */
  name?: string;
  size?: WsAvatarSize;
  /** Square with rounded corners instead of circle. */
  rounded?: boolean;
  style?: StyleProp<ViewStyle>;
};

const SIZE_MAP: Record<Exclude<WsAvatarSize, number>, number> = {
  small: 28,
  default: 40,
  large: 64,
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * `ws_avatar` — user avatar with image / initials / icon fallback
 * (antd-mobile Avatar).
 */
export default function WsAvatar({
  src,
  name,
  size = "default",
  rounded = false,
  style,
}: WsAvatarProps) {
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);
  const px = typeof size === "number" ? size : SIZE_MAP[size];
  const radius = rounded ? Math.max(6, px * 0.22) : px / 2;
  const initials = name ? initialsOf(name) : "";
  const showImage = !!src && !failed;

  return (
    <View
      style={[
        styles.base,
        {
          width: px,
          height: px,
          borderRadius: radius,
          backgroundColor: `${colors.primary}14`,
        },
        style,
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri: src! }}
          style={{ width: px, height: px, borderRadius: radius }}
          contentFit="cover"
          onError={() => setFailed(true)}
        />
      ) : initials ? (
        <Text
          style={[
            styles.initials,
            { color: colors.primary, fontSize: Math.max(11, px * 0.36) },
          ]}
          numberOfLines={1}
        >
          {initials}
        </Text>
      ) : (
        <Ionicons name="person" size={px * 0.55} color={colors.textMuted} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  initials: { fontWeight: "700" },
});
