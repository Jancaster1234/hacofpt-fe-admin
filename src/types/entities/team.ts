// src/types/entities/team.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { User } from "./user";
import { UserTeam } from "./userTeam";
import { MentorshipSessionRequest } from "./mentorshipSessionRequest";
import { TeamHackathon } from "./teamHackathon";
import { TeamRound } from "./teamRound";
import { HackathonResult } from "./hackathonResult";
import { MentorshipRequest } from "./mentorshipRequest";
import { Feedback } from "./feedback";
import { MentorTeam } from "./mentorTeam";
import { MentorTeamLimit } from "./mentorTeamLimit";
import { Submission } from "./submission";

export type Team = {
  id: string;
  name: string;
  teamLeader?: Partial<User>;
  teamLeaderId?: string;
  teamMembers?: UserTeam[];
  bio?: string;
  isDeleted: boolean;
  deletedBy?: User;
  deletedById?: string;
  teamHackathons?: TeamHackathon[];
  mentorshipSessionRequests?: MentorshipSessionRequest[];
  teamRounds?: TeamRound[];
  hackathonResults?: HackathonResult[];
  mentorshipRequests?: MentorshipRequest[];
  feedbacks?: Feedback[];
  mentorTeams?: MentorTeam[];
  mentorTeamLimits?: MentorTeamLimit[];
  submissions?: Submission[];
} & AuditCreatedBase;
