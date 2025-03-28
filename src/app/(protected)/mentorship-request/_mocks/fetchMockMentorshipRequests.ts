// src/app/(protected)/mentorship-request/_mocks/fetchMockMentorshipRequests.ts
import { MentorshipRequest } from "@/types/entities/mentorshipRequest";

export const fetchMockMentorshipRequests = (
  mentorId: string
): Promise<MentorshipRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockMentorshipRequests: MentorshipRequest[] = [
        {
          id: "mr1",
          hackathon: { id: "hack1", title: "Hackathon Alpha" },
          mentor: { id: mentorId, firstName: "Your", lastName: "Name" },
          team: { id: "team1", name: "Team Alpha" },
          status: "PENDING",
          evaluatedAt: undefined,
          evaluatedBy: undefined,
          createdBy: { id: "user123", firstName: "Alice", lastName: "Smith" },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "mr2",
          hackathon: { id: "hack2", title: "Hackathon Beta" },
          mentor: { id: mentorId, firstName: "Your", lastName: "Name" },
          team: { id: "team2", name: "Team Beta" },
          status: "APPROVED",
          evaluatedAt: new Date().toISOString(),
          evaluatedBy: { id: "admin1", firstName: "Admin", lastName: "User" },
          createdBy: { id: "user456", firstName: "Bob", lastName: "Johnson" },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      resolve(mockMentorshipRequests);
    }, 500);
  });
};
