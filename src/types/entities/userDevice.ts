import { AuditCreatedBase } from "./auditCreatedBase";
import { User } from "./user";
import { Device } from "./device";

export type UserDeviceStatus = "ACTIVE" | "RETURNED" | "EXPIRED"; // Adjust to your enum

export type UserDevice = {
  id: string;
  user?: User;
  userId?: string;
  device?: Device;
  deviceId?: string;
  timeFrom: string; // ISO date
  timeTo: string; // ISO date
  status: UserDeviceStatus;
} & AuditCreatedBase;
