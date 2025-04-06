// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockUserByUsername.ts
import { User } from "@/types/entities/user";

export const fetchMockUserByUsername = (
  username: string
): Promise<User | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUser: User = {
        id: "user2",
        email: "jane.smith@example.com",
        username: "jane_s",
        firstName: "Jane",
        lastName: "Smith",
        avatarUrl: "/avatars/jane-smith.jpg",
        bio: "Judge with expertise in AI and ML.",
        country: "UK",
        city: "London",
        birthdate: "1987-09-12",
        createdByUserName: "Bob",
        userRoles: [
          {
            role: { id: "2", name: "TEAM_MEMBER" },
          },
        ],
      };
      resolve(mockUser);
    }, 500);
  });
};
