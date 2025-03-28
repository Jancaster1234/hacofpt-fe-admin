// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockTeamRounds.ts
import { TeamRound, TeamRoundStatus } from "@/types/entities/teamRound";

export const fetchMockTeamRounds = (
  hackathonId: string
): Promise<TeamRound[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTeamRounds: TeamRound[] = [
        {
          id: "tr1",
          teamId: "team1",
          roundId: "round1",
          status: "AwaitingJudging",
          description: "Round 1 evaluation for Team Alpha",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "tr2",
          teamId: "team2",
          roundId: "round1",
          status: "Pending",
          description: "Round 1 evaluation for Team Beta",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockTeamRounds);
    }, 500);
  });
};
