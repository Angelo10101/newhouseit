import React, { useRef } from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface PaymentWebViewProps {
  visible: boolean;
  paymentUrl: string;
  onSuccess: (reference: string) => void;
  onCancel: () => void;
  onError: (error: string) => void;
}

export default function PaymentWebView({
  visible,
  paymentUrl,
  onSuccess,
  onCancel,
  onError
}: PaymentWebViewProps) {
  const webViewRef = useRef<WebView>(null);

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    
    // Check if the URL indicates payment success or cancellation
    // Paystack callback URL format: myapp://payment/callback?reference=xxx&trxref=xxx&status=success
    if (url.includes('myapp://payment/callback')) {
      try {
        // Parse query parameters from deep link URL
        const queryString = url.split('?')[1];
        if (!queryString) {
          onError('Invalid payment callback URL');
          return;
        }
        
        const params = new URLSearchParams(queryString);
        const status = params.get('status');
        const reference = params.get('reference') || params.get('trxref');
        
        if (status === 'success' && reference) {
          onSuccess(reference);
        } else if (status === 'cancelled') {
          onCancel();
        } else {
          onError('Payment was not completed');
        }
      } catch (e) {
        console.error('Error parsing payment callback URL:', e);
        onError('Failed to process payment response');
      }
    }
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    onError('Failed to load payment page. Please try again.');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onCancel}
    >
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle" style={styles.title}>
            Complete Payment
          </ThemedText>
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <ThemedText style={styles.closeButtonText}>✕</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <WebView
          ref={webViewRef}
          source={{ uri: paymentUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          onError={handleError}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000000" />
              <ThemedText style={styles.loadingText}>Loading payment page...</ThemedText>
            </View>
          )}
          style={styles.webview}
          // iOS specific props for better compatibility
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          // Security props
          javaScriptEnabled={true}
          domStorageEnabled={true}
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
        />
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    color: '#000000',
    fontSize: 18,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#000000',
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
});
