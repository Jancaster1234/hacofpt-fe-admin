// src/types/entities/teamRequestMember.ts
import { AuditBase } from "./auditBase";
import { TeamRequest } from "./teamRequest";
import { User } from "./user";

export type TeamRequestMemberStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "NO_RESPONSE";

export type TeamRequestMember = {
  id: string;
  teamRequest?: TeamRequest;
  teamRequestId?: string;
  user?: Partial<User>;
  userId?: string;
  status: TeamRequestMemberStatus;
  respondedAt: string;
} & AuditBase;
