// src/types/entities/judgeSubmission.ts
import { AuditBase } from "./auditBase";
import { User } from "./user";
import { Submission } from "./submission";
import { JudgeSubmissionDetail } from "./judgeSubmissionDetail";

export type JudgeSubmission = {
  id: string;
  judge?: User;
  judgeId?: string;
  submission?: Submission;
  submissionId?: string;
  score?: number;
  note?: string;
  judgeSubmissionDetails: JudgeSubmissionDetail[];
} & AuditBase;
