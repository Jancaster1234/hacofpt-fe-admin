// src/types/entities/roundLocation.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Round } from "./round";
import { Location } from "./location";

export type RoundLocationType = "ONLINE" | "OFFLINE" | "HYBRID";

export type RoundLocation = {
  id: string;
  round?: Round;
  roundId?: string;
  location?: Location;
  locationId?: string;
  type: RoundLocationType;
} & AuditCreatedBase;
