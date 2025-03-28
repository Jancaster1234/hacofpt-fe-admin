// src/types/entities/teamRequestMember.ts
import { AuditBase } from "./auditBase";
import { TeamRequest } from "./teamRequest";
import { User } from "./user";

export type TeamRequestMemberStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "no_response";

export type TeamRequestMember = {
  id: string;
  teamRequest?: TeamRequest;
  teamRequestId?: string;
  user?: Partial<User>;
  userId?: string;
  status: TeamRequestMemberStatus;
  respondedAt: string;
} & AuditBase;
