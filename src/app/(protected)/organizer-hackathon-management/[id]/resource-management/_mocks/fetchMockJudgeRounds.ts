// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockJudgeRounds.ts

import { JudgeRound } from "@/types/entities/judgeRound";

export const fetchMockJudgeRounds = (
  roundId: string
): Promise<JudgeRound[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      const mockJudgeRounds: JudgeRound[] = [
        {
          id: `judgeRound1-${roundId}`,
          judge: {
            id: "judge1",
            firstName: "Alice",
            lastName: "Johnson",
            email: "alice.johnson@example.com",
          },
          judgeId: "judge1",
          roundId,
          isDeleted: false,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: `judgeRound2-${roundId}`,
          judge: {
            id: "judge2",
            firstName: "Bob",
            lastName: "Smith",
            email: "bob.smith@example.com",
          },
          judgeId: "judge2",
          roundId,
          isDeleted: false,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      ];
      resolve(mockJudgeRounds);
    }, 500);
  });
};
