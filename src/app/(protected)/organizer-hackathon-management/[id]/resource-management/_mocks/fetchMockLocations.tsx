// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockLocations.tsx
import { Location } from "@/types/entities/location";

export const fetchMockLocations = (): Promise<Location[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockLocations: Location[] = [
        {
          id: "loc1",
          name: "Tech Hub Arena",
          address: "123 Innovation Street, Silicon Valley, CA",
          latitude: 37.7749,
          longitude: -122.4194,
          roundLocations: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "loc2",
          name: "Virtual Zoom Room",
          address: "Online",
          latitude: 0,
          longitude: 0,
          roundLocations: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "loc3",
          name: "Startup Co-Working Space",
          address: "456 Startup Blvd, New York, NY",
          latitude: 40.7128,
          longitude: -74.006,
          roundLocations: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      resolve(mockLocations);
    }, 500);
  });
};
