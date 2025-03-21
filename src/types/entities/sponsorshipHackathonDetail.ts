import { AuditBase } from "./auditBase";
import { SponsorshipHackathon } from "./sponsorshipHackathon";

export type SponsorshipDetailStatus = "PLANNED" | "COMPLETED" | "CANCELLED"; // Adjust based on your enum

export type SponsorshipHackathonDetail = {
  id: string;
  sponsorshipHackathon?: SponsorshipHackathon;
  sponsorshipHackathonId?: string;
  moneySpent: number;
  content: string;
  status: SponsorshipDetailStatus;
  timeFrom: string;
  timeTo: string;
} & AuditBase;
