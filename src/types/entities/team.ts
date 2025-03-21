import { User } from "./user";
import { Hackathon } from "./hackathon";
import { UserTeam } from "./userTeam";
import { MentorshipSessionRequest } from "./mentorshipSessionRequest";
import { TeamHackathon } from "./teamHackathon";
import { TeamRound } from "./teamRound";
import { HackathonResult } from "./hackathonResult";
import { MentorshipRequest } from "./mentorshipRequest";
import { Feedback } from "./feedback";

export type Team = {
  id: string;
  name: string;
  hackathon?: Hackathon;
  hackathonId?: string;
  teamLeader?: User;
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
  // Audit fields inherited from AuditCreatedBase
  createdAt?: string;
  createdBy?: User;
  createdById?: string;
  updatedAt?: string;
};
