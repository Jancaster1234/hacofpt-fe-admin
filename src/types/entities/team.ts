// src/types/entities/team.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { User } from "./user";
import { Hackathon } from "./hackathon";
import { UserTeam } from "./userTeam";
import { MentorshipSessionRequest } from "./mentorshipSessionRequest";
import { TeamHackathon } from "./teamHackathon";
import { TeamRound } from "./teamRound";
import { HackathonResult } from "./hackathonResult";
import { MentorshipRequest } from "./mentorshipRequest";
import { Feedback } from "./feedback";
import { MentorTeam } from "./mentorTeam";
import { MentorTeamLimit } from "./mentorTeamLimit";

export type Team = {
  id: string;
  name: string;
  teamLeader?: Partial<User>;
  teamLeaderId?: string;
  teamMembers?: UserTeam[];
  mentorshipSessionRequests?: MentorshipSessionRequest[];
  teamHackathons?: TeamHackathon[];
  teamRounds?: TeamRound[];
  hackathonResults?: HackathonResult[];
  mentorshipRequests?: MentorshipRequest[];
  feedbacks?: Feedback[];
  bio?: string;
  isDeleted: boolean;
  deletedBy?: User;
  deletedById?: string;
  mentorTeams?: MentorTeam[];
  mentorTeamLimits?: MentorTeamLimit[];
} & AuditCreatedBase;
