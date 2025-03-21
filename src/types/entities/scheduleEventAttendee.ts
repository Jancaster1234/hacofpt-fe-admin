import { AuditBase } from "./auditBase";
import { ScheduleEvent } from "./scheduleEvent";
import { User } from "./user";

export enum ScheduleEventStatus {
  INVITED = "INVITED",
  CONFIRMED = "CONFIRMED",
  DECLINED = "DECLINED",
}

export type ScheduleEventAttendee = {
  id: string;
  scheduleEvent?: ScheduleEvent;
  scheduleEventId?: string;
  user?: User;
  userId?: string;
  statusD: ScheduleEventStatus;
} & AuditBase;
