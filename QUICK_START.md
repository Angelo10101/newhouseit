# Quick Start Guide - AI Business Recommendation

## For Users Who Want to Try It Immediately

### Step 1: Get Your Gemini API Key (Free)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (it looks like: `AIzaSy...`)

### Step 2: Set Up Backend (5 minutes)
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file and paste your API key
# Replace "your_api_key_here" with your actual key
nano .env   # or use any text editor
```

Your `.env` file should look like:
```
GEMINI_API_KEY=AIzaSy...your_actual_key_here
PORT=3001
```

### Step 3: Start Backend
```bash
# Still in backend folder
npm start
```

You should see:
```
Backend server running on http://localhost:3001
API Key configured: Yes
```

Keep this terminal open!

### Step 4: Configure Frontend API Connection (New Terminal)
```bash
# Navigate to app folder
cd my-app

# Create environment file from example
cp .env.example .env
```

**Important:** Edit the `.env` file based on your setup:

**For iOS Simulator** (default):
```env
EXPO_PUBLIC_API_URL=http://localhost:3001
```

**For Android Emulator**:
```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3001
```

**For Physical Device** (phone/tablet):
1. Find your computer's IP address:
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```
   Look for an IP like `192.168.1.100` or `10.0.0.5`

2. Update your `.env` file:
   ```env
   EXPO_PUBLIC_API_URL=http://192.168.1.100:3001
   ```
   ⚠️ Replace `192.168.1.100` with YOUR computer's IP!

3. Make sure your phone and computer are on the **same WiFi network**

### Step 5: Start Mobile App
```bash
# Still in my-app folder

# Install dependencies (first time only)
npm install

# Start Expo
npx expo start
```

### Step 6: Open the App
- **iOS Simulator**: Press `i` in terminal
- **Android Emulator**: Press `a` in terminal  
- **Physical Device**: Scan QR code with Expo Go app

### Step 7: Try the AI Feature
1. Look for the **black brain icon button** at the bottom-right
2. Tap it to open the AI assistant
3. Try asking: "My lights keep flickering"
4. The AI will recommend an electrician!

## Troubleshooting

### "Connection failed" or "Network request failed"

This means the app can't connect to your backend server. Check:

1. **Backend is running**: Make sure you see "Backend server running on http://localhost:3001" in the backend terminal

2. **Correct API URL**: Check your `my-app/.env` file:
   - iOS Simulator: `http://localhost:3001`
   - Android Emulator: `http://10.0.2.2:3001`
   - Physical Device: `http://YOUR_COMPUTER_IP:3001`

3. **Same WiFi network** (for physical devices): Your phone and computer must be on the same network

4. **Restart Expo**: After changing `.env`, restart the Expo server:
   - Stop Expo (Ctrl+C)
   - Run `npx expo start --clear` to clear cache
   - Reopen the app

5. **Check firewall**: Your computer's firewall might be blocking port 3001. Allow Node.js or port 3001 through your firewall.

### "API Key not configured"
- Check your `.env` file in the backend folder
- Make sure you replaced `your_api_key_here` with your actual key
- Restart the backend server after editing `.env`

### "Internal server error" or "404 Not Found" with Gemini API
If you see errors like `models/gemini-1.5-flash is not found for API version v1beta`, this means:
- The model name in the code might not be available in your region or for your API key
- The app uses `gemini-1.5-pro` which is widely supported
- Make sure your API key is valid and active
- If you still get errors, try generating a new API key at [Google AI Studio](https://makersuite.google.com/app/apikey)

### Backend won't start - "Port 3001 already in use"
- Another app is using port 3001
- Change the port in `backend/.env`:
  ```
  PORT=3002
  ```
- Also update the port in `my-app/hooks/useBusinessRecommendation.ts`

## Example Questions to Try

✅ **Good Questions** (will get recommendations):
- "My lights keep flickering"
- "I have a leaky faucet"
- "My roof is leaking when it rains"
- "I need to paint my living room"
- "My car won't start"
- "I want to install a home theater"
- "I need help redesigning my bedroom"

❌ **Questions that won't match** (will return NO_MATCH):
- "I need a haircut"
- "Where can I buy groceries?"
- "I want to order pizza"

## That's It!

You now have a fully functional AI-powered business recommendation chatbot! 🎉

For more details, see:
- Full documentation: `AI_RECOMMENDATION_GUIDE.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`
- Backend API docs: `backend/README.md`
