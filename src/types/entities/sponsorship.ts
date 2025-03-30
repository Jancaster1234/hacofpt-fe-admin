// src/types/entities/sponsorship.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { SponsorshipHackathon } from "./sponsorshipHackathon";

export type SponsorshipStatus =
  | "PENDING"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED"; // adjust to your actual enum values

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
