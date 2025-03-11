// src/types/entities/markCriteria.ts
export type RoundMarkCriteria = {
  id: string;
  roundId: string;
  criterionName: string;
  maxScore: number;
  note?: string;
};
