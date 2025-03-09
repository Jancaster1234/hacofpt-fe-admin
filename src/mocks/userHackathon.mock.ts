// src/mocks/userHackathon.mock.ts

import { UserHackathon } from "@/types/entities/userHackathon";
import { mockUsers } from "./auth.mock";
import { hackathonsMock } from "./hackathons.mock";

export const userHackathonMock: UserHackathon[] = [
  {
    user: mockUsers[0], // Alice (Admin)
    hackathons: [
      {
        hackathon: hackathonsMock[0], // Hackathon 2024
        role: "Organizer",
        joinedAt: "2024-02-15T10:00:00Z",
      },
      {
        hackathon: hackathonsMock[1], // Hackathon 2023
        role: "Judge",
        joinedAt: "2023-04-01T09:30:00Z",
      },
    ],
  },
  {
    user: mockUsers[1], // Bob (Organizer)
    hackathons: [
      {
        hackathon: hackathonsMock[0], // Hackathon 2024
        role: "Organizer",
        joinedAt: "2024-02-10T11:00:00Z",
      },
    ],
  },
  {
    user: mockUsers[2], // Charlie (Judge)
    hackathons: [
      {
        hackathon: hackathonsMock[0], // Hackathon 2024
        role: "Judge",
        joinedAt: "2024-03-01T12:00:00Z",
      },
      {
        hackathon: hackathonsMock[2], // Hackathon 2022
        role: "Judge",
        joinedAt: "2022-04-10T15:00:00Z",
      },
    ],
  },
  {
    user: mockUsers[3], // David (Mentor)
    hackathons: [
      {
        hackathon: hackathonsMock[0], // Hackathon 2024
        role: "Mentor",
        joinedAt: "2024-02-20T08:30:00Z",
      },
    ],
  },
  {
    user: mockUsers[4], // Eva (TeamLeader)
    hackathons: [
      {
        hackathon: hackathonsMock[0], // Hackathon 2024
        role: "TeamLeader",
        joinedAt: "2024-03-03T14:00:00Z",
      },
      {
        hackathon: hackathonsMock[1], // Hackathon 2023
        role: "TeamLeader",
        joinedAt: "2023-04-02T13:00:00Z",
      },
    ],
  },
  {
    user: mockUsers[5], // Frank (TeamMember)
    hackathons: [
      {
        hackathon: hackathonsMock[0], // Hackathon 2024
        role: "TeamMember",
        joinedAt: "2024-03-05T16:00:00Z",
      },
      {
        hackathon: hackathonsMock[1], // Hackathon 2023
        role: "TeamMember",
        joinedAt: "2023-04-03T17:00:00Z",
      },
    ],
  },
];

export function getMockUserHackathons(userId: string): UserHackathon | null {
  return userHackathonMock.find((uh) => uh.user.id === userId) || null;
}
