// src/types/entities/scheduleEvent.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Schedule } from "./schedule";
import { FileUrl } from "./fileUrl";
import { ScheduleEventAttendee } from "./scheduleEventAttendee";
import { ScheduleEventReminder } from "./scheduleEventReminder";

export type ScheduleEventLabel = "danger" | "success" | "primary" | "warning";

export type ScheduleEvent = {
  id: string;
  schedule?: Schedule;
  scheduleId?: string;
  name: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  eventLabel: ScheduleEventLabel;
  isRecurring: boolean;
  recurrenceRule: string;
  fileUrls: FileUrl[];
  attendees?: ScheduleEventAttendee[];
  reminders?: ScheduleEventReminder[];
} & AuditCreatedBase;
