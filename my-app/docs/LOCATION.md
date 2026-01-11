# Location Functionality

This document describes how the location functionality works in the app.

## Overview

The app now includes location services to track the user's position temporarily. This location data is used with the Google Places API to calculate distances to businesses listed on the platform.

## Features

1. **Location Permission Handling**: The app requests location permission from the user on first use
2. **Automatic Location Updates**: Once permission is granted, location updates automatically without asking again
3. **Temporary Storage**: Location is stored in memory temporarily while the app is running
4. **Distance Calculations**: Helper utilities for calculating distances between user and businesses

## Configuration

### iOS Permissions (info.plist)

The following permissions have been added to `app.json` for iOS:

```json
"infoPlist": {
  "NSLocationWhenInUseUsageDescription": "This app needs access to your location to find nearby service providers and calculate distances to businesses.",
  "NSLocationAlwaysAndWhenInUseUsageDescription": "This app needs access to your location to find nearby service providers and calculate distances to businesses."
}
```

### Android Permissions

The following permissions have been added to `app.json` for Android:

```json
"permissions": [
  "ACCESS_FINE_LOCATION",
  "ACCESS_COARSE_LOCATION"
]
```

## Usage

### Using the Location Hook

The `useLocation` hook provides an easy way to access the user's location:

```typescript
import { useLocation } from '@/hooks/useLocation';

function MyComponent() {
  const { location, error, loading, refreshLocation } = useLocation();

  if (loading) {
    return <Text>Loading location...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (location) {
    return (
      <View>
        <Text>Latitude: {location.latitude}</Text>
        <Text>Longitude: {location.longitude}</Text>
        <Button title="Refresh" onPress={refreshLocation} />
      </View>
    );
  }

  return null;
}
```

### Calculating Distances

Use the utility functions to calculate and display distances:

```typescript
import { useLocation } from '@/hooks/useLocation';
import { calculateDistance, formatDistance } from '@/utils/locationUtils';

function ProviderCard({ provider }) {
  const { location } = useLocation();
  
  const distance = location
    ? calculateDistance(
        location.latitude,
        location.longitude,
        provider.latitude,
        provider.longitude
      )
    : null;
  
  return (
    <View>
      <Text>{provider.name}</Text>
      {distance && <Text>{formatDistance(distance)} away</Text>}
    </View>
  );
}
```

### Sorting Providers by Distance

```typescript
import { useLocation } from '@/hooks/useLocation';
import { sortProvidersByDistance } from '@/utils/locationUtils';

function ProvidersList({ providers }) {
  const { location } = useLocation();
  
  const sortedProviders = location
    ? sortProvidersByDistance(location, providers)
    : providers;
  
  return (
    <View>
      {sortedProviders.map(provider => (
        <ProviderCard key={provider.id} provider={provider} />
      ))}
    </View>
  );
}
```

## API Reference

### useLocation Hook

Returns an object with:

- `location`: Current location object with `latitude`, `longitude`, and `timestamp`
- `error`: Error object if location fetch failed
- `loading`: Boolean indicating if location is being fetched
- `refreshLocation`: Function to manually refresh the location

### Location Utilities

#### calculateDistance(lat1, lon1, lat2, lon2)

Calculates the distance between two geographic coordinates using the Haversine formula.

**Parameters:**
- `lat1`, `lon1`: First location coordinates
- `lat2`, `lon2`: Second location coordinates

**Returns:** Distance in kilometers

#### formatDistance(distance)

Formats distance for display.

**Parameters:**
- `distance`: Distance in kilometers

**Returns:** Formatted string (e.g., "2.5 km" or "500 m")

#### formatLocationForAPI(location)

Formats location for Google Places API requests.

**Parameters:**
- `location`: Location object with `latitude` and `longitude`

**Returns:** Formatted string "lat,lng"

#### sortProvidersByDistance(userLocation, providers)

Sorts an array of providers by distance from the user.

**Parameters:**
- `userLocation`: User's current location
- `providers`: Array of providers with location data

**Returns:** Sorted array with distance property added

## Implementation Details

### Location Caching

The `useLocation` hook caches the location for 1 minute (`maximumAge: 60000`) to reduce battery usage and API calls. After 1 minute, a fresh location will be fetched.

### Permission Flow

1. On first app launch, the hook attempts to get the location
2. The OS prompts the user for permission
3. If granted, the location is fetched and stored
4. On subsequent app launches, the location is fetched automatically without prompting
5. Users can revoke permission in device settings at any time

### Navigator.geolocation API

The implementation uses the standard `navigator.geolocation.getCurrentPosition()` API with the following options:

- `enableHighAccuracy: true` - Request GPS-level accuracy
- `timeout: 10000` - 10 second timeout
- `maximumAge: 60000` - Accept cached locations up to 1 minute old

## Integration with Google Places API

To integrate with Google Places API for finding nearby businesses:

1. Add your Google Places API key to the app configuration
2. Use `formatLocationForAPI(location)` to format the user's location
3. Make API requests to find nearby businesses
4. Use `calculateDistance()` to compute exact distances
5. Sort results using `sortProvidersByDistance()`

Example API request structure:

```typescript
const { location } = useLocation();

if (location) {
  const locationString = formatLocationForAPI(location);
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${locationString}&radius=5000&type=electrician&key=${API_KEY}`
  );
  // Process results...
}
```

## Privacy Considerations

- Location data is stored temporarily in memory only
- Location is not persisted to disk or sent to external servers (except Google Places API)
- Users can revoke location permission at any time
- The app clearly explains why location access is needed
