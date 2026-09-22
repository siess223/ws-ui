import Text from "../text/WsText";
import { useWsTheme as useTheme } from "../theme/context";
import { shadows } from "../theme/shadows";
import { Ionicons } from "@expo/vector-icons";
import React, { type ReactNode } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import WsCard from "../ws_card";

export type WsListItemProps = {
  icon?: string;
  label: string;
  onPress?: () => void;
  color?: string;
  rightElement?: ReactNode;
  backgroundColor?: string;
  borderColor?: string;
  iconColor?: string;
  iconBackgroundColor?: string;
  chevronColor?: string;
  showDivider?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * `ws_list` item — settings / menu row (antd-mobile List.Item).
 */
export function WsListItem({
  icon,
  label,
  onPress,
  color,
  rightElement,
  backgroundColor,
  borderColor,
  iconColor,
  iconBackgroundColor,
  chevronColor,
  showDivider = true,
  disabled = false,
  style,
}: WsListItemProps) {
  const { colors } = useTheme();
  const fg = color ?? colors.textPrimary;
  const border = borderColor ?? colors.border;
  const ic = iconColor ?? colors.primary;
  const icBg = iconBackgroundColor ?? `${ic}18`;
  const chevron = chevronColor ?? colors.textMuted;

  return (
    <TouchableOpacity
      style={[
        styles.item,
        {
          borderColor: border,
          borderBottomWidth: showDivider ? StyleSheet.hairlineWidth : 0,
        },
        backgroundColor ? { backgroundColor } : undefined,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
    >
      <View style={styles.left}>
        {icon ? (
          <View style={[styles.iconContainer, { backgroundColor: icBg }]}>
            <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={20} color={ic} />
          </View>
        ) : null}
        <Text style={[styles.label, { color: fg }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
      {rightElement ? (
        rightElement
      ) : onPress ? (
        <Ionicons name="chevron-forward-outline" size={22} color={chevron} />
      ) : null}
    </TouchableOpacity>
  );
}

export type WsListSectionItem = {
  icon?: string;
  label: string;
  onPress?: () => void;
  color?: string;
  rightElement?: ReactNode;
};

export type WsListProps = {
  title?: string;
  items: WsListSectionItem[];
  titleColor?: string;
  cardBackgroundColor?: string;
  itemTextColor?: string;
  borderColor?: string;
  iconColor?: string;
  chevronColor?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

/**
 * `ws_list` — grouped list section with card shell (antd-mobile List).
 * Pass `items` for MenuItem-style rows, or `children` for custom rows.
 */
export default function WsList({
  title,
  items,
  titleColor,
  cardBackgroundColor,
  itemTextColor,
  borderColor,
  iconColor,
  chevronColor,
  style,
  children,
}: WsListProps) {
  const { colors } = useTheme();
  const titleFg = titleColor ?? colors.textSecondary;
  const cardBg = cardBackgroundColor ?? colors.card;
  const itemFg = itemTextColor ?? colors.textPrimary;
  const border = borderColor ?? colors.border;
  const ic = iconColor ?? colors.primary;
  const chevron = chevronColor ?? colors.textMuted;

  return (
    <View style={[styles.section, style]}>
      {title ? (
        <Text style={[styles.sectionTitle, { color: titleFg }]}>{title}</Text>
      ) : null}
      <WsCard
        backgroundColor={cardBg}
        style={[styles.card, { borderColor: border }, shadows.sm]}
        shadow={false}
        bordered
      >
        {children ??
          items.map((item, idx) => (
            <WsListItem
              key={`${item.label}-${idx}`}
              {...item}
              color={item.color || itemFg}
              borderColor={border}
              iconColor={ic}
              iconBackgroundColor={`${ic}18`}
              chevronColor={chevron}
              showDivider={idx < items.length - 1}
            />
          ))}
      </WsCard>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 9,
    marginHorizontal: 20,
  },
  card: {
    marginHorizontal: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 62,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  disabled: { opacity: 0.45 },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
});
