// src/app/(protected)/mentor-team/_mocks/fetchMockMentorTeams.ts
import { MentorTeam } from "@/types/entities/mentorTeam";

export const fetchMockMentorTeams = (
  mentorId: string
): Promise<MentorTeam[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockMentorTeams: MentorTeam[] = [
        {
          id: "mt1",
          hackathon: { id: "hack1", title: "Hackathon Alpha" },
          mentor: { id: mentorId, firstName: "Your", lastName: "Name" },
          team: { id: "team1", name: "Team Alpha" },
          mentorshipSessionRequests: [
            {
              id: "msr1",
              mentorTeam: undefined,
              startTime: new Date().toISOString(),
              endTime: new Date(Date.now() + 3600000).toISOString(),
              location: "Room A1",
              description: "Mentoring session on project design.",
              status: "pending",
              evaluatedBy: undefined,
              evaluatedAt: undefined,
              createdByUserName: "Alice Smith",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdByUserName: "Admin User",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "mt2",
          hackathon: { id: "hack2", title: "Hackathon Beta" },
          mentor: { id: mentorId, firstName: "Your", lastName: "Name" },
          team: { id: "team2", name: "Team Beta" },
          mentorshipSessionRequests: [
            {
              id: "msr2",
              mentorTeam: undefined,
              startTime: new Date().toISOString(),
              endTime: new Date(Date.now() + 7200000).toISOString(),
              location: "Room B2",
              description: "Mentoring session on technical implementation.",
              status: "approved",
              evaluatedBy: {
                id: "admin2",
                firstName: "Reviewer",
                lastName: "Smith",
              },
              evaluatedAt: new Date().toISOString(),
              createdByUserName: "Charlie Brown",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          createdByUserName: "Reviewer Smith",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      resolve(mockMentorTeams);
    }, 500);
  });
};
