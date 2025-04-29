// src/app/[locale]/(protected)/dashboard/_mocks/fetchMockUsers.ts
import { User } from "@/types/entities/user";

export const fetchMockUsers = (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUsers: User[] = [
        {
          id: "user1",
          email: "alice@example.com",
          username: "alicewonder",
          firstName: "Alice",
          lastName: "Wonderland",
          avatarUrl: "https://example.com/avatars/alice.jpg",
          userRoles: [
            {
              id: "1",
              role: {
                id: "3",
                name: "ADMIN",
              },
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "system",
        },
        {
          id: "user2",
          email: "bob@example.com",
          username: "bobby99",
          firstName: "Bob",
          lastName: "Builder",
          avatarUrl: "https://example.com/avatars/bob.jpg",
          userRoles: [
            {
              id: "2",
              role: {
                id: "6",
                name: "TEAM_MEMBER",
              },
            },
            {
              id: "3",
              role: {
                id: "5",
                name: "MENTOR",
              },
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "adminuser",
        },
      ];

      resolve(mockUsers);
    }, 500);
  });
};
