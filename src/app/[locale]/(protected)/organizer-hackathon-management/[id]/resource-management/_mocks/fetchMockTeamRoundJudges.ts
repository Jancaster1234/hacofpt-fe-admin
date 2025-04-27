// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockTeamRoundJudges.ts
import { TeamRoundJudge } from "@/types/entities/teamRoundJudge";

export const fetchMockTeamRoundJudges = (
  teamRoundId: string
): Promise<TeamRoundJudge[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTeamRoundJudges: TeamRoundJudge[] = [
        {
          id: "trj1",
          teamRoundId,
          judge: {
            id: "judge1",
            email: "alice.smith@example.com",
            username: "alice_smith",
            firstName: "Alice",
            lastName: "Smith",
            avatarUrl: "/avatars/alice-smith.jpg",
            bio: "Experienced software engineer and hackathon judge.",
            country: "USA",
            city: "San Francisco",
            birthdate: "1985-06-15",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "trj2",
          teamRoundId,
          judge: {
            id: "judge2",
            email: "bob.johnson@example.com",
            username: "bob_johnson",
            firstName: "Bob",
            lastName: "Johnson",
            avatarUrl: "/avatars/bob-johnson.jpg",
            bio: "AI researcher and hackathon mentor.",
            country: "Canada",
            city: "Toronto",
            birthdate: "1990-09-22",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "trj3",
          teamRoundId,
          judge: {
            id: "judge3",
            email: "bob.johnson@example.com",
            username: "bob_johnson",
            firstName: "Bob",
            lastName: "Johnson",
            avatarUrl: "/avatars/bob-johnson.jpg",
            bio: "AI researcher and hackathon mentor.",
            country: "Canada",
            city: "Toronto",
            birthdate: "1990-09-22",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "trj4",
          teamRoundId,
          judge: {
            id: "judge4",
            email: "bob.johnson@example.com",
            username: "bob_johnson",
            firstName: "Bob",
            lastName: "Johnson",
            avatarUrl: "/avatars/bob-johnson.jpg",
            bio: "AI researcher and hackathon mentor.",
            country: "Canada",
            city: "Toronto",
            birthdate: "1990-09-22",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "trj5",
          teamRoundId,
          judge: {
            id: "judge5",
            email: "bob.johnson@example.com",
            username: "bob_johnson",
            firstName: "Bob",
            lastName: "Johnson",
            avatarUrl: "/avatars/bob-johnson.jpg",
            bio: "AI researcher and hackathon mentor.",
            country: "Canada",
            city: "Toronto",
            birthdate: "1990-09-22",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      resolve(mockTeamRoundJudges);
    }, 500);
  });
};
