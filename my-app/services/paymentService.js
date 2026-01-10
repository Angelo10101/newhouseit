import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

/**
 * Initialize a payment with Paystack
 * @param {string} email - User's email address
 * @param {number} amount - Amount in Rand (will be converted to kobo)
 * @param {object} metadata - Optional metadata to attach to the transaction
 * @returns {Promise<object>} Payment initialization response with authorization_url
 */
export const initiatePayment = async (email, amount, metadata = {}) => {
  try {
    const initiatePaymentFn = httpsCallable(functions, 'initiatePayment');
    
    const result = await initiatePaymentFn({
      email,
      amount,
      metadata,
      callback_url: 'myapp://payment/callback' // Deep link for app callback
    });

    if (result.data.success) {
      return {
        success: true,
        authorizationUrl: result.data.authorization_url,
        accessCode: result.data.access_code,
        reference: result.data.reference
      };
    } else {
      throw new Error(result.data.error || 'Failed to initialize payment');
    }
  } catch (error) {
    console.error('Error initiating payment:', error);
    throw error;
  }
};

/**
 * Verify a payment transaction
 * @param {string} reference - Transaction reference to verify
 * @returns {Promise<object>} Payment verification response
 */
export const verifyPayment = async (reference) => {
  try {
    const verifyPaymentFn = httpsCallable(functions, 'verifyPayment');
    
    const result = await verifyPaymentFn({
      reference
    });

    if (result.data.success) {
      return {
        success: true,
        status: result.data.status,
        amount: result.data.amount,
        reference: result.data.reference,
        metadata: result.data.metadata
      };
    } else {
      throw new Error(result.data.error || 'Failed to verify payment');
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};
