import { AuditBase } from "./auditBase";
import { UserDevice } from "./userDevice";
import { FileUrl } from "./fileUrl";

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
  fileUrls: FileUrl[];
} & AuditBase;
