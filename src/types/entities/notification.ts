import { AuditBase } from "./auditBase";
import { User } from "./user";
import { NotificationDelivery } from "./notificationDelivery";

export type NotificationType = "INFO" | "REMINDER" | "ALERT"; // Adjust according to your enum

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
