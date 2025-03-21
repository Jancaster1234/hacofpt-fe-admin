import { AuditCreatedBase } from "./auditCreatedBase";
import { Round } from "./round";
import { Location } from "./location";

export type RoundLocationType = "VENUE" | "ONLINE" | "HYBRID"; // Example — adjust based on your enum definition

export type RoundLocation = {
  id: string;
  round?: Round;
  roundId?: string;
  location?: Location;
  locationId?: string;
  type: RoundLocationType;
} & AuditCreatedBase;
