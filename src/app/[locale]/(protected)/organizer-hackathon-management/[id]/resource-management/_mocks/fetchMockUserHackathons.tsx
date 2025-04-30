// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockUserHackathons.tsx
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
            username: "John.Doe",
            email: "john.doe@example.com",
            avatarUrl: "/avatars/john-doe.jpg",
            userRoles: [
              {
                id: "ur3asd",
                role: { id: "3", name: "JUDGE" },
              },
            ],
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
            firstName: "John2",
            lastName: "Doe2",
            username: "John2.Doe2",
            email: "john.doe@example.com",
            avatarUrl: "/avatars/john-doe.jpg",
            userRoles: [
              {
                id: "ur3sda",
                role: { id: "3", name: "JUDGE" },
              },
            ],
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
            userRoles: [
              {
                id: "ur3a",
                role: { id: "2", name: "MENTOR" },
              },
            ],
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
            username: "charlisadsade.brown",
            email: "alice.smith@example.com",
            avatarUrl: "/avatars/alice-smith.jpg",
            userRoles: [
              {
                id: "ur3aa",
                role: { id: "2", name: "MENTOR" },
              },
            ],
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
            username: "charlie.brown",
            avatarUrl: "/avatars/alice-smith.jpg",
            userRoles: [
              {
                id: "ur3aa",
                role: { id: "4", name: "ORGANIZER" },
              },
            ],
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
            username: "alice.smith",
            userRoles: [
              {
                id: "ur3aa",
                role: { id: "4", name: "ORGANIZER" },
              },
            ],
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
