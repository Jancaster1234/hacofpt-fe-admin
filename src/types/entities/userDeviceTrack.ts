import { AuditBase } from "./auditBase";
import { UserDevice } from "./userDevice";

export type DeviceQualityStatus =
  | "EXCELLENT"
  | "GOOD"
  | "DAMAGED"
  | "NEEDS_REPAIR"; // Adjust to your enum

export type UserDeviceTrack = {
  id: string;
  userDevice?: UserDevice;
  userDeviceId?: string;
  deviceQualityStatus: DeviceQualityStatus;
  note?: string;
} & AuditBase;
