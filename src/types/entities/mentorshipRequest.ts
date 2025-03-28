// src/types/entities/mentorshipRequest.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Hackathon } from "./hackathon";
import { User } from "./user";
import { Team } from "./team";

export type MentorshipStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "DELETED"
  | "COMPLETED";

export type MentorshipRequest = {
  id: string;
  hackathon?: Partial<Hackathon>;
  hackathonId?: string;
  mentor?: Partial<User>;
  mentorId?: string;
  team?: Partial<Team>;
  teamId?: string;
  status?: MentorshipStatus;
  evaluatedAt?: string;
  evaluatedBy?: Partial<User>;
  evaluatedById?: string;
} & AuditCreatedBase;
