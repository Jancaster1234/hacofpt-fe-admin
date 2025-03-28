// src/types/entities/hackathon.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Round } from "./round";
import { TeamHackathon } from "./teamHackathon";
import { HackathonResult } from "./hackathonResult";
import { UserHackathon } from "./userHackathon";
import { TeamRequest } from "./teamRequest";
import { IndividualRegistrationRequest } from "./individualRegistrationRequest";
import { MentorshipRequest } from "./mentorshipRequest";
import { MentorshipSessionRequest } from "./mentorshipSessionRequest";
import { SponsorshipHackathon } from "./sponsorshipHackathon";
import { Device } from "./device";
import { Feedback } from "./feedback";
import { MentorTeam } from "./mentorTeam";
import { MentorTeamLimit } from "./mentorTeamLimit";
import { Schedule } from "./schedule";

export type HackathonStatus = "DRAFT" | "OPEN" | "ONGOING" | "CLOSED"; // Update this enum based on your actual Status enum if different

export type Hackathon = {
  id: string;
  title: string;
  subtitle: string;
  bannerImageUrl: string;
  enrollStartDate: string;
  enrollEndDate: string;
  enrollmentCount: number;
  startDate: string;
  endDate: string;
  information: string;
  description: string;
  documentation: string[]; // document public URLs
  contact: string;
  category: string; // New: Used for category filtering
  organization: string; // New: Used for organization filtering
  enrollmentStatus: string;
  status: HackathonStatus;
  minimumTeamMembers: number;
  maximumTeamMembers: number;
  rounds: Round[];
  teamHackathons: TeamHackathon[];
  hackathonResults: HackathonResult[];
  userHackathons: UserHackathon[];
  teamRequests: TeamRequest[];
  individualRegistrationRequests: IndividualRegistrationRequest[];
  mentorshipRequests: MentorshipRequest[];
  mentorshipSessionRequests: MentorshipSessionRequest[];
  sponsorshipHackathons: SponsorshipHackathon[];
  schedules: Schedule[];
  devices: Device[];
  feedbacks: Feedback[];
  mentorTeams: MentorTeam[];
  mentorTeamLimits: MentorTeamLimit[];
} & AuditCreatedBase;
