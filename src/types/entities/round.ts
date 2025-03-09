// src/types/entities/round.ts
import { RoundMarkCriteria } from "./markCriteria";

export type Round = {
  id: string;
  hackathonId: string;
  roundNumber: number;
  markCriteria: RoundMarkCriteria[];
};
