// src/types/entities/notificationPreference.ts
import { AuditBase } from "./auditBase";
import { User } from "./user";
import { NotificationType } from "./notification";

export type NotificationPreference = {
  id: string;
  user?: User;
  userId?: string;
  type: NotificationType;
  isEnabled: boolean;
} & AuditBase;
