// src/types/entities/teamRound.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Team } from "./team";
import { Round } from "./round";
import { TeamRoundJudge } from "./teamRoundJudge";

export type TeamRoundStatus =
  | "Pending"
  | "AwaitingJudging"
  | "Passed"
  | "Failed"
  | "DisqualifiedDueToViolation";

export type TeamRound = {
  id: string;
  team?: Partial<Team>;
  teamId?: string;
  round?: Round;
  roundId?: string;
  status?: TeamRoundStatus;
  description?: string;
  teamRoundJudges?: TeamRoundJudge[];
} & AuditCreatedBase;
