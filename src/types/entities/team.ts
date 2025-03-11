// src/types/entities/team.ts
import { User } from "./users";
import { Submission } from "./submission";

export type Team = {
  id: string;
  name: string;
  hackathonId: string; // A team belongs to one hackathon
  members: User[]; // A team has many members
  leaderId: string; // A specific member who is the leader
  submissions?: Submission[]; // A team has many submissions
};
