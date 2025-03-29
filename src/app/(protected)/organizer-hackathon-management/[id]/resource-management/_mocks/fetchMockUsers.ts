// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockUsers.ts
import { User } from "@/types/entities/user";
//return user with roles: ORGANIZER, JUDGE, MENTOR
export const fetchMockUsers = (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUsers: User[] = [
        {
          id: "user1",
          email: "john.doe@example.com",
          username: "john_d",
          firstName: "John",
          lastName: "Doe",
          avatarUrl: "/avatars/john-doe.jpg",
          bio: "Software engineer and hackathon enthusiast.",
          country: "USA",
          city: "New York",
          birthdate: "1992-04-23",
          roles: [
            {
              id: "1",
              name: "ORGANIZER",
              description: "Manages hackathons and events",
            },
          ],
        },
        {
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
          roles: [
            {
              id: "2",
              name: "JUDGE",
              description: "Evaluates submissions",
            },
          ],
        },
        {
          id: "user3",
          email: "alex.lee@example.com",
          username: "alex_l",
          firstName: "Alex",
          lastName: "Lee",
          avatarUrl: "/avatars/alex-lee.jpg",
          bio: "Mentor with a passion for cybersecurity.",
          country: "Australia",
          city: "Sydney",
          birthdate: "1990-01-30",
          roles: [
            {
              id: "5",
              name: "MENTOR",
              description: "Provides guidance to participants",
            },
          ],
        },
        {
          id: "user4",
          email: "alex.lee@example.com",
          username: "alex_l",
          firstName: "Alex",
          lastName: "Lee",
          avatarUrl: "/avatars/alex-lee.jpg",
          bio: "Mentor with a passion for cybersecurity.",
          country: "Australia",
          city: "Sydney",
          birthdate: "1990-01-30",
          roles: [
            {
              id: "5",
              name: "MENTOR",
              description: "Provides guidance to participants",
            },
          ],
        },
        {
          id: "user5",
          email: "jane.smith@example.com",
          username: "jane_s",
          firstName: "Jane",
          lastName: "Smith",
          avatarUrl: "/avatars/jane-smith.jpg",
          bio: "Judge with expertise in AI and ML.",
          country: "UK",
          city: "London",
          birthdate: "1987-09-12",
          roles: [
            {
              id: "2",
              name: "JUDGE",
              description: "Evaluates submissions",
            },
          ],
        },
      ];
      resolve(mockUsers);
    }, 500);
  });
};
