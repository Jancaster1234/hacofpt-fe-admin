// src/types/entities/teamRequest.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Hackathon } from "./hackathon";
import { User } from "./user";
import { TeamRequestMember } from "./teamRequestMember";

export type TeamRequestStatus =
  | "pending"
  | "under_review"
  | "approved"
  | "rejected"
  | "canceled";

export type TeamRequest = {
  id: string;
  hackathon?: Partial<Hackathon>;
  hackathonId?: string;
  status: TeamRequestStatus;
  confirmationDeadline: string;
  note: string;
  reviewedBy?: User;
  reviewedById?: string;
  teamRequestMembers: TeamRequestMember[];
} & AuditCreatedBase;
