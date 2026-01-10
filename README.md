# House It - Local Services Directory

A React Native mobile app built with Expo that helps users find local service providers in their area. The app provides a Google-style business directory experience for home services.

## Features

- Browse service categories (Electricians, Plumbers, Roofing, Painting, Mechanics, Entertainment, Interior Design)
- View detailed business information including ratings, reviews, and contact details
- Direct actions: Call, Email, Get Directions, Visit Website
- Clean, simple interface with no login required
- Google Maps integration for directions

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository
2. Navigate to the my-app directory:
   ```bash
   cd my-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

### Running on Devices

- **iOS Simulator**: Press `i` in the terminal after starting the dev server
- **Android Emulator**: Press `a` in the terminal after starting the dev server
- **Physical Device**: Scan the QR code with Expo Go app

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

