// src/types/entities/teamRequest.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Hackathon } from "./hackathon";
import { User } from "./user";
import { TeamRequestMember } from "./teamRequestMember";

export type TeamRequestStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CANCELED";

export type TeamRequest = {
  id: string;
  hackathon?: Partial<Hackathon>;
  hackathonId?: string;
  status: TeamRequestStatus;
  confirmationDeadline: string;
  note?: string;
  reviewedBy?: User;
  reviewedById?: string;
  teamRequestMembers: TeamRequestMember[];
} & AuditCreatedBase;
