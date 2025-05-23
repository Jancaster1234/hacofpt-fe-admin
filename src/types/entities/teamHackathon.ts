// src/types/entities/teamHackathon.ts
import { AuditBase } from "./auditBase";
import { Team } from "./team";
import { Hackathon } from "./hackathon";

export type TeamHackathonStatus = "ACTIVE" | "INACTIVE";

export type TeamHackathon = {
  id: string;
  team?: Team;
  teamId?: string;
  hackathon?: Partial<Hackathon>;
  hackathonId?: string;
  status: TeamHackathonStatus;
} & AuditBase;
