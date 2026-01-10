import React from 'react';
import { TextInput, Platform, StyleSheet } from 'react-native';

/**
 * Lightweight wrapper to make placeholders consistent across platforms.
 * Usage:
 * <PlaceholderTextInput
 *   placeholder="First name"
 *   value={firstName}
 *   onChangeText={setFirstName}
 * />
 */
export default function PlaceholderTextInput(props) {
  const {
    placeholder,
    placeholderTextColor = '#8a8a8a',
    style,
    ...rest
  } = props;

  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      underlineColorAndroid="transparent"
      {...rest}
      style={[styles.input, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    color: '#000', // visible input text color
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});
