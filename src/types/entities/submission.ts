import { AuditCreatedBase } from "./auditCreatedBase";
import { Round } from "./round";
import { FileUrl } from "./fileUrl";
import { JudgeSubmission } from "./judgeSubmission";

export type SubmissionStatus = "DRAFT" | "SUBMITTED" | "REVIEWED"; // adjust to your actual enum values

export type Submission = {
  id: string;
  round?: Round;
  roundId?: string;
  fileUrls: FileUrl[];
  judgeSubmissions: JudgeSubmission[];
  status: SubmissionStatus;
  submittedAt: string;
  finalScore?: number;
} & AuditCreatedBase;
