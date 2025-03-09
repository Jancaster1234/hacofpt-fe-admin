// src/types/entities/userHackathon.ts

import { User } from "./users";
import { Hackathon } from "./hackathon";

export type UserHackathon = {
  user: User;
  hackathons: {
    hackathon: Hackathon;
    role:
      | "Participant"
      | "Organizer"
      | "Mentor"
      | "Judge"
      | "TeamLeader"
      | "TeamMember"; // User's role in the hackathon
    joinedAt: string; // Timestamp of when the user joined
  }[];
};
