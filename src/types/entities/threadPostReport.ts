import { AuditCreatedBase } from "./auditCreatedBase";
import { ThreadPost } from "./threadPost";
import { User } from "./user";

export type ThreadPostReportStatus = "PENDING" | "REVIEWED" | "DISMISSED"; // Adjust according to your enum

export type ThreadPostReport = {
  id: string;
  threadPost?: ThreadPost;
  threadPostId?: string;
  reason: string;
  status: ThreadPostReportStatus;
  reviewedBy?: User;
  reviewedById?: string;
} & AuditCreatedBase;
