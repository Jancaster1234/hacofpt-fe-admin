import { AuditCreatedBase } from "./auditCreatedBase";
import { Round } from "./round";
import { Location } from "./location";

export enum RoundLocationType {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  HYBRID = "HYBRID",
}

export type RoundLocation = {
  id: string;
  round?: Round;
  roundId?: string;
  location?: Location;
  locationId?: string;
  type: RoundLocationType;
} & AuditCreatedBase;
