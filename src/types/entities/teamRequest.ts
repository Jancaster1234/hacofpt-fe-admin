import { AuditCreatedBase } from "./auditCreatedBase";
import { Hackathon } from "./hackathon";
import { User } from "./user";
import { TeamRequestMember } from "./teamRequestMember";
import { Status } from "./statusEnums"; // If you have a centralized enum

export type TeamRequest = {
  id: string;
  hackathon?: Hackathon;
  hackathonId?: string;
  status: Status;
  confirmationDeadline: string;
  note: string;
  reviewedBy?: User;
  reviewedById?: string;
  teamRequestMembers: TeamRequestMember[];
} & AuditCreatedBase;
