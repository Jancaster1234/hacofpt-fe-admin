// src/app/[locale]/(protected)/dashboard/_mocks/fetchMockTeams.ts
import { Team } from "@/types/entities/team";

export const fetchMockTeams = (hackathonId: string): Promise<Team[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTeams: Team[] = [
        {
          id: "team1",
          name: "Team Alpha",
          teamLeader: {
            id: "user123",
            firstName: "Alice",
            lastName: "Smith",
            email: "alice.smith@example.com",
            username: "alicesmith",
            avatarUrl: "https://example.com/alice-avatar.png",
            status: "ACTIVE",
            userRoles: [
              {
                id: "ur1",
                user: { id: "user123" },
                role: { id: "2", name: "TEAM_MEMBER" },
              },
            ],
          },
          teamMembers: [
            {
              id: "ut1",
              user: {
                id: "user123",
                firstName: "Alice",
                lastName: "Smith",
                email: "alice.smith@example.com",
                username: "alicesmith",
                avatarUrl: "https://example.com/alice-avatar.png",
                status: "ACTIVE",
                userRoles: [
                  {
                    id: "ur1",
                    user: { id: "user123" },
                    role: { id: "2", name: "TEAM_MEMBER" },
                  },
                ],
              },
            },
            {
              id: "ut2",
              user: {
                id: "user456",
                firstName: "Bob",
                lastName: "Johnson",
                email: "bob.johnson@example.com",
                username: "bobjohnson",
                avatarUrl: "https://example.com/bob-avatar.png",
                status: "ACTIVE",
                userRoles: [
                  {
                    id: "ur2",
                    user: { id: "user456" },
                    role: { id: "2", name: "TEAM_MEMBER" },
                  },
                ],
              },
            },
          ],
          teamHackathons: [
            {
              id: "th1",
              team: undefined,
              hackathon: { id: hackathonId, title: "Hackathon X" },
              status: "ACTIVE",
            },
          ],
          isDeleted: false,
          bio: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "team2",
          name: "Team Beta",
          teamLeader: {
            id: "user789",
            firstName: "Charlie",
            lastName: "Brown",
            email: "charlie.brown@example.com",
            username: "charliebrown",
            avatarUrl: "https://example.com/charlie-avatar.png",
            status: "ACTIVE",
            userRoles: [
              {
                id: "ur3",
                user: { id: "user789" },
                role: { id: "2", name: "TEAM_MEMBER" },
              },
            ],
          },
          teamMembers: [
            {
              id: "ut3",
              user: {
                id: "user789",
                firstName: "Charlie",
                lastName: "Brown",
                email: "charlie.brown@example.com",
                username: "charliebrown",
                avatarUrl: "https://example.com/charlie-avatar.png",
                status: "ACTIVE",
                userRoles: [
                  {
                    id: "ur3",
                    user: { id: "user789" },
                    role: { id: "2", name: "TEAM_MEMBER" },
                  },
                ],
              },
            },
            {
              id: "ut4",
              user: {
                id: "userIdz",
                firstName: "Your",
                lastName: "Name",
                email: "yourname@example.com",
                username: "yourname",
                avatarUrl: "https://example.com/your-avatar.png",
                status: "ACTIVE",
                userRoles: [
                  {
                    id: "ur4",
                    user: { id: userId },
                    role: { id: "2", name: "TEAM_MEMBER" },
                  },
                ],
              },
            }, // User in Team Beta
          ],
          teamHackathons: [
            {
              id: "th3",
              team: undefined,
              hackathon: { id: hackathonId, title: "Hackathon X" },
              status: "ACTIVE",
            },
          ],
          isDeleted: false,
          bio: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockTeams);
    }, 500);
  });
};
