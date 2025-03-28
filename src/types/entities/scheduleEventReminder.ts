// src/types/entities/scheduleEventReminder.ts
import { AuditBase } from "./auditBase";
import { ScheduleEvent } from "./scheduleEvent";
import { User } from "./user";

export type ScheduleEventReminder = {
  id: string;
  scheduleEvent?: ScheduleEvent;
  scheduleEventId?: string;
  user?: User;
  userId?: string;
  remindAt: string;
} & AuditBase;
