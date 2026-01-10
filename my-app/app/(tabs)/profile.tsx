

import { StyleSheet, ScrollView, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { getRequests, getUserProfile, saveUserProfile, getAddresses, saveAddress, deleteAddress } from '../../services/firestoreService';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import UserProfileForm from '../../components/UserProfileForm';
import AddressForm from '../../components/AddressForm';

export default function ProfileScreen() {
  const [user, loading] = useAuthState(auth);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoadingOrders(true);
      setLoadingProfile(true);
      
      const [requests, profile, userAddresses] = await Promise.all([
        getRequests(user.uid),
        getUserProfile(user.uid),
        getAddresses(user.uid),
      ]);
      
      setOrders(requests);
      setUserProfile(profile);
      setAddresses(userAddresses);
      
      // Show profile form if user hasn't completed their profile
      if (!profile || !profile.firstName || !profile.lastName || !profile.phoneNumber) {
        setShowProfileForm(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoadingOrders(false);
      setLoadingProfile(false);
    }
  };

  const handleProfileSubmit = async (profileData) => {
    try {
      await saveUserProfile(user.uid, profileData);
      setUserProfile(profileData);
      setShowProfileForm(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleAddressSubmit = async (addressData) => {
    try {
      await saveAddress(user.uid, addressData);
      const updatedAddresses = await getAddresses(user.uid);
      setAddresses(updatedAddresses);
      setShowAddressForm(false);
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address. Please try again.');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteAddress(user.uid, addressId);
      setAddresses(addresses.filter(addr => addr.id !== addressId));
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
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
          <ThemedText type="title" style={styles.title}>Profile</ThemedText>
        </ThemedView>
        <ThemedView style={styles.content}>
          <ThemedText style={styles.notLoggedIn}>Please log in to view your profile</ThemedText>
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
        <ThemedText type="title" style={styles.title}>Profile</ThemedText>
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Section */}
        <ThemedView style={styles.userInfoCard}>
          <View style={styles.sectionHeader}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Personal Information
            </ThemedText>
            <TouchableOpacity onPress={() => setShowProfileForm(true)}>
              <ThemedText style={styles.editButton}>Edit</ThemedText>
            </TouchableOpacity>
          </View>
          
          {loadingProfile ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <>
              {userProfile?.firstName && (
                <ThemedView style={styles.infoRow}>
                  <ThemedText style={styles.infoLabel}>Name:</ThemedText>
                  <ThemedText style={styles.infoValue}>
                    {userProfile.firstName} {userProfile.lastName}
                  </ThemedText>
                </ThemedView>
              )}
              <ThemedView style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Email:</ThemedText>
                <ThemedText style={styles.infoValue}>{user.email}</ThemedText>
              </ThemedView>
              {userProfile?.phoneNumber && (
                <ThemedView style={styles.infoRow}>
                  <ThemedText style={styles.infoLabel}>Phone:</ThemedText>
                  <ThemedText style={styles.infoValue}>{userProfile.phoneNumber}</ThemedText>
                </ThemedView>
              )}
            </>
          )}
          
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <ThemedText style={styles.signOutButtonText}>Sign Out</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Address Book Section */}
        <ThemedView style={styles.addressSection}>
          <View style={styles.sectionHeader}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Address Book
            </ThemedText>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddressForm(true)}
            >
              <ThemedText style={styles.addButtonText}>+ Add</ThemedText>
            </TouchableOpacity>
          </View>

          {addresses.length === 0 ? (
            <ThemedText style={styles.noAddresses}>No addresses saved</ThemedText>
          ) : (
            addresses.map((address) => (
              <ThemedView key={address.id} style={styles.addressCard}>
                <View style={styles.addressHeader}>
                  <ThemedText type="defaultSemiBold" style={styles.addressLabel}>
                    {address.label || 'Address'}
                  </ThemedText>
                  <TouchableOpacity onPress={() => handleDeleteAddress(address.id)}>
                    <ThemedText style={styles.deleteButton}>Delete</ThemedText>
                  </TouchableOpacity>
                </View>
                <ThemedText style={styles.addressText}>{address.streetAddress}</ThemedText>
                <ThemedText style={styles.addressText}>
                  {address.city}, {address.province} {address.postalCode}
                </ThemedText>
              </ThemedView>
            ))
          )}
        </ThemedView>

        {/* Order History Section */}
        <ThemedView style={styles.orderHistorySection}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Order History
          </ThemedText>
          
          {loadingOrders ? (
            <ActivityIndicator size="small" color="#000000" style={styles.loader} />
          ) : orders.length === 0 ? (
            <ThemedText style={styles.noOrders}>No orders yet</ThemedText>
          ) : (
            orders.map((order) => (
              <ThemedView key={order.id} style={styles.orderCard}>
                <ThemedView style={styles.orderHeader}>
                  <ThemedText type="defaultSemiBold" style={styles.orderId}>
                    Order #{order.id.substring(0, 8)}
                  </ThemedText>
                  <ThemedView style={[
                    styles.statusBadge,
                    order.status === 'completed' && styles.statusCompleted,
                    order.status === 'pending' && styles.statusPending,
                    order.status === 'in_progress' && styles.statusInProgress,
                  ]}>
                    <ThemedText style={styles.statusText}>
                      {order.status || 'pending'}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
                
                <ThemedText style={styles.orderDate}>
                  {order.createdAt?.toDate?.()?.toLocaleDateString() || 'Date unavailable'}
                </ThemedText>

                {order.deliveryAddress && (
                  <ThemedView style={styles.orderAddress}>
                    <ThemedText style={styles.orderAddressLabel}>
                      Delivery Address:
                    </ThemedText>
                    <ThemedText style={styles.orderAddressText}>
                      {order.deliveryAddress.streetAddress}
                    </ThemedText>
                    <ThemedText style={styles.orderAddressText}>
                      {order.deliveryAddress.city}, {order.deliveryAddress.province} {order.deliveryAddress.postalCode}
                    </ThemedText>
                  </ThemedView>
                )}

                {order.items && order.items.length > 0 && (
                  <ThemedView style={styles.orderItems}>
                    {order.items.map((item, index) => (
                      <ThemedText key={index} style={styles.orderItem}>
                        • {item.name} x{item.quantity} - R{(item.price * item.quantity).toFixed(2)}
                      </ThemedText>
                    ))}
                  </ThemedView>
                )}

                <ThemedText style={styles.orderTotal}>
                  Total: R{order.items && order.items.length > 0 
                    ? order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)
                    : '0.00'}
                </ThemedText>
              </ThemedView>
            ))
          )}
        </ThemedView>
      </ScrollView>

      <UserProfileForm
        visible={showProfileForm}
        onSubmit={handleProfileSubmit}
        onSkip={() => setShowProfileForm(false)}
        initialData={userProfile}
      />

      <AddressForm
        visible={showAddressForm}
        onSubmit={handleAddressSubmit}
        onCancel={() => setShowAddressForm(false)}
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
  },
  title: {
    color: '#000000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  notLoggedIn: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfoCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#000000',
  },
  editButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
  },
  infoValue: {
    fontSize: 14,
    color: '#000000',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressSection: {
    backgroundColor: 'transparent',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noAddresses: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
  addressCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  addressLabel: {
    fontSize: 16,
    color: '#000000',
  },
  deleteButton: {
    color: '#FF3B30',
    fontSize: 14,
  },
  addressText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  orderHistorySection: {
    backgroundColor: 'transparent',
  },
  loader: {
    marginTop: 20,
  },
  noOrders: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
  orderCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  orderId: {
    fontSize: 16,
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },
  statusPending: {
    backgroundColor: '#FFA500',
  },
  statusInProgress: {
    backgroundColor: '#007AFF',
  },
  statusCompleted: {
    backgroundColor: '#34C759',
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  orderDate: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 12,
  },
  orderAddress: {
    backgroundColor: '#E8F4F8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  orderAddressLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
    marginBottom: 4,
  },
  orderAddressText: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 2,
  },
  orderItems: {
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  orderItem: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'right',
  },
});
