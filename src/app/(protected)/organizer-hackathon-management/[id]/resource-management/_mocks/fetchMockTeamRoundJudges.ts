// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockTeamRoundJudges.ts
import { TeamRoundJudge } from "@/types/entities/teamRoundJudge";

export const fetchMockTeamRoundJudges = (
  teamRoundId: string
): Promise<TeamRoundJudge[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTeamRoundJudges: TeamRoundJudge[] = [
        {
          id: "trj1",
          teamRoundId,
          judgeId: "judge1",
          judge: { id: "judge1", firstName: "Alice", lastName: "Smith" },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "trj2",
          teamRoundId,
          judgeId: "judge2",
          judge: { id: "judge2", firstName: "Bob", lastName: "Johnson" },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockTeamRoundJudges);
    }, 500);
  });
};
