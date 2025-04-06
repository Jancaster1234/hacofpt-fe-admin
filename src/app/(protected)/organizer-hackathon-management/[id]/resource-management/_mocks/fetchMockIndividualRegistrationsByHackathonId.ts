// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockIndividualRegistrationsByHackathonId.ts
import { IndividualRegistrationRequest } from "@/types/entities/individualRegistrationRequest";

export const fetchMockIndividualRegistrationsByHackathonId = (
  hackathonId: string
): Promise<IndividualRegistrationRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockIndividualRegistrations: IndividualRegistrationRequest[] = [
        {
          id: "reg1",
          status: "PENDING",
          reviewedBy: undefined,
          createdByUserName: "Alice Smith",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "reg2",
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
      ];
      resolve(mockIndividualRegistrations);
    }, 500);
  });
};
