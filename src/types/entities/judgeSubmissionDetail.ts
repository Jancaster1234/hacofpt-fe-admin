// src/types/entities/judgeSubmissionDetail.ts
import { AuditBase } from "./auditBase";
import { JudgeSubmission } from "./judgeSubmission";
import { RoundMarkCriterion } from "./roundMarkCriterion";

export type JudgeSubmissionDetail = {
  id: string;
  judgeSubmission?: JudgeSubmission;
  judgeSubmissionId?: string;
  roundMarkCriterion?: RoundMarkCriterion;
  roundMarkCriterionId?: string;
  score: number;
  note?: string;
} & AuditBase;
