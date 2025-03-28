// src/types/entities/scheduleEventAttendee.ts
import { AuditBase } from "./auditBase";
import { ScheduleEvent } from "./scheduleEvent";
import { User } from "./user";

export type ScheduleEventStatus = "INVITED" | "CONFIRMED" | "DECLINED";

export type ScheduleEventAttendee = {
  id: string;
  scheduleEvent?: ScheduleEvent;
  scheduleEventId?: string;
  user?: User;
  userId?: string;
  status: ScheduleEventStatus;
} & AuditBase;
