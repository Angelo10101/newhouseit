# AI Business Recommendation Feature

This document describes the AI-powered business recommendation feature for the NewHouseIt app.

## Overview

The AI recommendation feature uses Google Gemini 1.5 Pro to help users find the best business for their specific problem. Users describe their issue in natural language, and the AI recommends the most suitable business from the available providers.

## Architecture

### Backend (Express Server)
- **Location**: `/backend`
- **Technology**: Node.js with Express
- **AI Provider**: Google Gemini 1.5 Pro API
- **Security**: API key stored server-side only in `.env` file

### Frontend (React Native with Expo)
- **Location**: `/my-app`
- **UI Component**: `AIRecommendationChat.tsx`
- **Hook**: `useBusinessRecommendation.ts`
- **Integration**: Floating button on home screen

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Add your Gemini API key to `.env`:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=3001
   ```

5. Get a Gemini API key:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy and paste it into your `.env` file

6. Start the backend server:
   ```bash
   npm start
   ```
   
   The server will run on `http://localhost:3001`

### 2. Frontend Setup

1. Navigate to the app directory:
   ```bash
   cd my-app
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. Open the app on your device or simulator

## Usage

### For Users

1. Open the NewHouseIt app
2. Look for the floating AI button (brain icon) at the bottom-right of the home screen
3. Tap the button to open the AI assistant
4. Describe your problem in natural language (e.g., "My lights keep flickering")
5. Tap the send button
6. The AI will recommend the best business and explain why
7. Tap "View Business" to see full details and contact the provider

### For Developers

#### API Endpoint

**POST** `/api/recommend-business`

**Request:**
```json
{
  "userProblem": "My lights keep flickering and I need help",
  "businesses": [
    {
      "id": "electrician-1",
      "name": "Lightning Electric Co.",
      "category": "Electrician",
      "description": "Professional electrical services with over 20 years of experience"
    },
    {
      "id": "plumber-1",
      "name": "AquaFix Pro",
      "category": "Plumber",
      "description": "Expert plumbing services for all your needs"
    }
  ]
}
```

**Response (Match Found):**
```json
{
  "recommendedBusinessId": "electrician-1",
  "confidence": 0.95,
  "reason": "Flickering lights indicate an electrical issue that requires a licensed electrician"
}
```

**Response (No Match):**
```json
{
  "recommendedBusinessId": "NO_MATCH",
  "confidence": 0.0,
  "reason": "No suitable business found for this problem"
}
```

## Security Features

✅ **API Key Protection**
- Gemini API key is stored only in backend `.env` file
- Never exposed to the frontend or client-side code
- `.env` file is in `.gitignore` to prevent accidental commits

✅ **Input Validation**
- Backend validates all incoming requests
- Verifies business list is provided and valid
- Checks recommended business exists in the provided list

✅ **CORS Configuration**
- CORS enabled for local development
- Should be configured for production domains

## How It Works

1. **User Input**: User describes their problem in natural language
2. **Business List**: Frontend gathers all available businesses from the app data
3. **API Call**: Frontend sends problem and business list to backend
4. **AI Processing**: Backend uses Gemini to analyze and recommend
5. **Validation**: Backend ensures recommendation is from the provided list
6. **Response**: Frontend displays recommendation with confidence and reason
7. **Navigation**: User can navigate directly to the recommended business

## Prompt Engineering

The AI prompt includes:
- Clear role definition as a recommendation engine
- Strict constraint to only select from provided businesses
- Instruction to return "NO_MATCH" if nothing fits
- Required JSON format specification
- Business information (ID, name, category, description)

## Dynamic Business List

The business list is dynamically generated from the app's provider data, ensuring:
- ✅ Up-to-date recommendations as businesses change
- ✅ No hardcoded business data in the AI system
- ✅ Consistency between app listings and AI recommendations
- ✅ Easy to add/remove businesses without changing AI code

## Troubleshooting

### Backend won't start
- Check that `.env` file exists with `GEMINI_API_KEY`
- Ensure port 3001 is not in use
- Verify dependencies are installed (`npm install`)

### AI not responding
- Check backend is running (`http://localhost:3001/health`)
- Verify API key is valid and has quota remaining
- Check console for error messages
- Ensure business list is not empty

### "NO_MATCH" responses
- This is expected when no business fits the problem
- Try rephrasing the problem
- Ensure relevant businesses are in the list

### Connection errors
- Verify backend URL in `useBusinessRecommendation.ts` matches your backend
- For mobile testing, use your computer's IP address instead of `localhost`
- Example: `http://192.168.1.100:3001`
- To find your IP:
  - Mac/Linux: Run `ifconfig | grep "inet "`
  - Windows: Run `ipconfig` and look for IPv4 Address
- Make sure your phone and computer are on the same network

## Future Enhancements

Potential improvements:
- [ ] Cache recent recommendations
- [ ] Allow users to rate AI recommendations
- [ ] Multi-language support
- [ ] Voice input for problems
- [ ] Follow-up questions for clarification
- [ ] Integration with booking system

## Testing

### Manual Testing Scenarios

1. **Electrical Problem**: "My lights keep flickering"
   - Expected: Recommend an electrician

2. **Plumbing Problem**: "I have a leaky faucet"
   - Expected: Recommend a plumber

3. **Ambiguous Problem**: "My house needs fixing"
   - Expected: May ask for clarification or recommend based on general contractor

4. **Unrelated Problem**: "I need a haircut"
   - Expected: NO_MATCH response

5. **Empty Input**: Submit without text
   - Expected: Button disabled, no request sent

## License

This feature is part of the NewHouseIt project - a personal side project.
