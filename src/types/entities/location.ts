import { AuditCreatedBase } from "./auditCreatedBase";
import { RoundLocation } from "./roundLocation";

export type Location = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  roundLocations: RoundLocation[];
} & AuditCreatedBase;
