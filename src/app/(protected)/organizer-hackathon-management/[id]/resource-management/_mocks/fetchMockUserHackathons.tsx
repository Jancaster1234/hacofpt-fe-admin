// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockUserHackathons.tsx
import { UserHackathon } from "@/types/entities/userHackathon";

export const fetchMockUserHackathons = (
  hackathonId: string
): Promise<UserHackathon[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      const mockUserHackathons: UserHackathon[] = [
        {
          id: "uh1",
          user: {
            id: "user1",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            avatarUrl: "/avatars/john-doe.jpg",
            status: "Active",
            skills: ["JavaScript", "React", "Node.js"],
            experienceLevel: "Advanced",
          },
          hackathonId,
          role: "JUDGE",
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: "uh2",
          user: {
            id: "user2",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            avatarUrl: "/avatars/john-doe.jpg",
            status: "Active",
            skills: ["JavaScript", "React", "Node.js"],
            experienceLevel: "Advanced",
          },
          hackathonId,
          role: "JUDGE",
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: "uh3",
          user: {
            id: "user3",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            avatarUrl: "/avatars/john-doe.jpg",
            status: "Active",
            skills: ["JavaScript", "React", "Node.js"],
            experienceLevel: "Advanced",
          },
          hackathonId,
          role: "MENTOR",
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: "uh4",
          user: {
            id: "user4",
            firstName: "Alice",
            lastName: "Smith",
            email: "alice.smith@example.com",
            avatarUrl: "/avatars/alice-smith.jpg",
            status: "Active",
            skills: ["Python", "Data Science"],
            experienceLevel: "Intermediate",
          },
          hackathonId,
          role: "MENTOR",
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: "uh5",
          user: {
            id: "user5",
            firstName: "Alice",
            lastName: "Smith",
            email: "alice.smith@example.com",
            avatarUrl: "/avatars/alice-smith.jpg",
            status: "Active",
            skills: ["Python", "Data Science"],
            experienceLevel: "Intermediate",
          },
          hackathonId,
          role: "ORGANIZER",
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: "uh6",
          user: {
            id: "user6",
            firstName: "Alice",
            lastName: "Smith",
            email: "alice.smith@example.com",
            avatarUrl: "/avatars/alice-smith.jpg",
            status: "Active",
            skills: ["Python", "Data Science"],
            experienceLevel: "Intermediate",
          },
          hackathonId,
          role: "ORGANIZER",
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      ];
      resolve(mockUserHackathons);
    }, 500);
  });
};
