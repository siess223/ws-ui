import React, { forwardRef, memo } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  type TextInput,
  type TextInputProps,
} from "react-native";
import { useWsTheme as useTheme } from "../theme/context";
import { shouldShowCharacterCount } from "../theme/characterCount";
import { inputTokens } from "../tokens";
import WsInput from "../ws_input";

export type WsFormFieldProps = TextInputProps & {
  label: string;
  error?: string;
  showCounter?: boolean;
};

/**
 * `ws_form_field` �?bordered labeled field (profile / listings forms).
 */
const WsFormField = memo(
  forwardRef<TextInput, WsFormFieldProps>(function WsFormField(
    {
      label,
      value,
      onChangeText,
      placeholder,
      keyboardType = "default",
      multiline = false,
      numberOfLines = 1,
      maxLength,
      autoCapitalize = "sentences",
      error,
      showCounter = false,
      testID,
      style,
      ...rest
    },
    ref,
  ) {
    const { colors } = useTheme();

    const valueLength = typeof value === "string" ? value.length : 0;
    const counterVisible =
      showCounter &&
      maxLength !== undefined &&
      shouldShowCharacterCount(valueLength, maxLength);
    const atLimit = maxLength !== undefined && valueLength >= maxLength;

    return (
      <View style={styles.fieldContainer}>
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          {label}
        </Text>
        <WsInput
          ref={ref}
          testID={testID}
          style={[
            styles.input,
            multiline && styles.textArea,
            {
              backgroundColor: colors.surface,
              borderColor: error ? colors.error : colors.border,
            },
            style,
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          {...rest}
        />
        {error ? (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        ) : null}
        {counterVisible ? (
          <Text
            style={[
              styles.counter,
              { color: atLimit ? colors.error : colors.textMuted },
            ]}
          >
            {valueLength}/{maxLength}
          </Text>
        ) : null}
      </View>
    );
  }),
);

WsFormField.displayName = "WsFormField";

export default WsFormField;

const styles = StyleSheet.create({
  fieldContainer: { marginBottom: 16 },
  label: {
    fontSize: inputTokens.labelSize,
    fontWeight: "500",
    marginBottom: 6,
  },
  errorText: { fontSize: inputTokens.helperSize, marginTop: 4 },
  counter: {
    fontSize: inputTokens.helperSize,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  input: {
    borderWidth: 1,
    borderRadius: inputTokens.radius,
    paddingHorizontal: inputTokens.paddingHorizontal,
    minHeight: inputTokens.minHeight,
    fontSize: 14,
    ...(Platform.OS === "android" ? { lineHeight: 20 } : null),
    shadowColor: "#101828",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    height: 100,
    minHeight: 100,
    paddingTop: inputTokens.paddingVertical,
  },
});
