// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockNotifications.tsx
import { Notification } from "@/types/entities/notification";

export const fetchMockNotifications = (
  senderId: string
): Promise<Notification[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockNotifications: Notification[] = [
        {
          id: "notif1",
          sender: {
            id: senderId,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            username: "johndoe",
            avatarUrl: "/avatars/john.jpg",
          },
          recipient: {
            id: "user1",
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
            {
              id: "delivery2",
              method: "IN_APP",
              status: "PENDING",
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
            id: senderId,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            username: "johndoe",
            avatarUrl: "/avatars/john.jpg",
          },
          recipient: {
            id: "user2",
            firstName: "Bob",
            lastName: "Johnson",
            email: "bob.johnson@example.com",
            username: "bobj",
            avatarUrl: "/avatars/bob.jpg",
          },
          type: "TEAM_INVITE",
          content: "John invited you to join Team Alpha.",
          metadata: JSON.stringify({ teamId: "team1" }),
          isRead: true,
          notificationDeliveries: [
            {
              id: "delivery3",
              method: "PUSH",
              status: "FAILED",
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
