// src/types/entities/feedbackDetail.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Feedback } from "./feedback";

export type FeedbackDetail = {
  id: string;
  feedback?: Feedback;
  feedbackId?: string;
  content: string;
  maxRating: number;
  rate?: number;
  note?: string;
} & AuditCreatedBase;
