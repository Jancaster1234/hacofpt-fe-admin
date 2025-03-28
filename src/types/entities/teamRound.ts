// src/types/entities/teamRound.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Team } from "./team";
import { Round } from "./round";

export type TeamRoundStatus =
  | "Pending"
  | "Passed"
  | "Failed"
  | "DisqualifiedDueToViolation";

export type TeamRound = {
  id: string;
  team?: Team;
  teamId?: string;
  round?: Round;
  roundId?: string;
  status: TeamRoundStatus;
  description: string;
} & AuditCreatedBase;
