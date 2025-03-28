// src/types/entities/schedule.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Team } from "./team";
import { Hackathon } from "./hackathon";
import { ScheduleEvent } from "./scheduleEvent";

export type Schedule = {
  id: string;
  team?: Partial<Team>;
  teamId?: string;
  hackathon?: Partial<Hackathon>;
  hackathonId?: string;
  name: string;
  description: string;
  scheduleEvents: ScheduleEvent[];
} & AuditCreatedBase;
