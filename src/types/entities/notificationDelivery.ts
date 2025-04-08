// src/types/entities/notificationDelivery.ts
import { AuditBase } from "./auditBase";
import { Notification } from "./notification";
import { User } from "./user";

export type NotificationMethod = "EMAIL" | "IN_APP" | "PUSH" | "SMS" | "WEB";

export type NotificationStatus = "PENDING" | "SENT" | "FAILED";

export type NotificationDelivery = {
  id: string;
  notification?: Notification;
  notificationId?: string;
  recipient?: User;
  recipientId?: string;
  isRead: boolean;
  method: NotificationMethod;
  status: NotificationStatus;
} & AuditBase;
