// src/types/entities/teamRound.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Team } from "./team";
import { Round } from "./round";
import { TeamRoundJudge } from "./teamRoundJudge";

export type TeamRoundStatus =
  | "PENDING"
  | "AWAITING_JUDGING"
  | "PASSED"
  | "FAILED"
  | "DISQUALIFIED_DUE_TO_VIOLATION";

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
