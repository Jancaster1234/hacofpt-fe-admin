// src/types/entities/mentorTeamLimit.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { User } from "./user";
import { Hackathon } from "./hackathon";
import { Team } from "./team";

export type MentorTeamLimit = {
  id: string;
  hackathon?: Hackathon;
  hackathonId?: string;
  mentor?: User;
  mentorId?: string;
  team?: Team;
  teamId?: string;
  maxTeams?: number; // Max teams the mentor can mentor in this hackathon
  maxMentors?: number; // Max mentors a team can have in this hackathon
  updatedBy?: User;
  updatedById?: string;
} & AuditCreatedBase;
