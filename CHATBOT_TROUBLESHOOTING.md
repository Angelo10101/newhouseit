# Chatbot Internal Server Error - Diagnosis and Solution

## Problem Summary
You're getting an **internal server error** when using the chatbot because the backend server is not properly configured. The QUICK_START.md instructions mention the setup steps, but two critical steps are missing from your environment.

---

## Root Causes Identified

### ❌ Issue 1: Backend Dependencies Not Installed
**Status:** `backend/node_modules/` folder does not exist

**Why this causes errors:**
- The backend requires packages like Express, Google Generative AI, CORS, and dotenv
- Without these dependencies, the server cannot start or will crash immediately
- When the chatbot tries to connect, it gets a connection error or 500 error

### ❌ Issue 2: Backend Environment Variables Not Configured
**Status:** `backend/.env` file does not exist

**Why this causes errors:**
- The server needs your Google Gemini API key to process AI recommendations
- Without the `.env` file, `process.env.GEMINI_API_KEY` is undefined
- The backend code specifically checks for this (lines 41-51 in `backend/src/index.js`)
- When undefined, the server returns: `"Server configuration error: GEMINI_API_KEY not set"`

---

## Complete Fix (5 Minutes)

### Step 1: Install Backend Dependencies
```bash
# Navigate to backend folder
cd backend

# Install all required packages
npm install
```

**Expected output:**
```
added 150 packages, and audited 151 packages in 15s
```

### Step 2: Create and Configure .env File
```bash
# Still in backend folder
# Copy the example file
cp .env.example .env

# Now edit the .env file with your API key
nano .env
# OR use any text editor like VS Code, vim, etc.
```

**Edit the .env file to look like this:**
```
# Replace "your_api_key_here" with your actual Gemini API key
GEMINI_API_KEY=AIzaSyBc9...your_actual_key_here
PORT=3001
```

**To get a Gemini API key (free):**
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key (format: `AIzaSy...`)
5. Paste it in your `.env` file

### Step 3: Start the Backend Server
```bash
# Still in backend folder
npm start
```

**Expected output (SUCCESS):**
```
Backend server running on http://localhost:3001
API Key configured: Yes
```

**Leave this terminal running!** The backend must be running for the chatbot to work.

### Step 4: Start Your App (New Terminal)
```bash
# In a NEW terminal window
cd my-app

# Install app dependencies if not done yet
npm install

# Start the app
npx expo start
```

### Step 5: Test the Chatbot
1. Open the app in your simulator/device
2. Look for the **black brain icon** button at bottom-right
3. Tap it to open the AI chat
4. Try: "My lights keep flickering"
5. ✅ Should now work without errors!

---

## Verification Checklist

Before running the app, verify these items:

### Backend Setup ✓
- [ ] `backend/node_modules/` folder exists (after `npm install`)
- [ ] `backend/.env` file exists (copied from `.env.example`)
- [ ] `.env` file contains your actual Gemini API key (not "your_api_key_here")
- [ ] Backend server is running (`npm start` in backend folder)
- [ ] Terminal shows: `"API Key configured: Yes"`

### Common Mistakes to Avoid ⚠️
1. **Forgetting to install dependencies** - Always run `npm install` first
2. **Not creating .env file** - Must copy `.env.example` to `.env`
3. **Using placeholder API key** - Must replace "your_api_key_here" with real key
4. **Not restarting server after editing .env** - Stop (Ctrl+C) and restart `npm start`
5. **Backend not running** - Must keep backend terminal open while testing app

---

## What You Were Doing Wrong

Based on the QUICK_START.md file, the instructions ARE there (Steps 2 and 3), but you likely:

1. **Skipped `npm install` in the backend folder** (Step 2, line 17)
   - This is easy to miss if you only ran `npm install` in the my-app folder

2. **Didn't create the .env file** (Step 2, line 20-24)
   - The file must be manually created by copying `.env.example`
   - Then you must edit it and paste your actual API key

3. **Started the app before starting the backend**
   - The backend MUST be running first (Step 3, line 36)
   - Keep that terminal open

---

## Testing Your Fix

### Test 1: Backend Health Check
```bash
# In a new terminal (while backend is running)
curl http://localhost:3001/health
```

**Expected response:**
```json
{"status":"ok","message":"Backend is running"}
```

### Test 2: Chatbot API Test
```bash
curl -X POST http://localhost:3001/api/recommend-business \
  -H "Content-Type: application/json" \
  -d '{
    "userProblem": "My lights keep flickering",
    "businesses": [
      {
        "id": "1",
        "name": "Test Electrician",
        "category": "Electrician",
        "description": "Electrical repairs and installations"
      }
    ]
  }'
```

**Expected response:**
```json
{
  "recommendedBusinessId": "1",
  "confidence": 0.95,
  "reason": "Flickering lights indicate an electrical issue"
}
```

If you get an error response instead, check:
- Is your API key valid?
- Did you restart the backend after editing .env?
- Are there any error messages in the backend terminal?

---

## Additional Troubleshooting

### Error: "Port 3001 already in use"
**Solution:** Another process is using port 3001
```bash
# Option 1: Find and kill the process
lsof -ti:3001 | xargs kill -9

# Option 2: Use a different port
# Edit backend/.env: PORT=3002
# Also update my-app/hooks/useBusinessRecommendation.ts: const API_URL = 'http://localhost:3002';
```

### Error: "Network request failed" (on physical device)
**Solution:** Physical devices can't use `localhost`
1. Find your computer's IP address:
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "
   # Look for something like: 192.168.1.100
   ```
2. Edit `my-app/hooks/useBusinessRecommendation.ts`:
   ```typescript
   const API_URL = 'http://192.168.1.100:3001';  // Use YOUR IP
   ```
3. Ensure phone and computer are on same WiFi

### Error: "Invalid API key"
**Solution:** Your Gemini API key is invalid or expired
1. Generate a new key at: https://makersuite.google.com/app/apikey
2. Update `backend/.env` with the new key
3. Restart backend server

---

## Summary

The chatbot wasn't working because:
1. ❌ You didn't run `npm install` in the backend folder
2. ❌ You didn't create the `.env` file with your API key

**Quick fix:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your Gemini API key
npm start
# Keep running, then start app in another terminal
```

That's it! Your chatbot should now work perfectly. 🎉

---

## Questions?

If you still get errors after following these steps:
1. Check the backend terminal for error messages
2. Verify your API key is valid at Google AI Studio
3. Make sure both backend is running before testing the app
4. Try the curl tests above to isolate the issue
