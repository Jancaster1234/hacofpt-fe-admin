import { AuditBase } from "./auditBase";
import { ScheduleEvent } from "./scheduleEvent";
import { User } from "./user";

export type ScheduleEventStatus = "PENDING" | "CONFIRMED" | "DECLINED"; // Adjust according to your enum

export type ScheduleEventAttendee = {
  id: string;
  scheduleEvent?: ScheduleEvent;
  scheduleEventId?: string;
  user?: User;
  userId?: string;
  statusD: ScheduleEventStatus;
} & AuditBase;
