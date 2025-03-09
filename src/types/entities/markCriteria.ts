// src/types/entities/markCriteria.ts
export type RoundMarkCriteria = {
  id: string;
  roundId: string;
  criteria: string;
  maxScore: number;
  note?: string;
};
