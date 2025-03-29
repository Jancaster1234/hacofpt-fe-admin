// src/types/entities/notification.ts
import { AuditBase } from "./auditBase";
import { User } from "./user";
import { NotificationDelivery } from "./notificationDelivery";

export type NotificationType =
  | "MESSAGE"
  | "MENTOR_REQUEST"
  | "TEAM_INVITE"
  | "HACKATHON_UPDATE"
  | "TASK_UPDATE"
  | "GENERAL";

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
