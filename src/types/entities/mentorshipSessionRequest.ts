// src/types/entities/mentorshipSessionRequest.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { MentorTeam } from "./mentorTeam";
import { User } from "./user";

export type MentorshipSessionStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "DELETED"
  | "COMPLETED";

export type MentorshipSessionRequest = {
  id: string;
  mentorTeam?: Partial<MentorTeam>;
  mentorTeamId?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  status?: MentorshipSessionStatus;
  evaluatedBy?: Partial<User>;
  evaluatedById?: string;
  evaluatedAt?: string;
} & AuditCreatedBase;
