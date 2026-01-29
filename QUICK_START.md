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

### Step 4: Start Mobile App (New Terminal)
```bash
# Navigate to app folder
cd my-app

# Install dependencies (first time only)
npm install

# Start Expo
npx expo start
```

### Step 5: Open the App
- **iOS Simulator**: Press `i` in terminal
- **Android Emulator**: Press `a` in terminal  
- **Physical Device**: Scan QR code with Expo Go app

### Step 6: Try the AI Feature
1. Look for the **black brain icon button** at the bottom-right
2. Tap it to open the AI assistant
3. Try asking: "My lights keep flickering"
4. The AI will recommend an electrician!

## Troubleshooting

### "Connection failed" or "Network request failed"
**For physical devices**, you need to use your computer's IP instead of localhost:

1. Find your computer's IP address:
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```
   
2. Edit `my-app/hooks/useBusinessRecommendation.ts`:
   ```typescript
   // Change this line:
   const API_URL = 'http://localhost:3001';
   
   // To your IP address:
   const API_URL = 'http://192.168.1.100:3001';  // Use YOUR IP
   ```

3. Make sure phone and computer are on the same WiFi network

### "API Key not configured"
- Check your `.env` file in the backend folder
- Make sure you replaced `your_api_key_here` with your actual key
- Restart the backend server after editing `.env`

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
