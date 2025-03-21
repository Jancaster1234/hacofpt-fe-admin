import { AuditCreatedBase } from "./auditCreatedBase";
import { Hackathon } from "./hackathon";
import { User } from "./user";
import { TeamRequestMember } from "./teamRequestMember";

export enum TeamRequestStatus {
  PENDING = "pending",
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  CANCELED = "canceled",
}

export type TeamRequest = {
  id: string;
  hackathon?: Hackathon;
  hackathonId?: string;
  status: TeamRequestStatus;
  confirmationDeadline: string;
  note: string;
  reviewedBy?: User;
  reviewedById?: string;
  teamRequestMembers: TeamRequestMember[];
} & AuditCreatedBase;
