/**
 * Example utility functions for using the location data with Google Places API
 * 
 * This file demonstrates how to:
 * 1. Use the location from useLocation hook
 * 2. Calculate distance between user location and business locations
 * 3. Integrate with Google Places API (when implemented)
 */

interface Location {
  latitude: number;
  longitude: number;
}

/**
 * Calculate the distance between two geographic coordinates using the Haversine formula
 * @param lat1 - Latitude of first location
 * @param lon1 - Longitude of first location
 * @param lat2 - Latitude of second location
 * @param lon2 - Longitude of second location
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 * @param distance - Distance in kilometers
 * @returns Formatted string (e.g., "2.5 km" or "500 m")
 */
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
}

/**
 * Example usage with a business location
 * 
 * import { useLocation } from '@/hooks/useLocation';
 * import { calculateDistance, formatDistance } from '@/utils/locationUtils';
 * 
 * function ServiceProviderCard({ provider }) {
 *   const { location } = useLocation();
 *   
 *   const distance = location
 *     ? calculateDistance(
 *         location.latitude,
 *         location.longitude,
 *         provider.latitude,
 *         provider.longitude
 *       )
 *     : null;
 *   
 *   return (
 *     <View>
 *       <Text>{provider.name}</Text>
 *       {distance && <Text>{formatDistance(distance)} away</Text>}
 *     </View>
 *   );
 * }
 */

/**
 * Example: Prepare location for Google Places API request
 * @param location - User's location from useLocation hook
 * @returns Formatted location string for API request
 */
export function formatLocationForAPI(location: Location): string {
  return `${location.latitude},${location.longitude}`;
}

/**
 * Example: Sort providers by distance from user
 * @param userLocation - User's current location
 * @param providers - Array of providers with location data
 * @returns Sorted array of providers with distance
 */
export function sortProvidersByDistance<T extends { latitude: number; longitude: number }>(
  userLocation: Location,
  providers: T[]
): (T & { distance: number })[] {
  return providers
    .map(provider => ({
      ...provider,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        provider.latitude,
        provider.longitude
      ),
    }))
    .sort((a, b) => a.distance - b.distance);
}
