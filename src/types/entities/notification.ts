// src/types/entities/notification.ts
import { AuditBase } from "./auditBase";
import { User } from "./user";
import { NotificationDelivery } from "./notificationDelivery";

export enum NotificationType {
  MESSAGE = "MESSAGE",
  MENTOR_REQUEST = "MENTOR_REQUEST",
  TEAM_INVITE = "TEAM_INVITE",
  HACKATHON_UPDATE = "HACKATHON_UPDATE",
  TASK_UPDATE = "TASK_UPDATE",
  GENERAL = "GENERAL",
}

export type Notification = {
  id: string;
  sender?: User;
  senderId?: string;
  recipient?: User;
  recipientId?: string;
  type: NotificationType;
  content: string;
  metadata: string;
  isRead: boolean;
  notificationDeliveries: NotificationDelivery[];
} & AuditBase;
