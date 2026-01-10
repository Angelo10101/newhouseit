
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';

interface Address {
  id: string;
  label?: string;
  streetAddress: string;
  city: string;
  province: string;
  postalCode: string;
}

interface AddressSelectorProps {
  visible: boolean;
  addresses: Address[];
  selectedAddressId: string | null;
  onSelectAddress: (addressId: string) => void;
  onCancel: () => void;
  onAddNewAddress: () => void;
}

export default function AddressSelector({
  visible,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onCancel,
  onAddNewAddress,
}: AddressSelectorProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Delivery Address</Text>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.addressList}
            showsVerticalScrollIndicator={false}
          >
            {addresses.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  You don&apos;t have any saved addresses yet.
                </Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={onAddNewAddress}
                >
                  <Text style={styles.addButtonText}>Add New Address</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {addresses.map((address) => (
                  <TouchableOpacity
                    key={address.id}
                    style={[
                      styles.addressCard,
                      selectedAddressId === address.id && styles.selectedCard,
                    ]}
                    onPress={() => onSelectAddress(address.id)}
                  >
                    <View style={styles.addressContent}>
                      <View style={styles.addressHeader}>
                        <Text style={styles.addressLabel}>
                          {address.label || 'Address'}
                        </Text>
                        {selectedAddressId === address.id && (
                          <View style={styles.selectedBadge}>
                            <Text style={styles.selectedBadgeText}>✓ Selected</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.addressText}>{address.streetAddress}</Text>
                      <Text style={styles.addressText}>
                        {address.city}, {address.province} {address.postalCode}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
                
                <TouchableOpacity
                  style={styles.addNewButton}
                  onPress={onAddNewAddress}
                >
                  <Text style={styles.addNewButtonText}>+ Add New Address</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>

          {addresses.length > 0 && selectedAddressId && (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={onCancel}
            >
              <Text style={styles.confirmButtonText}>Confirm Address</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  cancelText: {
    fontSize: 16,
    color: '#007AFF',
  },
  addressList: {
    padding: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#000000',
    backgroundColor: '#F0F0F0',
  },
  addressContent: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  selectedBadge: {
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addressText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  addNewButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderStyle: 'dashed',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addNewButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#000000',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
