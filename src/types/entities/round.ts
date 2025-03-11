// src/types/entities/round.ts
import { RoundMarkCriteria } from "./markCriteria";
import { Submission } from "./submission";

export type Round = {
  id: string;
  hackathonId: string; // A round belongs to one hackathon
  roundNumber: number;
  markCriteria: RoundMarkCriteria[]; // A round has many mark criteria
  submissions?: Submission[]; // A round has many submissions
};
