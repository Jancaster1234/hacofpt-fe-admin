// src/types/entities/submission.ts
import { JudgeFeedback } from "./judgeFeedback";
export type Submission = {
  id: string;
  teamId: string;
  roundId: string;
  files: string[]; // URLs of submitted files
  submittedBy: string; // User ID of submitter
  submittedAt: string; // Timestamp
  score?: number; // Optional, will be filled after evaluation
  judgeNotes?: JudgeFeedback[]; // New: Feedback from judges
};
