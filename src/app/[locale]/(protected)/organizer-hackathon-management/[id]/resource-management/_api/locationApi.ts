// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_api/locationApi.ts
import { Location } from "@/types/entities/location";

export type LocationCreateRequest = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type LocationUpdateRequest = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

// Simulate API call to create a location
export const createLocation = async (
  request: LocationCreateRequest
): Promise<Location> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const newLocation: Location = {
        id: `loc_${Date.now()}`, // Generate a fake ID
        ...request,
        roundLocations: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // In a real implementation, this would be an actual API call
      console.log("API call: Create location", request);

      resolve(newLocation);
    }, 500);
  });
};

// Simulate API call to update a location
export const updateLocation = async (
  id: string,
  request: LocationUpdateRequest
): Promise<Location> => {
  // Simulate API delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // In a real implementation, this would be an actual API call
      console.log(`API call: Update location with ID ${id}`, request);

      // Simulate successful update
      const updatedLocation: Location = {
        id,
        ...request,
        roundLocations: [],
        createdAt: new Date().toISOString(), // In real API this would be preserved
        updatedAt: new Date().toISOString(), // Only updatedAt would change
      };

      resolve(updatedLocation);
    }, 500);
  });
};

// Simulate API call to get a location by ID
export const getLocationById = async (id: string): Promise<Location> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // In a real implementation, this would fetch from an API
      console.log(`API call: Get location with ID ${id}`);

      // Simulate finding a location
      const location: Location = {
        id,
        name: "Sample Location",
        address: "123 Sample St",
        latitude: 37.7749,
        longitude: -122.4194,
        roundLocations: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      resolve(location);
    }, 300);
  });
};

// Simulate API call to delete a location
export const deleteLocation = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // In a real implementation, this would be an actual API call
      console.log(`API call: Delete location with ID ${id}`);

      // Simulate successful deletion
      resolve();
    }, 300);
  });
};
