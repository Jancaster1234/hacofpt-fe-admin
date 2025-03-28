// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockTeamRounds.ts
import { TeamRound, TeamRoundStatus } from "@/types/entities/teamRound";

export const fetchMockTeamRounds = (roundId: string): Promise<TeamRound[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTeamRounds: TeamRound[] = [
        {
          id: "tr1",
          teamId: "team1",
          roundId,
          status: "AwaitingJudging",
          description: `Evaluation for Team Alpha in ${roundId}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "tr2",
          teamId: "team2",
          roundId,
          status: "Pending",
          description: `Evaluation for Team Beta in ${roundId}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "tr3",
          teamId: "team3",
          roundId,
          status: "Passed",
          description: `Evaluation for Team Gamma in ${roundId}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "tr4",
          teamId: "team4",
          roundId,
          status: "Failed",
          description: `Evaluation for Team Delta in ${roundId}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockTeamRounds);
    }, 500);
  });
};
