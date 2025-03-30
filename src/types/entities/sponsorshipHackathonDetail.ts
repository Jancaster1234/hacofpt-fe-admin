// src/types/entities/sponsorshipHackathonDetail.ts
import { AuditBase } from "./auditBase";
import { SponsorshipHackathon } from "./sponsorshipHackathon";
import { FileUrl } from "./fileUrl";

export type SponsorshipDetailStatus = "PLANNED" | "COMPLETED" | "CANCELLED";

export type SponsorshipHackathonDetail = {
  id: string;
  sponsorshipHackathon?: SponsorshipHackathon;
  sponsorshipHackathonId?: string;
  moneySpent: number;
  content: string;
  status: SponsorshipDetailStatus;
  timeFrom: string;
  timeTo: string;
  fileUrls: FileUrl[];
} & AuditBase;
