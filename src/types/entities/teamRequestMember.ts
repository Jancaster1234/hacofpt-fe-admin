import { AuditBase } from "./auditBase";
import { TeamRequest } from "./teamRequest";
import { User } from "./user";
import { Status } from "./statusEnums";

export type TeamRequestMember = {
  id: string;
  teamRequest?: TeamRequest;
  teamRequestId?: string;
  user?: User;
  userId?: string;
  status: Status;
  respondedAt: string;
} & AuditBase;
