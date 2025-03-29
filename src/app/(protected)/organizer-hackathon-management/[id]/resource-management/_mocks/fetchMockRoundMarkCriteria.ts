// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockRoundMarkCriteria.ts
import { RoundMarkCriterion } from "@/types/entities/roundMarkCriterion";

export const fetchMockRoundMarkCriteria = (
  roundId: string
): Promise<RoundMarkCriterion[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockRoundMarkCriteria: RoundMarkCriterion[] = [
        {
          id: "rmc1",
          round: {
            id: roundId,
            roundTitle: "Preliminary Round",
            roundNumber: 1,
            status: "ONGOING",
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
          },
          name: "Innovation",
          maxScore: 10,
          note: "Evaluates the originality and uniqueness of the idea.",
          judgeSubmissionDetails: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "rmc2",
          round: {
            id: roundId,
            roundTitle: "Preliminary Round",
            roundNumber: 1,
            status: "ONGOING",
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 3600000).toISOString(),
          },
          name: "Technical Execution",
          maxScore: 15,
          note: "Assesses the quality of the implementation and code structure.",
          judgeSubmissionDetails: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "rmc3",
          round: {
            id: roundId,
            roundTitle: "Preliminary Round",
            roundNumber: 1,
            status: "ONGOING",
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 3600000).toISOString(),
          },
          name: "Presentation",
          maxScore: 5,
          note: "Scores the clarity and effectiveness of the presentation.",
          judgeSubmissionDetails: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockRoundMarkCriteria);
    }, 500);
  });
};
