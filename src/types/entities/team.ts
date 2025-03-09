// src/types/entities/team.ts
import { User } from "./users";

export type Team = {
  id: string;
  hackathonId: string;
  name: string;
  members: User[];
  leaderId: string;
};
