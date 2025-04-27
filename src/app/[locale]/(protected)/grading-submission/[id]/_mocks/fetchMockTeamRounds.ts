// src/app/[locale]/(protected)/grading-submission/[id]/_mocks/fetchMockTeamRounds.ts
import { TeamRound } from "@/types/entities/teamRound";

export const fetchMockTeamRounds = (
  userId: string,
  roundId: string
): Promise<TeamRound[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTeamRounds: TeamRound[] = [
        {
          id: "tr1",
          team: {
            id: "team1",
            name: "Team Alpha",
            teamLeader: {
              id: "leader1",
              firstName: "Team Lead",
              lastName: "Alpha",
            },
            teamMembers: [
              {
                id: "ut1",
                user: {
                  id: "user5",
                  firstName: "Alice",
                  lastName: "Anderson",
                },
                userId: "user5",
                teamId: "team1",
              },
              {
                id: "ut2",
                user: {
                  id: "user6",
                  firstName: "Bob",
                  lastName: "Brown",
                },
                userId: "user6",
                teamId: "team1",
              },
              {
                id: "ut3",
                user: {
                  id: "user7",
                  firstName: "Charlie",
                  lastName: "Clark",
                },
                userId: "user7",
                teamId: "team1",
              },
            ],
          },
          round: { id: roundId, roundTitle: `Round ${roundId}` },
          status: "AWAITING_JUDGING",
          description: `Evaluation for Team Alpha in ${roundId}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          teamRoundJudges: [
            {
              id: "j1",
              judge: {
                id: userId,
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                avatarUrl: "/avatars/john-doe.jpg",
                userRoles: [
                  {
                    id: "ur2",
                    user: {
                      id: "judge2",
                    },
                    role: { id: "2", name: "JUDGE" },
                  },
                ],
                university: "Tech University",
                skills: ["Software Development", "Machine Learning"],
              },
              teamRoundId: "tr1",
              createdAt: new Date().toISOString(),
            },
            {
              id: "j2",
              judge: {
                id: "user2",
                firstName: "Jane",
                lastName: "Smith",
                email: "jane.smith@example.com",
                avatarUrl: "/avatars/jane-smith.jpg",
                userRoles: [
                  {
                    id: "ur2",
                    user: {
                      id: "judge2",
                    },
                    role: { id: "2", name: "JUDGE" },
                  },
                ],
                university: "Innovation College",
                skills: ["Product Management", "Entrepreneurship"],
              },
              teamRoundId: "tr1",
              createdAt: new Date().toISOString(),
            },
          ],
        },
        {
          id: "tr2",
          team: {
            id: "team2",
            name: "Team Beta",
            teamLeader: {
              id: "leader2",
              firstName: "Team Lead",
              lastName: "Beta",
            },
            teamMembers: [
              {
                id: "ut4",
                user: {
                  id: "user8",
                  firstName: "David",
                  lastName: "Davis",
                },
                userId: "user8",
                teamId: "team2",
              },
              {
                id: "ut5",
                user: {
                  id: "user9",
                  firstName: "Eve",
                  lastName: "Evans",
                },
                userId: "user9",
                teamId: "team2",
              },
            ],
          },
          round: { id: roundId, roundTitle: `Round ${roundId}` },
          status: "PENDING",
          description: `Evaluation for Team Beta in ${roundId}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          teamRoundJudges: [
            {
              id: "j3",
              judge: {
                id: userId,
                firstName: "Alex",
                lastName: "Johnson",
                email: "alex.johnson@example.com",
                avatarUrl: "/avatars/alex-johnson.jpg",
                userRoles: [
                  {
                    id: "ur2",
                    user: {
                      id: "judge2",
                    },
                    role: { id: "2", name: "JUDGE" },
                  },
                ],
                university: "Design Institute",
                skills: ["UX Design", "User Research"],
              },
              teamRoundId: "tr2",
              createdAt: new Date().toISOString(),
            },
          ],
        },
        {
          id: "tr3",
          team: {
            id: "team3",
            name: "Team Gamma",
            teamLeader: {
              id: "leader3",
              firstName: "Team Lead",
              lastName: "Gamma",
            },
            teamMembers: [
              {
                id: "ut6",
                user: {
                  id: "user10",
                  firstName: "Frank",
                  lastName: "Foster",
                },
                userId: "user10",
                teamId: "team3",
              },
            ],
          },
          round: { id: roundId, roundTitle: `Round ${roundId}` },
          status: "PASSED",
          description: `Evaluation for Team Gamma in ${roundId}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          teamRoundJudges: [],
        },
        {
          id: "tr4",
          team: {
            id: "team4",
            name: "Team Delta",
            teamLeader: {
              id: "leader4",
              firstName: "Team Lead",
              lastName: "Delta",
            },
            teamMembers: [
              {
                id: "ut7",
                user: {
                  id: "user11",
                  firstName: "Grace",
                  lastName: "Green",
                },
                userId: "user11",
                teamId: "team4",
              },
              {
                id: "ut8",
                user: {
                  id: "user12",
                  firstName: "Henry",
                  lastName: "Hall",
                },
                userId: "user12",
                teamId: "team4",
              },
            ],
          },
          round: { id: roundId, roundTitle: `Round ${roundId}` },
          status: "FAILED",
          description: `Evaluation for Team Delta in ${roundId}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          teamRoundJudges: [
            {
              id: "j4",
              judge: {
                id: userId,
                firstName: "Emily",
                lastName: "Williams",
                email: "emily.williams@example.com",
                avatarUrl: "/avatars/emily-williams.jpg",
                userRoles: [
                  {
                    id: "ur2",
                    user: {
                      id: "judge2",
                    },
                    role: { id: "2", name: "JUDGE" },
                  },
                ],
                university: "Business School",
                skills: ["Entrepreneurship", "Strategic Planning"],
              },
              teamRoundId: "tr4",
              createdAt: new Date().toISOString(),
            },
          ],
        },
      ];
      resolve(mockTeamRounds);
    }, 500);
  });
};
