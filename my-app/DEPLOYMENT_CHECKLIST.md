# Payment Integration Deployment Checklist

Before deploying the payment processing feature to production, complete these steps:

## 1. Paystack Configuration

- [ ] **Get Paystack Secret Key**
  - Log in to your Paystack Dashboard
  - Navigate to Settings → API Keys & Webhooks
  - Copy your **Secret Key** (starts with `sk_`)
  - ⚠️ Keep this key secure! Never commit it to git

- [ ] **Set up Firebase Environment Variable**
  ```bash
  cd my-app/functions
  firebase functions:config:set paystack.secret_key="YOUR_SECRET_KEY_HERE"
  ```

- [ ] **Verify Configuration**
  ```bash
  firebase functions:config:get
  ```
  Should show: `{ "paystack": { "secret_key": "sk_..." } }`

## 2. Install Dependencies

- [ ] **Install React Native Dependencies**
  ```bash
  cd my-app
  npm install
  ```

- [ ] **Install Python Dependencies**
  ```bash
  cd my-app/functions
  pip install -r requirements.txt
  ```

## 3. Deploy Firebase Functions

- [ ] **Deploy to Firebase**
  ```bash
  cd my-app
  firebase deploy --only functions
  ```

- [ ] **Verify Deployment**
  - Check Firebase Console → Functions
  - Should see `initiatePayment` and `verifyPayment` functions listed

## 4. Test the Payment Flow

### Test in Development

- [ ] **Use Paystack Test Mode**
  - Ensure you're using test secret key (starts with `sk_test_`)
  
- [ ] **Test Successful Payment**
  - Add items to cart
  - Proceed to checkout
  - Use test card: `4084 0840 8408 4081`
  - CVV: `123`, PIN: `0000`, OTP: `123456`
  - Verify order is created with status `paid`

- [ ] **Test Failed Payment**
  - Use test card: `5060 6666 6666 6666`
  - Verify payment fails gracefully
  - Verify cart items are not cleared

- [ ] **Test Payment Cancellation**
  - Start payment process
  - Click cancel/back on Paystack page
  - Verify cart items remain

### Test on iOS Device

- [ ] **Build with EAS**
  ```bash
  cd my-app
  eas build --platform ios --profile development
  ```

- [ ] **Install on Device**
  - Download and install the build
  - Test complete payment flow
  - Verify deep link callback works

## 5. Production Deployment

- [ ] **Switch to Production Keys**
  ```bash
  firebase functions:config:set paystack.secret_key="YOUR_PRODUCTION_KEY"
  firebase deploy --only functions
  ```

- [ ] **Update Paystack Webhook** (Optional but recommended)
  - Go to Paystack Dashboard → Settings → Webhooks
  - Add webhook URL: `https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/verifyPayment`
  - This allows you to receive payment notifications server-side

- [ ] **Build Production App**
  ```bash
  eas build --platform ios --profile production
  ```

## 6. Monitoring and Logging

- [ ] **Enable Firebase Functions Logs**
  - Monitor payment functions: `firebase functions:log`
  - Check for errors in Firebase Console

- [ ] **Set up Paystack Webhooks**
  - Configure webhooks to receive payment confirmations
  - Log all payment events for auditing

## 7. Security Review

- [x] ✅ Secret key stored securely in Firebase Functions
- [x] ✅ Payment verification done server-side
- [x] ✅ No sensitive data exposed in client code
- [x] ✅ CodeQL security scan passed with 0 vulnerabilities
- [ ] **Additional checks:**
  - [ ] Review Firestore security rules
  - [ ] Enable rate limiting on payment endpoints
  - [ ] Set up alerts for failed payments

## 8. User Documentation

- [ ] **Update Help/FAQ**
  - Document accepted payment methods
  - Explain refund policy
  - Provide support contact for payment issues

- [ ] **Test User Journey**
  - Complete end-to-end user flow
  - Verify all error messages are user-friendly
  - Test on different network conditions

## Troubleshooting Common Issues

### Issue: "Paystack secret key not configured"
**Solution:** Run `firebase functions:config:set paystack.secret_key="YOUR_KEY"`

### Issue: Payment WebView doesn't load
**Solution:** 
- Check internet connection
- Verify Firebase Functions are deployed
- Check Firebase Functions logs for errors

### Issue: Deep link callback not working on iOS
**Solution:**
- Verify `scheme: "myapp"` in `app.json`
- Check iOS build configuration in EAS
- Test deep link manually: Open `myapp://payment/callback?status=success&reference=test` in Safari

### Issue: Payment verification fails
**Solution:**
- Check Paystack API status
- Verify transaction reference is correct
- Check Firebase Functions logs

## Support Resources

- **Paystack Docs:** https://paystack.com/docs
- **Firebase Functions:** https://firebase.google.com/docs/functions
- **React Native WebView:** https://github.com/react-native-webview/react-native-webview
- **Setup Guide:** See `PAYMENT_SETUP.md`

## Completion

Once all items are checked:
- [ ] Payment integration is ready for production
- [ ] Team has been trained on the new feature
- [ ] Support team has troubleshooting guide
- [ ] Monitoring and alerting are configured
