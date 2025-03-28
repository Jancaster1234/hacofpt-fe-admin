// src/types/entities/userDeviceTrack.ts
import { AuditBase } from "./auditBase";
import { UserDevice } from "./userDevice";
import { FileUrl } from "./fileUrl";

export type DeviceQualityStatus =
  | "EXCELLENT"
  | "GOOD"
  | "FAIR"
  | "DAMAGED"
  | "NEEDS_REPAIR"
  | "REPAIRING"
  | "REPAIRED"
  | "LOST";

export type UserDeviceTrack = {
  id: string;
  userDevice?: UserDevice;
  userDeviceId?: string;
  deviceQualityStatus: DeviceQualityStatus;
  note?: string;
  fileUrls: FileUrl[];
} & AuditBase;
