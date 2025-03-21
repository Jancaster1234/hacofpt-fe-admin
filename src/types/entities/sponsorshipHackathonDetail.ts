import { AuditBase } from "./auditBase";
import { SponsorshipHackathon } from "./sponsorshipHackathon";
import { FileUrl } from "./fileUrl";

export enum SponsorshipDetailStatus {
  PLANNED = "PLANNED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

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
