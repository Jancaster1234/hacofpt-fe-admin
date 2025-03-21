import { AuditCreatedBase } from "./auditCreatedBase";
import { Schedule } from "./schedule";
import { ScheduleEventAttendee } from "./scheduleEventAttendee";
import { ScheduleEventReminder } from "./scheduleEventReminder";

export type ScheduleEvent = {
  id: string;
  schedule?: Schedule;
  scheduleId?: string;
  name: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurrenceRule: string;
  attendees?: ScheduleEventAttendee[];
  reminders?: ScheduleEventReminder[];
} & AuditCreatedBase;
