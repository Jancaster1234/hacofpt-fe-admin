// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockIndividualRegistrationsByHackathonIdAndStatus.ts
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";

export const fetchMockIndividualRegistrationsByHackathonIdAndStatus = (
  hackathonId: string,
  status: "PENDING" | "APPROVED" | "REJECTED"
): Promise<IndividualRegistrationRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockApprovedRegistrations: IndividualRegistrationRequest[] = [
        {
          id: "reg2",
          hackathonId: hackathonId,
          status: "APPROVED",
          reviewedBy: {
            id: "adminUser",
            firstName: "Admin",
            lastName: "User",
            email: "admin@example.com",
            username: "adminUser",
            avatarUrl: "https://example.com/avatar.png",
          },
          createdByUserName: "Bob Johnson",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "reg3",
          hackathonId: hackathonId,
          status: "APPROVED",
          reviewedBy: {
            id: "admin2",
            firstName: "Moderator",
            lastName: "One",
            email: "moderator@example.com",
            username: "moderatorOne",
            avatarUrl: "https://example.com/moderator.png",
          },
          createdByUserName: "Charlie Davis",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "reg4",
          hackathonId: hackathonId,
          status: "APPROVED",
          reviewedBy: {
            id: "admin2",
            firstName: "Moderator",
            lastName: "One",
            email: "moderator@example.com",
            username: "moderatorOne",
            avatarUrl: "https://example.com/moderator.png",
          },
          createdByUserName: "Charlie Da",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "reg5",
          hackathonId: hackathonId,
          status: "APPROVED",
          reviewedBy: {
            id: "admin2",
            firstName: "Moderator",
            lastName: "One",
            email: "moderator@example.com",
            username: "moderatorOne",
            avatarUrl: "https://example.com/moderator.png",
          },
          createdByUserName: "Charlie Dasvis",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "reg6",
          hackathonId: hackathonId,
          status: "APPROVED",
          reviewedBy: {
            id: "admin2",
            firstName: "Moderator",
            lastName: "One",
            email: "moderator@example.com",
            username: "moderatorOne",
            avatarUrl: "https://example.com/moderator.png",
          },
          createdByUserName: "Caaharlie Davis",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "reg7",
          hackathonId: hackathonId,
          status: "APPROVED",
          reviewedBy: {
            id: "admin2",
            firstName: "Moderator",
            lastName: "One",
            email: "moderator@example.com",
            username: "moderatorOne",
            avatarUrl: "https://example.com/moderator.png",
          },
          createdByUserName: "Charlissdse Davis",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "reg8",
          hackathonId: hackathonId,
          status: "APPROVED",
          reviewedBy: {
            id: "admin2",
            firstName: "Moderator",
            lastName: "One",
            email: "moderator@example.com",
            username: "moderatorOne",
            avatarUrl: "https://example.com/moderator.png",
          },
          createdByUserName: "Charlie Daesvis",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "reg9",
          hackathonId: hackathonId,
          status: "APPROVED",
          reviewedBy: {
            id: "admin2",
            firstName: "Moderator",
            lastName: "One",
            email: "moderator@example.com",
            username: "moderatorOne",
            avatarUrl: "https://example.com/moderator.png",
          },
          createdByUserName: "Chaavarlie Davis",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockApprovedRegistrations);
    }, 500);
  });
};
