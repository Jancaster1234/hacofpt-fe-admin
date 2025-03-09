// src/types/entities/judgeFeedback.ts
export type JudgeFeedback = {
  judgeId: string;
  submissionId: string;
  criteriaId: string;
  score: number;
  note?: string;
};
