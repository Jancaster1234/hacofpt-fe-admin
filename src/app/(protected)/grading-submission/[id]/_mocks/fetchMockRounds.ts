// src/app/(protected)/grading-submission/[id]/_mocks/fetchMockRounds.ts
import { Round } from "@/types/entities/round";

export const fetchMockRounds = (hackathonId: string): Promise<Round[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      const mockRounds: Round[] = [
        {
          id: "round1",
          hackathonId,
          roundNumber: 1,
          roundTitle: "Preliminary Round",
          startTime: new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // 7 days ago
          endTime: new Date(
            now.getTime() - 6 * 24 * 60 * 60 * 1000
          ).toISOString(), // 6 days ago
          status: "COMPLETED",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "round2",
          hackathonId,
          roundNumber: 2,
          roundTitle: "Semi-Finals",
          startTime: new Date(
            now.getTime() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(), // 2 days ago
          endTime: new Date(
            now.getTime() - 1 * 24 * 60 * 60 * 1000
          ).toISOString(), // 1 day ago
          status: "COMPLETED",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "round3",
          hackathonId,
          roundNumber: 3,
          roundTitle: "Finals",
          startTime: new Date(
            now.getTime() + 1 * 24 * 60 * 60 * 1000
          ).toISOString(), // 1 day ahead
          endTime: new Date(
            now.getTime() + 2 * 24 * 60 * 60 * 1000
          ).toISOString(), // 2 days ahead
          status: "UPCOMING",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockRounds);
    }, 500);
  });
};
