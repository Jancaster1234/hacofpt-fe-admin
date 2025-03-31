// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockTeamRequests.ts
import { TeamRequest } from "@/types/entities/teamRequest";

export const fetchMockTeamRequests = (
  hackathonId: string
): Promise<TeamRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTeamRequests: TeamRequest[] = [
        {
          id: "tr1",
          status: "pending",
          confirmationDeadline: new Date().toISOString(),
          note: "Looking for teammates!",
          reviewedBy: undefined,
          teamRequestMembers: [
            {
              id: "trm1",
              user: {
                id: "user123",
                firstName: "Your",
                lastName: "Name",
                email: "your.email@example.com",
                username: "your_username",
                avatarUrl: "https://example.com/avatar1.png",
                bio: "Aspiring developer looking for team members.",
                country: "USA",
                city: "New York",
                linkedinUrl: "https://linkedin.com/in/yourprofile",
                githubUrl: "https://github.com/yourprofile",
                skills: ["JavaScript", "React", "Node.js"],
                experienceLevel: "Intermediate",
                status: "Active",
              },
              status: "pending",
              respondedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "trm2",
              user: {
                id: "user456",
                firstName: "Bob",
                lastName: "Johnson",
                email: "bob.johnson@example.com",
                username: "bobj",
                avatarUrl: "https://example.com/avatar2.png",
                bio: "Frontend developer passionate about UI/UX.",
                country: "Canada",
                city: "Toronto",
                linkedinUrl: "https://linkedin.com/in/bobjohnson",
                githubUrl: "https://github.com/bobjohnson",
                skills: ["HTML", "CSS", "Vue.js"],
                experienceLevel: "Advanced",
                status: "Active",
              },
              status: "no_response",
              respondedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdByUserName: "alice_smith",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "tr2",
          status: "under_review",
          confirmationDeadline: new Date().toISOString(),
          note: "Team is reviewing applications.",
          reviewedBy: {
            id: "admin1",
            firstName: "Admin",
            lastName: "User",
            email: "admin@example.com",
            username: "admin_user",
            avatarUrl: "https://example.com/admin.png",
            bio: "Admin overseeing hackathon applications.",
            country: "USA",
            city: "San Francisco",
            linkedinUrl: "https://linkedin.com/in/adminuser",
            githubUrl: "https://github.com/adminuser",
            skills: ["Management", "Event Planning"],
            experienceLevel: "Advanced",
            status: "Active",
          },
          teamRequestMembers: [
            {
              id: "trm3",
              user: {
                id: "userId789",
                firstName: "Bob",
                lastName: "Johnson",
                email: "bob.johnson@example.com",
                username: "bobj",
                avatarUrl: "https://example.com/avatar2.png",
                bio: "Frontend developer passionate about UI/UX.",
                country: "Canada",
                city: "Toronto",
                linkedinUrl: "https://linkedin.com/in/bobjohnson",
                githubUrl: "https://github.com/bobjohnson",
                skills: ["HTML", "CSS", "Vue.js"],
                experienceLevel: "Advanced",
                status: "Active",
              },
              status: "approved",
              respondedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdByUserName: "charlieb",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      resolve(mockTeamRequests);
    }, 500);
  });
};
