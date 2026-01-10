# Payment Processing Setup Guide

This guide explains how to set up and use the Paystack payment integration in your HouseIt app.

## Prerequisites

1. Paystack account with a valid Secret Key
2. Firebase project configured
3. Node.js and npm installed
4. Firebase CLI installed (`npm install -g firebase-tools`)

## Setup Steps

### 1. Configure Paystack Secret Key

Set your Paystack secret key as an environment variable in Firebase Functions:

```bash
cd my-app/functions
firebase functions:config:set paystack.secret_key="YOUR_PAYSTACK_SECRET_KEY"
```

To verify the configuration:
```bash
firebase functions:config:get
```

### 2. Install Firebase Functions Dependencies

```bash
cd my-app/functions
pip install -r requirements.txt
```

### 3. Deploy Firebase Functions

Deploy the payment functions to Firebase:

```bash
cd my-app
firebase deploy --only functions
```

This will deploy:
- `initiatePayment` - Initialize a payment transaction
- `verifyPayment` - Verify a completed payment

### 4. Install React Native Dependencies

The required dependencies are already in package.json:
- `react-native-webview@13.15.0` - For displaying Paystack checkout
- `firebase@^12.0.0` - For Firebase integration

If not installed:
```bash
cd my-app
npm install
```

### 5. iOS Configuration (EAS Build)

The app is already configured with the URL scheme `myapp://` in `app.json`:

```json
{
  "expo": {
    "scheme": "myapp"
  }
}
```

This allows the app to handle deep links from Paystack payment callbacks.

## How It Works

### Payment Flow

1. **User adds items to cart** and proceeds to checkout
2. **User selects delivery address** and service date/time
3. **User clicks "Proceed to Payment"**
4. **App calls `initiatePayment` Firebase function** with:
   - User email
   - Total amount (in Rand)
   - Order metadata
5. **Firebase function calls Paystack API** to initialize transaction
6. **App receives authorization URL** and opens it in WebView
7. **User completes payment** on Paystack's secure checkout page
8. **Paystack redirects** to app's callback URL: `myapp://payment/callback?reference=xxx&status=success`
9. **App detects callback URL** and closes WebView
10. **App calls `verifyPayment`** to confirm transaction with Paystack
11. **App saves order** with payment details to Firestore
12. **Cart is cleared** and user is redirected to orders page

### Files Modified/Created

#### New Files:
- `my-app/components/PaymentWebView.tsx` - WebView component for Paystack checkout
- `my-app/services/paymentService.js` - Payment service with Firebase Functions integration
- `my-app/functions/main.py` - Firebase Cloud Functions for payment processing

#### Modified Files:
- `my-app/app/(tabs)/cart.tsx` - Added payment flow integration
- `my-app/firebase.js` - Added Firebase Functions initialization
- `my-app/functions/requirements.txt` - Added requests library

## Testing

### Test Mode
Paystack provides test cards for testing:

**Successful Payment:**
- Card: `4084 0840 8408 4081`
- CVV: Any 3 digits
- Expiry: Any future date
- PIN: `0000`
- OTP: `123456`

**Failed Payment:**
- Card: `5060 6666 6666 6666`
- CVV: Any 3 digits
- Expiry: Any future date

### Testing Steps

1. Add items to cart
2. Select delivery address and service date/time
3. Click "Proceed to Payment"
4. Use test card details on Paystack checkout
5. Complete payment and verify order is saved

## Security Considerations

1. **Secret Key**: Never expose your Paystack secret key in client-side code. It's stored securely in Firebase Functions environment variables.

2. **Payment Verification**: Always verify payment on the server side using the `verifyPayment` function before fulfilling orders.

3. **HTTPS**: Paystack requires HTTPS for production. Ensure your Firebase project is properly configured.

4. **WebView Security**: The WebView component has security settings enabled:
   - JavaScript enabled (required for Paystack)
   - DOM storage enabled
   - Third-party cookies enabled (for Paystack session)

## Currency

The implementation uses **South African Rand (ZAR)**. Paystack requires amounts in the smallest currency unit (kobo for Naira, cents for Rand), so the implementation multiplies by 100 before sending to Paystack.

To change currency, update the `currency` field in `functions/main.py`:
```python
payload = {
    "currency": "ZAR",  # Change to NGN, GHS, USD, etc.
    ...
}
```

## Troubleshooting

### Payment initialization fails
- Check Firebase Functions logs: `firebase functions:log`
- Verify Paystack secret key is configured correctly
- Ensure Firebase Functions are deployed

### WebView doesn't load
- Check internet connection
- Verify Paystack authorization URL is valid
- Check WebView error logs in console

### Payment callback not working
- Verify URL scheme matches in `app.json` and `paymentService.js`
- Check deep link configuration for iOS
- Test callback URL: `myapp://payment/callback?reference=test&status=success`

### Order not saved after payment
- Check `verifyPayment` function logs
- Verify Firestore permissions
- Check network connectivity

## Support

For Paystack-specific issues, refer to:
- [Paystack Documentation](https://paystack.com/docs)
- [Paystack API Reference](https://paystack.com/docs/api)

For Firebase Functions issues:
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
