import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Configuration for the application
 * 
 * API_URL Priority:
 * 1. Environment variable (EXPO_PUBLIC_API_URL) - set in .env file
 * 2. Platform-specific defaults:
 *    - iOS Simulator: http://localhost:3001
 *    - Android Emulator: http://10.0.2.2:3001
 *    - Web: http://localhost:3001
 * 
 * For physical devices, you MUST set EXPO_PUBLIC_API_URL in .env file
 * to your computer's IP address (e.g., http://192.168.1.100:3001)
 */

// Get the API URL from environment variables
const getApiUrl = (): string => {
  // First, check if environment variable is set
  const envApiUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 
                    process.env.EXPO_PUBLIC_API_URL;
  
  if (envApiUrl) {
    return envApiUrl;
  }

  // Fallback to platform-specific defaults
  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    return 'http://10.0.2.2:3001';
  } else if (Platform.OS === 'ios') {
    // iOS simulator can use localhost
    return 'http://localhost:3001';
  } else if (Platform.OS === 'web') {
    // Web can use localhost
    return 'http://localhost:3001';
  }

  // Default fallback
  return 'http://localhost:3001';
};

export const config = {
  apiUrl: getApiUrl(),
};

// Log configuration on app start (helpful for debugging)
if (__DEV__) {
  console.log('App Configuration:', {
    apiUrl: config.apiUrl,
    platform: Platform.OS,
  });
}
