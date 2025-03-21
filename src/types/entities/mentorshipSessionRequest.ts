import { AuditCreatedBase } from "./auditCreatedBase";
import { Hackathon } from "./hackathon";
import { User } from "./user";
import { Team } from "./team";

export enum MentorshipSessionStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  DELETED = "deleted",
  COMPLETED = "completed",
}

export type MentorshipSessionRequest = {
  id: string;
  hackathon?: Hackathon;
  hackathonId?: string;
  mentor?: User;
  mentorId?: string;
  team?: Team;
  teamId?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  status?: MentorshipSessionStatus;
  evaluatedBy?: User;
  evaluatedById?: string;
  evaluatedAt?: string;
} & AuditCreatedBase;
