// src/types/entities/notificationDelivery.ts
import { AuditBase } from "./auditBase";
import { Notification } from "./notification";

export type NotificationMethod = "EMAIL" | "IN_APP" | "PUSH" | "SMS" | "WEB";

export type NotificationStatus = "PENDING" | "SENT" | "FAILED";

export type NotificationDelivery = {
  id: string;
  notification?: Notification;
  notificationId?: string;
  method: NotificationMethod;
  status: NotificationStatus;
} & AuditBase;
