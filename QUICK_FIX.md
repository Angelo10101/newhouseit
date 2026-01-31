# Quick Answer: Why Your Chatbot Isn't Working

## TL;DR - The 30-Second Fix

Your chatbot shows "internal server error" because you skipped the backend setup.

**Fix it now (5 minutes):**
```bash
# Step 1: Set up backend
cd backend
npm install
cp .env.example .env
# Edit .env and add your Gemini API key from: https://makersuite.google.com/app/apikey

# Step 2: Start backend (keep this running)
npm start

# Step 3: Start app (new terminal)
cd ../my-app
npx expo start
```

**Test:** Tap brain icon → Type "My lights keep flickering" → Should work! ✅

---

## What You Did Wrong

You followed the QUICK_START.md but missed these critical steps:

### ❌ Mistake #1: Didn't install backend dependencies
**What the instructions say:** (Line 17)
```bash
cd backend
npm install
```

**What you did:** Skipped it or only ran `npm install` in the my-app folder

**Why it matters:** Without dependencies, the backend server can't run

---

### ❌ Mistake #2: Didn't create .env file
**What the instructions say:** (Lines 20-24)
```bash
cp .env.example .env
# Edit .env file and paste your API key
```

**What you did:** Either skipped it or thought .env.example was the config file

**Why it matters:** The backend needs this file to know your API key

---

### ❌ Mistake #3: Didn't start backend
**What the instructions say:** (Line 36)
```bash
npm start  # Keep this terminal open!
```

**What you did:** Only started the mobile app

**Why it matters:** The chatbot needs to connect to the backend server

---

## How to Know If It's Fixed

### Quick Check:
```bash
./verify-chatbot-setup.sh
```

This script checks everything and tells you what's wrong.

### Manual Check:
```bash
# Backend health check
curl http://localhost:3001/health
# Should return: {"status":"ok","message":"Backend is running"}
```

---

## Need More Help?

- **Detailed guide:** [CHATBOT_TROUBLESHOOTING.md](CHATBOT_TROUBLESHOOTING.md)
- **Full explanation:** [WHAT_YOU_DID_WRONG.md](WHAT_YOU_DID_WRONG.md)
- **Technical report:** [DIAGNOSIS_REPORT.md](DIAGNOSIS_REPORT.md)

---

## Common Questions

**Q: Where do I get a Gemini API key?**
A: https://makersuite.google.com/app/apikey (it's free)

**Q: Do I need to do this every time?**
A: No, just once. After setup, you only need to start both servers.

**Q: Which terminal should I run what in?**
A: 
- Terminal 1: `cd backend && npm start` (keep running)
- Terminal 2: `cd my-app && npx expo start` (keep running)

**Q: I'm on a physical device and it still doesn't work**
A: Edit `my-app/hooks/useBusinessRecommendation.ts` and change `localhost` to your computer's IP address.

**Q: It says my API key is invalid**
A: Make sure you copied the entire key and there are no spaces. Try generating a new one.

---

## You're Not Alone!

This is the #1 issue people have with the chatbot. The instructions ARE in QUICK_START.md, but it's easy to miss the backend setup steps.

Now that you know what was wrong, the fix is simple: **3 commands + 1 API key = working chatbot!** 🎉
