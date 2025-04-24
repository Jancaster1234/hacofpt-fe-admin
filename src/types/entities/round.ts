// src/types/entities/round.ts
import { AuditBase } from "./auditBase";
import { Hackathon } from "./hackathon";
import { Submission } from "./submission";
import { RoundMarkCriterion } from "./roundMarkCriterion";
import { JudgeRound } from "./judgeRound";
import { TeamRound } from "./teamRound";
import { RoundLocation } from "./roundLocation";

export type RoundStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export type Round = {
  id: string;
  hackathon?: Partial<Hackathon>;
  hackathonId?: string;
  startTime?: string;
  endTime?: string;
  roundNumber?: number; // Represents the sequential order of a round in the hackathon, starting from 1
  roundTitle?: string;
  totalTeam?: number; // Maximum number of teams that can advance from this round
  status?: RoundStatus;
  submissions?: Submission[];
  roundMarkCriteria?: RoundMarkCriterion[];
  judgeRounds?: JudgeRound[];
  teamRounds?: TeamRound[];
  roundLocations?: RoundLocation[];
} & AuditBase;
