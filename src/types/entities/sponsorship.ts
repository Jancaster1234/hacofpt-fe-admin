import { AuditCreatedBase } from "./auditCreatedBase";
import { SponsorshipHackathon } from "./sponsorshipHackathon";

export enum SponsorshipStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export type Sponsorship = {
  id: string;
  name: string;
  brand: string;
  content: string;
  money: number;
  timeFrom: string;
  timeTo: string;
  status: SponsorshipStatus;
  sponsorshipHackathons: SponsorshipHackathon[];
} & AuditCreatedBase;
