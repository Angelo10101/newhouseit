
import { StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { auth } from '../../firebase';
import { getCartItems, clearCart, saveRequest, getAddresses, saveAddress } from '../../services/firestoreService';
import { initiatePayment, verifyPayment } from '../../services/paymentService';
import AddressSelector from '@/components/AddressSelector';
import AddressForm from '@/components/AddressForm';
import DateTimePickerComponent from '@/components/DateTimePicker';
import PaymentWebView from '@/components/PaymentWebView';

interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
}

interface Address {
  id: string;
  label?: string;
  streetAddress: string;
  city: string;
  province: string;
  postalCode: string;
}

interface AddressFormData {
  label?: string;
  streetAddress: string;
  city: string;
  province: string;
  postalCode: string;
}

export default function CartScreen() {
  const [user, loading] = useAuthState(auth);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [showPaymentWebView, setShowPaymentWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      loadCart();
      loadAddresses();
    } else {
      setLoadingCart(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      if (user?.uid) {
        loadCart();
        loadAddresses();
      }
    }, [user])
  );

  const loadCart = async () => {
    if (!user?.uid) return;
    try {
      setLoadingCart(true);
      const items = await getCartItems(user.uid);
      setCartItems(items as CartItem[]);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoadingCart(false);
    }
  };

  const loadAddresses = async () => {
    if (!user?.uid) return;
    try {
      const userAddresses = await getAddresses(user.uid);
      setAddresses(userAddresses as Address[]);
      // Auto-select the first address if available and none is selected
      if (userAddresses.length > 0 && !selectedAddressId) {
        setSelectedAddressId(userAddresses[0].id);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty');
      return;
    }

    // Check if user has any addresses
    if (addresses.length === 0) {
      Alert.alert(
        'No Address',
        'Please add a delivery address before placing your order.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Address', onPress: () => setShowAddressForm(true) }
        ]
      );
      return;
    }

    // Check if an address is selected
    if (!selectedAddressId) {
      Alert.alert('No Address Selected', 'Please select a delivery address.');
      setShowAddressSelector(true);
      return;
    }

    // Check if a date/time is selected
    if (!selectedDateTime) {
      Alert.alert('No Date/Time Selected', 'Please select when you\'d like the service.');
      setShowDateTimePicker(true);
      return;
    }

    if (!user?.uid || !user?.email) return;
    
    try {
      setProcessingPayment(true);
      
      const totalAmount = parseFloat(getTotalPrice());
      const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
      
      // Prepare metadata to include order details
      const metadata = {
        userId: user.uid,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        addressId: selectedAddressId,
        scheduledDateTime: selectedDateTime?.toISOString()
      };
      
      // Step 1: Initialize payment with Paystack
      const paymentInit = await initiatePayment(user.email, totalAmount, metadata);
      
      if (paymentInit.success && paymentInit.authorizationUrl) {
        // Store payment reference for later verification
        setPaymentReference(paymentInit.reference);
        setPaymentUrl(paymentInit.authorizationUrl);
        setShowPaymentWebView(true);
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      Alert.alert('Payment Error', 'Failed to initialize payment. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePaymentSuccess = async (reference: string) => {
    if (!user?.uid) return;
    
    try {
      setProcessingPayment(true);
      setShowPaymentWebView(false);
      
      // Step 1: Verify payment with Paystack
      const verification = await verifyPayment(reference);
      
      if (verification.success && verification.status === 'success') {
        // Step 2: Payment verified, save the order
        const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
        const requestData = {
          items: cartItems,
          total: parseFloat(getTotalPrice()),
          status: 'paid',
          paymentStatus: 'completed',
          paymentReference: reference,
          deliveryAddress: selectedAddress,
          scheduledDateTime: selectedDateTime?.toISOString(),
        };

        await saveRequest(user.uid, requestData);
        await clearCart(user.uid);
        setCartItems([]);
        setSelectedDateTime(null);
        setPaymentReference('');
        
        Alert.alert('Success', 'Payment completed! Your order has been placed.', [
          { text: 'OK', onPress: () => router.push('/(tabs)/profile') }
        ]);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      Alert.alert('Verification Error', 'Payment verification failed. Please contact support with reference: ' + reference);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentWebView(false);
    setPaymentReference('');
    Alert.alert('Payment Cancelled', 'You cancelled the payment. Your items are still in the cart.');
  };

  const handlePaymentError = (error: string) => {
    setShowPaymentWebView(false);
    setPaymentReference('');
    Alert.alert('Payment Error', error);
  };

  const handleClearCart = async () => {
    if (!user?.uid) return;
    
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            if (!user?.uid) return;
            try {
              await clearCart(user.uid);
              setCartItems([]);
              Alert.alert('Success', 'Cart cleared');
            } catch (error) {
              console.error('Error clearing cart:', error);
              Alert.alert('Error', 'Failed to clear cart');
            }
          },
        },
      ]
    );
  };

  const handleAddressSubmit = async (addressData: AddressFormData) => {
    if (!user?.uid) return;
    
    try {
      const newAddressId = await saveAddress(user.uid, addressData);
      await loadAddresses();
      setShowAddressForm(false);
      // Auto-select the newly added address
      if (newAddressId) {
        setSelectedAddressId(newAddressId);
      }
      Alert.alert('Success', 'Address added successfully');
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save address. Please try again.');
    }
  };

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const getSelectedAddressDisplay = () => {
    if (!selectedAddressId) return null;
    const address = addresses.find(addr => addr.id === selectedAddressId);
    if (!address) return null;
    return `${address.label || 'Address'}: ${address.streetAddress}, ${address.city}`;
  };

  const handleSelectDateTime = (dateTime: Date) => {
    setSelectedDateTime(dateTime);
    setShowDateTimePicker(false);
  };

  const formatSelectedDateTime = () => {
    if (!selectedDateTime) return null;
    return selectedDateTime.toLocaleString('en-ZA', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  if (loading || loadingCart) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#000000" />
      </ThemedView>
    );
  }

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>Cart</ThemedText>
        </ThemedView>
        <ThemedView style={styles.content}>
          <ThemedText style={styles.emptyText}>Please log in to view your cart</ThemedText>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/auth')}
          >
            <ThemedText style={styles.loginButtonText}>Log In</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Cart</ThemedText>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <ThemedText style={styles.clearButton}>Clear All</ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      {cartItems.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>Your cart is empty</ThemedText>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)/')}
          >
            <ThemedText style={styles.browseButtonText}>Browse Services</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <>
          <ScrollView 
            style={styles.itemsContainer} 
            contentContainerStyle={styles.itemsContentContainer}
            showsVerticalScrollIndicator={false}
          >
            {cartItems.map((item) => (
              <ThemedView key={item.id} style={styles.cartItem}>
                <ThemedView style={styles.itemInfo}>
                  <ThemedText type="defaultSemiBold" style={styles.itemName}>
                    {item.name}
                  </ThemedText>
                  {item.description && (
                    <ThemedText style={styles.itemDescription}>
                      {item.description}
                    </ThemedText>
                  )}
                  <ThemedText style={styles.itemPrice}>
                    R{item.price} x {item.quantity}
                  </ThemedText>
                </ThemedView>
                <ThemedText style={styles.itemTotal}>
                  R{(item.price * item.quantity).toFixed(2)}
                </ThemedText>
              </ThemedView>
            ))}
            {/* Add padding at bottom to ensure content doesn't hide behind checkout container */}
            <ThemedView style={styles.bottomSpacer} />
          </ScrollView>

          <ThemedView style={styles.checkoutContainer}>
            {/* Delivery Address Section */}
            <TouchableOpacity
              style={styles.addressSelector}
              onPress={() => setShowAddressSelector(true)}
            >
              <ThemedView style={styles.addressSelectorContent}>
                <ThemedText style={styles.addressLabel}>Delivery Address:</ThemedText>
                {selectedAddressId ? (
                  <ThemedText style={styles.addressValue} numberOfLines={1}>
                    {getSelectedAddressDisplay()}
                  </ThemedText>
                ) : (
                  <ThemedText style={styles.addressPlaceholder}>
                    Tap to select address
                  </ThemedText>
                )}
              </ThemedView>
              <ThemedText style={styles.changeButton}>Change</ThemedText>
            </TouchableOpacity>

            {/* Date & Time Selection */}
            <TouchableOpacity
              style={styles.addressSelector}
              onPress={() => setShowDateTimePicker(true)}
            >
              <ThemedView style={styles.addressSelectorContent}>
                <ThemedText style={styles.addressLabel}>Service Date & Time:</ThemedText>
                {selectedDateTime ? (
                  <ThemedText style={styles.addressValue} numberOfLines={1}>
                    {formatSelectedDateTime()}
                  </ThemedText>
                ) : (
                  <ThemedText style={styles.addressPlaceholder}>
                    Tap to select date & time
                  </ThemedText>
                )}
              </ThemedView>
              <ThemedText style={styles.changeButton}>Change</ThemedText>
            </TouchableOpacity>

            <ThemedView style={styles.totalRow}>
              <ThemedText type="defaultSemiBold" style={styles.totalLabel}>
                Total:
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.totalAmount}>
                R{getTotalPrice()}
              </ThemedText>
            </ThemedView>
            <TouchableOpacity
              style={[styles.checkoutButton, processingPayment && styles.checkoutButtonDisabled]}
              onPress={handleCheckout}
              disabled={processingPayment}
            >
              {processingPayment ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.checkoutButtonText}>
                  Proceed to Payment
                </ThemedText>
              )}
            </TouchableOpacity>
          </ThemedView>
        </>
      )}

      <AddressSelector
        visible={showAddressSelector}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        onSelectAddress={handleSelectAddress}
        onCancel={() => setShowAddressSelector(false)}
        onAddNewAddress={() => {
          setShowAddressSelector(false);
          setShowAddressForm(true);
        }}
      />

      <AddressForm
        visible={showAddressForm}
        onSubmit={handleAddressSubmit}
        onCancel={() => setShowAddressForm(false)}
      />

      <DateTimePickerComponent
        visible={showDateTimePicker}
        selectedDateTime={selectedDateTime}
        onSelectDateTime={handleSelectDateTime}
        onCancel={() => setShowDateTimePicker(false)}
      />

      <PaymentWebView
        visible={showPaymentWebView}
        paymentUrl={paymentUrl}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
        onError={handlePaymentError}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#000000',
  },
  clearButton: {
    color: '#FF3B30',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  browseButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemsContainer: {
    flex: 1,
  },
  itemsContentContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  bottomSpacer: {
    // Height accounts for: 2 selectors (160px) + total row (40px) + button (48px) + padding/margins (32px) = 280px
    height: 280,
    backgroundColor: 'transparent',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  itemName: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666666',
  },
  itemTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingBottom: 90,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  addressSelector: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressSelectorContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  addressLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  addressValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  addressPlaceholder: {
    fontSize: 14,
    color: '#999999',
    fontStyle: 'italic',
  },
  changeButton: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  totalLabel: {
    fontSize: 20,
    color: '#000000',
  },
  totalAmount: {
    fontSize: 20,
    color: '#000000',
  },
  checkoutButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#666666',
    opacity: 0.6,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
