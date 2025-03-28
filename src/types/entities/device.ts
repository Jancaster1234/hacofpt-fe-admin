// src/types/entities/device.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Hackathon } from "./hackathon";
import { Round } from "./round";
import { RoundLocation } from "./roundLocation";
import { FileUrl } from "./fileUrl";

export enum DeviceStatus {
  AVAILABLE = "AVAILABLE",
  IN_USE = "IN_USE",
  DAMAGED = "DAMAGED",
  LOST = "LOST",
  RETIRED = "RETIRED",
  PENDING = "PENDING",
}

export type Device = {
  id: string;
  hackathon?: Hackathon;
  hackathonId?: string;
  round?: Round;
  roundId?: string;
  roundLocation?: RoundLocation;
  roundLocationId?: string;
  name: string;
  description?: string;
  status: DeviceStatus;
  fileUrls: FileUrl[];
} & AuditCreatedBase;
