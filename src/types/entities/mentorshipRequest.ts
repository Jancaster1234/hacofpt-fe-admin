import { AuditCreatedBase } from "./auditCreatedBase";
import { Hackathon } from "./hackathon";
import { User } from "./user";
import { Team } from "./team";

export type MentorshipStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Completed";

export type MentorshipRequest = {
  id: string;
  hackathon?: Hackathon;
  hackathonId?: string;
  mentor?: User;
  mentorId?: string;
  team?: Team;
  teamId?: string;
  status?: MentorshipStatus;
  evaluatedAt?: string;
  evaluatedBy?: User;
  evaluatedById?: string;
} & AuditCreatedBase;
