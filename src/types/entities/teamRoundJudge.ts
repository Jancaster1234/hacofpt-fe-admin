// src/types/entities/teamRoundJudge.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { TeamRound } from "./teamRound";
import { User } from "./user";

export type TeamRoundJudge = {
  id: string;
  teamRoundId?: string;
  teamRound?: TeamRound; // Optional: Reference to the associated team round
  judgeId?: string;
  judge?: Partial<User>; // Optional: Reference to the judge user
} & AuditCreatedBase;
