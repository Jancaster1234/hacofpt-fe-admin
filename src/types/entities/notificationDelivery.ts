import { AuditBase } from "./auditBase";
import { Notification } from "./notification";

export type NotificationMethod = "EMAIL" | "SMS" | "IN_APP"; // Adjust to match your enum
export type NotificationStatus = "PENDING" | "SENT" | "FAILED"; // Adjust as needed

export type NotificationDelivery = {
  id: string;
  notification?: Notification;
  notificationId?: string;
  method: NotificationMethod;
  status: NotificationStatus;
} & AuditBase;
