import { AuditBase } from "./auditBase";
import { TeamRequest } from "./teamRequest";
import { User } from "./user";

export enum TeamRequestMemberStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NO_RESPONSE = "no_response",
}

export type TeamRequestMember = {
  id: string;
  teamRequest?: TeamRequest;
  teamRequestId?: string;
  user?: User;
  userId?: string;
  status: TeamRequestMemberStatus;
  respondedAt: string;
} & AuditBase;
