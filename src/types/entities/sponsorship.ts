import { AuditCreatedBase } from "./auditCreatedBase";
import { SponsorshipHackathon } from "./sponsorshipHackathon";

export type SponsorshipStatus = "PENDING" | "APPROVED" | "REJECTED"; // Adjust based on your enum

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
