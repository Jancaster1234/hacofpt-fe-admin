import { AuditCreatedBase } from "./auditCreatedBase";
import { Team } from "./team";
import { ScheduleEvent } from "./scheduleEvent";

export type Schedule = {
  id: string;
  team?: Team;
  teamId?: string;
  name: string;
  description: string;
  scheduleEvents: ScheduleEvent[];
} & AuditCreatedBase;
