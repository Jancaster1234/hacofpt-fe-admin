// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockHackathonResults.tsx
import { HackathonResult } from "@/types/entities/hackathonResult";

export const fetchMockHackathonResults = (
  hackathonId: string
): Promise<HackathonResult[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockHackathonResults: HackathonResult[] = [
        {
          id: "hr1",
          hackathon: {
            id: hackathonId,
            title: `Hackathon ${hackathonId}`,
            description: `Annual Hackathon ${hackathonId}`,
            startDate: new Date("2024-06-01").toISOString(),
            endDate: new Date("2024-06-05").toISOString(),
          },
          team: {
            id: "team1",
            name: "Team Alpha",
            teamLeader: {
              id: "leader1",
              firstName: "Team Lead",
              lastName: "Alpha",
              email: "leader.alpha@example.com",
              username: "teamlead_alpha",
              avatarUrl: "/avatars/leader-alpha.jpg",
            },
            teamMembers: [
              {
                id: "ut1",
                user: {
                  id: "user5",
                  firstName: "Alice",
                  lastName: "Anderson",
                  email: "alice.anderson@example.com",
                  username: "alice_a",
                  avatarUrl: "/avatars/alice.jpg",
                },
              },
            ],
          },
          totalScore: 95,
          placement: 1,
          award: "Grand Prize",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "hr2",
          hackathon: {
            id: hackathonId,
            title: `Hackathon ${hackathonId}`,
            description: `Annual Hackathon ${hackathonId}`,
            startDate: new Date("2024-06-01").toISOString(),
            endDate: new Date("2024-06-05").toISOString(),
          },
          team: {
            id: "team2",
            name: "Team Beta",
            teamLeader: {
              id: "leader2",
              firstName: "Team Lead",
              lastName: "Beta",
              email: "leader.beta@example.com",
              username: "teamlead_beta",
              avatarUrl: "/avatars/leader-beta.jpg",
            },
            teamMembers: [
              {
                id: "ut2",
                user: {
                  id: "user6",
                  firstName: "Bob",
                  lastName: "Brown",
                  email: "bob.brown@example.com",
                  username: "bobb",
                  avatarUrl: "/avatars/bob.jpg",
                },
              },
            ],
          },
          totalScore: 88,
          placement: 2,
          award: "Runner-Up",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "hr3",
          hackathon: {
            id: hackathonId,
            title: `Hackathon ${hackathonId}`,
            description: `Annual Hackathon ${hackathonId}`,
            startDate: new Date("2024-06-01").toISOString(),
            endDate: new Date("2024-06-05").toISOString(),
          },
          team: {
            id: "team3",
            name: "Team Gamma",
            teamLeader: {
              id: "leader3",
              firstName: "Team Lead",
              lastName: "Gamma",
              email: "leader.gamma@example.com",
              username: "teamlead_gamma",
              avatarUrl: "/avatars/leader-gamma.jpg",
            },
            teamMembers: [
              {
                id: "ut3",
                user: {
                  id: "user7",
                  firstName: "Charlie",
                  lastName: "Clark",
                  email: "charlie.clark@example.com",
                  username: "charlie_c",
                  avatarUrl: "/avatars/charlie.jpg",
                },
              },
            ],
          },
          totalScore: 75,
          placement: 3,
          award: "Best Innovation",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      resolve(mockHackathonResults);
    }, 500);
  });
};
