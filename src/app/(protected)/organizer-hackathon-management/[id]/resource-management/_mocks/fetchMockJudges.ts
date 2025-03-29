// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockJudges.ts
import { User } from "@/types/entities/user";

export const fetchMockJudges = (hackathonId: string): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockJudges: User[] = [
        {
          id: "judge1",
          firstName: "Alice",
          lastName: "Smith",
          email: "alice@example.com",
          userRoles: [
            {
              id: "ur1",
              user: { id: "judge1", firstName: "Alice", lastName: "Smith" },
              role: { id: "2", name: "JUDGE" },
            },
          ],
          userHackathons: [
            {
              id: "uh1",
              userId: "judge1",
              hackathonId,
              role: "Judge",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          status: "Active",
          linkedinUrl: "https://linkedin.com/in/alicesmith",
          experienceLevel: "Advanced",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "judge2",
          firstName: "Bob",
          lastName: "Johnson",
          email: "bob@example.com",
          userRoles: [
            {
              id: "ur2",
              user: { id: "judge2", firstName: "Bob", lastName: "Johnson" },
              role: { id: "2", name: "JUDGE" },
            },
          ],
          userHackathons: [
            {
              id: "uh2",
              userId: "judge2",
              hackathonId,
              role: "Judge",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          status: "Active",
          githubUrl: "https://github.com/bobjohnson",
          experienceLevel: "Intermediate",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockJudges);
    }, 500);
  });
};
