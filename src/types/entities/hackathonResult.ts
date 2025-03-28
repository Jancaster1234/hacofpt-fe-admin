// src/types/entities/hackathonResult.ts
import { AuditBase } from "./auditBase";
import { Hackathon } from "./hackathon";
import { Team } from "./team";

export type HackathonResult = {
  id: string;
  hackathon?: Partial<Hackathon>;
  hackathonId?: string;
  team?: Partial<Team>;
  teamId?: string;
  totalScore: number;
  placement: number;
  award?: string;
} & AuditBase;
