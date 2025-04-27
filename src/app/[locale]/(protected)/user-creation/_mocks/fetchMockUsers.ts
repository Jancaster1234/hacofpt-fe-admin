// src/app/[locale]/(protected)/user-creation/_mocks/fetchMockUsers.ts
import { User } from "@/types/entities/user";
export const fetchMockUsers = (createdByUserName?: string): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUsers: User[] = [
        {
          id: "user1",
          email: "alice@example.com",
          username: "alice123",
          firstName: "Alice",
          lastName: "Johnson",
          avatarUrl: "https://example.com/avatars/alice.png",
          bio: "Passionate about coding and mentoring.",
          country: "USA",
          city: "New York",
          birthdate: "1995-08-20",
          phone: "+123456789",
          studentId: "S12345",
          university: "FPT University",
          linkedinUrl: "https://linkedin.com/in/alicejohnson",
          githubUrl: "https://github.com/alicejohnson",
          skills: ["JavaScript", "React", "Node.js"],
          experienceLevel: "Advanced",
          status: "Active",
          userRoles: [
            {
              id: "ur1",
              user: undefined,
              role: {
                id: "5",
                name: "TEAM_MEMBER",
                description: "Provides guidance to participants",
                userRoles: [],
                rolePermissions: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        {
          id: "user2",
          email: "bob@example.com",
          username: "bob_dev",
          firstName: "Bob",
          lastName: "Smith",
          avatarUrl: "https://example.com/avatars/bob.png",
          bio: "Hackathon enthusiast & judge.",
          country: "Canada",
          city: "Toronto",
          birthdate: "1987-12-10",
          phone: "+1987654321",
          linkedinUrl: "https://linkedin.com/in/bobsmith",
          githubUrl: "https://github.com/bobsmith",
          skills: ["Python", "AI", "Django"],
          experienceLevel: "Advanced",
          status: "Active",
          userRoles: [
            {
              id: "ur2",
              user: undefined,
              role: {
                id: "2",
                name: "TEAM_MEMBER",
                description: "Evaluates hackathon submissions",
                userRoles: [],
                rolePermissions: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        },
        {
          id: "user3",
          email: "charlie@example.com",
          username: "charlie_tech",
          firstName: "Charlie",
          lastName: "Brown",
          avatarUrl: "https://example.com/avatars/charlie.png",
          bio: "Organizer and event manager.",
          country: "UK",
          city: "London",
          birthdate: "1990-06-05",
          phone: "+44123456789",
          linkedinUrl: "https://linkedin.com/in/charliebrown",
          githubUrl: "https://github.com/charliebrown",
          skills: ["Event Management", "Leadership"],
          experienceLevel: "Intermediate",
          status: "Active",
          userRoles: [
            {
              id: "ur3",
              user: undefined,
              role: {
                id: "1",
                name: "TEAM_MEMBER",
                description: "Manages hackathons and events",
                userRoles: [],
                rolePermissions: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      ];
      resolve(mockUsers);
    }, 500);
  });
};
