// src/types/entities/feedback.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Hackathon } from "./hackathon";
import { User } from "./user";
import { Team } from "./team";
import { FeedbackDetail } from "./feedbackDetail";

export type Feedback = {
  id: string;
  hackathon?: Hackathon;
  hackathonId?: string;
  mentor?: User;
  mentorId?: string;
  team?: Team;
  teamId?: string;
  feedbackDetails?: FeedbackDetail[];
} & AuditCreatedBase;
