# House It - Local Services Directory

A React Native mobile app built with Expo that helps users find local service providers in their area. The app provides a Google-style business directory experience for home services with AI-powered recommendations.

## Features

- Browse service categories (Electricians, Plumbers, Roofing, Painting, Mechanics, Entertainment, Interior Design)
- **🤖 AI-Powered Business Recommendations**: Describe your problem and get instant AI recommendations
- View detailed business information including ratings, reviews, and contact details
- Direct actions: Call, Email, Get Directions, Visit Website
- Clean, simple interface with no login required
- Google Maps integration for directions

## AI Recommendation Feature

This app includes an intelligent AI assistant powered by Google Gemini that helps users find the right business for their specific needs. Simply describe your problem (e.g., "My lights keep flickering"), and the AI will recommend the best-matched business from the available providers.

**⚠️ IMPORTANT**: The AI chatbot requires proper backend setup. If you get "internal server error", see [CHATBOT_TROUBLESHOOTING.md](CHATBOT_TROUBLESHOOTING.md)

See [AI_RECOMMENDATION_GUIDE.md](AI_RECOMMENDATION_GUIDE.md) for detailed setup and usage instructions.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Google Gemini API key (for AI recommendations)

### Installation

1. Clone the repository

2. **Set up the backend** (for AI recommendations):
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Add your GEMINI_API_KEY to .env file
   npm start
   ```
   
   The backend will run on `http://localhost:3001`

3. **Set up the mobile app**:
   Navigate to the my-app directory:
   ```bash
   cd my-app
   ```
   
4. Install dependencies:
   ```bash
   npm install
   ```
   
5. Start the development server:
   ```bash
   npm start
   ```

### Running on Devices

- **iOS Simulator**: Press `i` in the terminal after starting the dev server
- **Android Emulator**: Press `a` in the terminal after starting the dev server
- **Physical Device**: Scan the QR code with Expo Go app

### Troubleshooting

**🔥 Chatbot not working? Getting "internal server error"?**

Run this verification script:
```bash
./verify-chatbot-setup.sh
```

Most common issues:
1. ❌ Backend dependencies not installed → Run: `cd backend && npm install`
2. ❌ Backend .env file missing → Run: `cd backend && cp .env.example .env` then add your API key
3. ❌ Backend not running → Run: `cd backend && npm start` (keep it running)

For detailed troubleshooting, see [CHATBOT_TROUBLESHOOTING.md](CHATBOT_TROUBLESHOOTING.md)

## Project Structure

```
my-app/
├── app/                          # App screens and routing
│   ├── (tabs)/                   # Tab-based navigation screens
│   │   ├── index.tsx            # Home screen with service categories
│   │   ├── explore.tsx          # About/info screen
│   │   └── _layout.tsx          # Tab navigation layout
│   ├── service/[id].tsx         # Service category listing screen
│   ├── provider/[serviceId]/[providerId].tsx  # Business detail screen
│   └── _layout.tsx              # Root layout
├── components/                   # Reusable components
├── constants/                    # App constants and configuration
└── assets/                       # Images, fonts, and other assets
```

## Recent Changes

This app was recently transformed from a service booking platform to a business directory. See [TRANSFORMATION_SUMMARY.md](TRANSFORMATION_SUMMARY.md) for details on what was removed and changed.

## Technology Stack

- React Native
- Expo SDK 54
- Expo Router for navigation
- TypeScript
- React Navigation

## License

This is a personal side project.

