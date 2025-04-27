// src/app/[locale]/(protected)/mentor-team/_mocks/fetchMockMentorTeams.ts
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
          team: {
            id: "1",
            name: "Team Alpha",
            teamLeader: {
              id: "1",
              firstName: "Team Lead",
              lastName: "Alpha",
              email: "leader.alpha@example.com",
              username: "teamlead_alpha",
              avatarUrl: "/avatars/leader-alpha.jpg",
              bio: "Passionate about innovation.",
              country: "USA",
              city: "New York",
              birthdate: "1990-01-01",
            },
            teamMembers: [
              {
                id: "1",
                user: {
                  id: "1",
                  firstName: "Team Lead",
                  lastName: "Alpha",
                  email: "leader.alpha@example.com",
                  username: "teamlead_alpha",
                  avatarUrl: "/avatars/leader-alpha.jpg",
                  bio: "Passionate about innovation.",
                  country: "USA",
                  city: "New York",
                  birthdate: "1990-01-01",
                },
              },
              {
                id: "2",
                user: {
                  id: "user5",
                  firstName: "Alice",
                  lastName: "Anderson",
                  email: "alice@example.com",
                  username: "alice_a",
                  avatarUrl: "/avatars/alice.jpg",
                  bio: "Aspiring software engineer.",
                  country: "USA",
                  city: "San Francisco",
                  birthdate: "1995-05-15",
                },
              },
              {
                id: "3",
                user: {
                  id: "user6",
                  firstName: "Bob",
                  lastName: "Brown",
                  email: "bob@example.com",
                  username: "bob_b",
                  avatarUrl: "/avatars/bob.jpg",
                  bio: "Blockchain enthusiast.",
                  country: "Canada",
                  city: "Toronto",
                  birthdate: "1992-08-22",
                },
              },
            ],
          },
          createdByUserName: "Admin User",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "mt2",
          hackathon: { id: "hack2", title: "Hackathon Beta" },
          mentor: { id: mentorId, firstName: "Your", lastName: "Name" },
          team: {
            id: "team2",
            name: "Team Beta",
            teamLeader: {
              id: "leader2",
              firstName: "Team Lead",
              lastName: "Beta",
              email: "leader.beta@example.com",
              username: "teamlead_beta",
              avatarUrl: "/avatars/leader-beta.jpg",
              bio: "AI researcher and startup mentor.",
              country: "UK",
              city: "London",
              birthdate: "1988-11-30",
            },
            teamMembers: [
              {
                id: "4",
                user: {
                  id: "leader2",
                  firstName: "Team Lead",
                  lastName: "Beta",
                  email: "leader.beta@example.com",
                  username: "teamlead_beta",
                  avatarUrl: "/avatars/leader-beta.jpg",
                  bio: "AI researcher and startup mentor.",
                  country: "UK",
                  city: "London",
                  birthdate: "1988-11-30",
                },
              },
              {
                id: "5",
                user: {
                  id: "user7",
                  firstName: "Charlie",
                  lastName: "Clark",
                  email: "charlie@example.com",
                  username: "charlie_c",
                  avatarUrl: "/avatars/charlie.jpg",
                  bio: "Cybersecurity expert.",
                  country: "Germany",
                  city: "Berlin",
                  birthdate: "1990-04-10",
                },
              },
            ],
          },
          createdByUserName: "Reviewer Smith",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      resolve(mockMentorTeams);
    }, 500);
  });
};
