// src/app/[locale]/(protected)/grading-submission/[id]/_mocks/fetchMockRounds.ts
import { Round } from "@/types/entities/round";

export const fetchMockRounds = (hackathonId: string): Promise<Round[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockRounds: Round[] = [
        {
          id: "r1",
          startTime: new Date("2024-06-02T10:00:00Z").toISOString(),
          endTime: new Date("2024-06-02T18:00:00Z").toISOString(),
          roundNumber: 1,
          roundTitle: "Preliminary Round",
          status: "UPCOMING",
          roundLocations: [
            {
              id: "rl1",
              round: undefined, // Avoid circular dependency
              location: {
                id: "loc1",
                name: "Tech Hub Arena",
                address: "123 Innovation Street, Silicon Valley, CA",
                latitude: 37.7749,
                longitude: -122.4194,
                roundLocations: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              type: "OFFLINE",
              createdAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "r2",
          startTime: new Date("2024-06-03T10:00:00Z").toISOString(),
          endTime: new Date("2024-06-03T18:00:00Z").toISOString(),
          roundNumber: 2,
          roundTitle: "Final Round",
          status: "UPCOMING",
          roundLocations: [
            {
              id: "rl2",
              round: undefined,
              location: {
                id: "loc2",
                name: "Virtual Zoom Room",
                address: "Online",
                latitude: 0,
                longitude: 0,
                roundLocations: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              type: "ONLINE",
              createdAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "round3",
          roundNumber: 3,
          roundTitle: "Finals",
          startTime: new Date("2024-06-03T10:00:00Z").toISOString(),
          endTime: new Date("2024-06-03T18:00:00Z").toISOString(),
          status: "UPCOMING",
          roundLocations: [
            {
              id: "rl3",
              location: {
                id: "loc3",
                name: "Startup Co-Working Space",
                address: "456 Startup Blvd, New York, NY",
                latitude: 40.7128,
                longitude: -74.006,
                roundLocations: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              type: "HYBRID",
              createdAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      resolve(mockRounds);
    }, 500);
  });
};
