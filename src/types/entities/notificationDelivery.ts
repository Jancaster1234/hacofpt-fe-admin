import { AuditBase } from "./auditBase";
import { Notification } from "./notification";

export enum NotificationMethod {
  IN_APP = "IN_APP",
  EMAIL = "EMAIL",
  PUSH = "PUSH",
  SMS = "SMS",
  WEB = "WEB",
}

export enum NotificationStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  FAILED = "FAILED",
}

export type NotificationDelivery = {
  id: string;
  notification?: Notification;
  notificationId?: string;
  method: NotificationMethod;
  status: NotificationStatus;
} & AuditBase;
