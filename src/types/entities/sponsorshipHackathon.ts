// src/types/entities/sponsorshipHackathon.ts
import { AuditBase } from "./auditBase";
import { Hackathon } from "./hackathon";
import { Sponsorship } from "./sponsorship";
import { SponsorshipHackathonDetail } from "./sponsorshipHackathonDetail";

export type SponsorshipHackathon = {
  id: string;
  hackathon?: Hackathon;
  hackathonId?: string;
  sponsorship?: Sponsorship;
  sponsorshipId?: string;
  totalMoney: number;
  sponsorshipHackathonDetails: SponsorshipHackathonDetail[];
} & AuditBase;
