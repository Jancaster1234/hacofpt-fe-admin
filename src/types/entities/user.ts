// src/types/entities/users.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { UserHackathon } from "./userHackathon";
import { UserTeam } from "./userTeam";
import { Hackathon } from "./hackathon";
import { MentorshipRequest } from "./mentorshipRequest";
import { MentorshipSessionRequest } from "./mentorshipSessionRequest";
import { JudgeRound } from "./judgeRound";
import { JudgeSubmission } from "./judgeSubmission";
import { TeamRequest } from "./teamRequest";
import { IndividualRegistrationRequest } from "./individualRegistrationRequest";
import { ConversationUser } from "./conversationUser";
import { Message } from "./message";
import { Board } from "./board";
import { BoardList } from "./boardList";
import { BoardUser } from "./boardUser";
import { Task } from "./task";
import { TaskAssignee } from "./taskAssignee";
import { TaskComment } from "./taskComment";
import { Schedule } from "./schedule";
import { ScheduleEvent } from "./scheduleEvent";
import { ScheduleEventAttendee } from "./scheduleEventAttendee";
import { UserDevice } from "./userDevice";
import { BlogPost } from "./blogPost";
import { Sponsorship } from "./sponsorship";
import { ThreadPostReport } from "./threadPostReport";
import { Feedback } from "./feedback";
import { Notification } from "./notification";
import { Team } from "./team";

export type UserRole =
  | "Admin"
  | "Organizer"
  | "Judge"
  | "Mentor"
  | "TeamLeader"
  | "TeamMember";

export type UserStatus =
  | "Active"
  | "Inactive"
  | "Banned"
  | "Pending"
  | "Archived";

export type User = {
  id: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
  country?: string;
  city?: string;
  birthdate?: string;
  phone?: string; // Optional for SMS notifications
  studentId?: string; // Applicable for FPTU students
  university?: string; // In case mentors or judges are external
  linkedinUrl?: string; // Useful for networking
  githubUrl?: string; // Relevant for developers
  skills?: string[]; // Helps with team formation & mentorship matching
  experienceLevel?: "Beginner" | "Intermediate" | "Advanced"; // Helps categorize users
  status?: UserStatus;
  createdUsers: User[];
  userRoles: UserRole[];
  userHackathons: UserHackathon[];
  userTeams: UserTeam[];
  organizedHackathons: Hackathon[];
  leadTeams: Team[];
  createdMentorshipRequests: MentorshipRequest[];
  mentorshipRequestsAsMentor: MentorshipRequest[];
  evaluatedMentorshipRequests: MentorshipRequest[];
  createdMentorshipSessionRequests: MentorshipSessionRequest[];
  mentorshipSessionRequestsAsMentor: MentorshipSessionRequest[];
  evaluatedMentorshipSessionRequests: MentorshipSessionRequest[];
  judgeRounds: JudgeRound[];
  judgeSubmissions: JudgeSubmission[];
  teamRequests: TeamRequest[];
  individualRegistrationRequests: IndividualRegistrationRequest[];
  conversationUsers: ConversationUser[];
  sentMessages: Message[];
  boards: Board[];
  boardLists: BoardList[];
  boardUsers: BoardUser[];
  tasks: Task[];
  taskAssignees: TaskAssignee[];
  taskComments: TaskComment[];
  schedules: Schedule[];
  scheduleEvents: ScheduleEvent[];
  scheduleEventAttendees: ScheduleEventAttendee[];
  userDevices: UserDevice[];
  blogPosts: BlogPost[];
  reviewedBlogPosts: BlogPost[];
  sponsorships: Sponsorship[];
  reportedThreadPosts: ThreadPostReport[];
  reviewedThreadReports: ThreadPostReport[];
  receivedFeedbacks: Feedback[];
  createdFeedbacks: Feedback[];
  receivedNotifications: Notification[];
} & AuditCreatedBase;
