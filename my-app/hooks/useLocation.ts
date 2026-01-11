import { useState, useEffect, useCallback } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface LocationError {
  code: number;
  message: string;
}

interface UseLocationReturn {
  location: Location | null;
  error: LocationError | null;
  loading: boolean;
  refreshLocation: () => Promise<void>;
}

/**
 * Custom hook to manage user location using the navigator.geolocation API.
 * 
 * This hook:
 * - Requests location permission on first use
 * - Retrieves and stores the user's current location
 * - Automatically updates location without asking for permission each time
 * - Provides a refresh function to manually update location
 * 
 * @returns {UseLocationReturn} Object containing location, error, loading state, and refresh function
 */
export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Asynchronously fetch the user's current location
   */
  const fetchLocation = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        const err: LocationError = {
          code: 0,
          message: 'Geolocation is not supported by this browser/device',
        };
        setError(err);
        setLoading(false);
        resolve();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp,
          };
          setLocation(newLocation);
          setLoading(false);
          resolve();
        },
        (err) => {
          const locationError: LocationError = {
            code: err.code,
            message: err.message,
          };
          setError(locationError);
          setLoading(false);
          resolve();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000, // Cache location for 1 minute
        }
      );
    });
  }, []);

  /**
   * Manually refresh the location
   */
  const refreshLocation = useCallback(async (): Promise<void> => {
    await fetchLocation();
  }, [fetchLocation]);

  // Fetch location on mount
  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return {
    location,
    error,
    loading,
    refreshLocation,
  };
}
