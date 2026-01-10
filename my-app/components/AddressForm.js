
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';

export default function AddressForm({ visible, onSubmit, onCancel }) {
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [label, setLabel] = useState('');

  const resetForm = () => {
    setStreetAddress('');
    setCity('');
    setProvince('');
    setPostalCode('');
    setLabel('');
  };

  const handleSubmit = () => {
    if (!streetAddress.trim() || !city.trim() || !province.trim() || !postalCode.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    onSubmit({
      streetAddress: streetAddress.trim(),
      city: city.trim(),
      province: province.trim(),
      postalCode: postalCode.trim(),
      label: label.trim() || 'Home',
    });

    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Add New Address</Text>

            <Text style={styles.label}>Address Label (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Home, Work, Office"
              placeholderTextColor="#888"
              value={label}
              onChangeText={setLabel}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Street Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="123 Main Street"
              placeholderTextColor="#888"
              value={streetAddress}
              onChangeText={setStreetAddress}
              autoCapitalize="words"
            />

            <Text style={styles.label}>City *</Text>
            <TextInput
              style={styles.input}
              placeholder="Johannesburg"
              placeholderTextColor="#888"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Province *</Text>
            <TextInput
              style={styles.input}
              placeholder="Gauteng"
              placeholderTextColor="#888"
              value={province}
              onChangeText={setProvince}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Postal Code *</Text>
            <TextInput
              style={styles.input}
              placeholder="2000"
              placeholderTextColor="#888"
              value={postalCode}
              onChangeText={setPostalCode}
              keyboardType="numeric"
              maxLength={4}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Save Address</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  submitButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
  },
});
