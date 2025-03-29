// src/mocks/fetchMockNotifications.ts
import { Notification } from "@/types/entities/notification";

export const fetchMockNotifications = (
  userId: string
): Promise<Notification[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockNotifications: Notification[] = [
        {
          id: "notif1",
          sender: {
            id: "user123",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            username: "johndoe",
            avatarUrl: "/avatars/john.jpg",
          },
          recipient: {
            id: userId,
            firstName: "Alice",
            lastName: "Smith",
            email: "alice.smith@example.com",
            username: "alices",
            avatarUrl: "/avatars/alice.jpg",
          },
          type: "MESSAGE",
          content: "You have a new message from John.",
          metadata: JSON.stringify({ priority: "high" }),
          isRead: false,
          notificationDeliveries: [
            {
              id: "delivery1",
              method: "EMAIL",
              status: "SENT",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "notif2",
          sender: {
            id: "user456",
            firstName: "Bob",
            lastName: "Johnson",
            email: "bob.johnson@example.com",
            username: "bobj",
            avatarUrl: "/avatars/bob.jpg",
          },
          recipient: {
            id: userId,
            firstName: "Alice",
            lastName: "Smith",
            email: "alice.smith@example.com",
            username: "alices",
            avatarUrl: "/avatars/alice.jpg",
          },
          type: "TEAM_INVITE",
          content: "Bob invited you to join Team Alpha.",
          metadata: JSON.stringify({ teamId: "team1" }),
          isRead: true,
          notificationDeliveries: [
            {
              id: "delivery2",
              method: "PUSH",
              status: "FAILED",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "delivery3",
              method: "IN_APP",
              status: "SENT",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      resolve(mockNotifications);
    }, 500);
  });
};
