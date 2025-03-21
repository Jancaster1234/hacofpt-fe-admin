import { AuditCreatedBase } from "./auditCreatedBase";
import { Round } from "./round";
import { JudgeSubmissionDetail } from "./judgeSubmissionDetail";

export type RoundMarkCriterion = {
  id: string;
  round?: Round;
  roundId?: string;
  name: string;
  maxScore: number;
  note: string;
  judgeSubmissionDetails: JudgeSubmissionDetail[];
} & AuditCreatedBase;
