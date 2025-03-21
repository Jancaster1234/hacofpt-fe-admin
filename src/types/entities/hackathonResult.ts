import { AuditBase } from "./auditBase";
import { Hackathon } from "./hackathon";
import { Team } from "./team";

export type HackathonResult = {
  id: string;
  hackathon?: Hackathon;
  hackathonId?: string;
  team?: Team;
  teamId?: string;
  totalScore: number;
  placement: number;
  award?: string;
} & AuditBase;
