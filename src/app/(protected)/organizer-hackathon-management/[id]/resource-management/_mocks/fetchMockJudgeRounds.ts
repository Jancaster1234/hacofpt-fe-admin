// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockJudgeRounds.ts

import { JudgeRound } from "@/types/entities/judgeRound";

export const fetchMockJudgeRounds = (
  roundId: string
): Promise<JudgeRound[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      const mockJudgeRounds: JudgeRound[] = [
        {
          id: `judgeRound1-${roundId}`,
          judge: {
            id: "judge1",
            email: "alice.johnson@example.com",
            username: "alice_j",
            firstName: "Alice",
            lastName: "Johnson",
            avatarUrl: "/avatars/alice-johnson.jpg",
            bio: "Experienced AI researcher and hackathon judge.",
            country: "USA",
            city: "San Francisco",
            birthdate: "1985-06-15",
          },
          judgeId: "judge1",
          roundId,
          isDeleted: false,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: `judgeRound2-${roundId}`,
          judge: {
            id: "judge2",
            email: "bob.smith@example.com",
            username: "bob_s",
            firstName: "Bob",
            lastName: "Smith",
            avatarUrl: "/avatars/bob-smith.jpg",
            bio: "Software engineer with a passion for mentoring.",
            country: "Canada",
            city: "Toronto",
            birthdate: "1990-09-22",
          },
          judgeId: "judge2",
          roundId,
          isDeleted: false,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: `judgeRound3-${roundId}`,
          judge: {
            id: "judge3",
            email: "carol.zhang@example.com",
            username: "carol_z",
            firstName: "Carol",
            lastName: "Zhang",
            avatarUrl: "",
            bio: "UX designer and product strategist.",
            country: "Singapore",
            city: "Singapore",
            birthdate: "1988-03-12",
          },
          judgeId: "judge3",
          roundId,
          isDeleted: false,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        },
      ];
      resolve(mockJudgeRounds);
    }, 500);
  });
};
