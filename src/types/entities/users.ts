// src/types/entities/users.ts
import { Team } from "./team";
import { UserHackathon } from "./userHackathon";
export type UserRole =
  | "Admin"
  | "Organizer"
  | "Judge"
  | "Mentor"
  | "TeamLeader"
  | "TeamMember";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl: string;
  bio: string;
  country: string;
  city: string;
  birthdate: string;
  phone?: string; // Optional for SMS notifications
  studentId?: string; // Applicable for FPTU students
  university?: string; // In case mentors or judges are external
  linkedinUrl?: string; // Useful for networking
  githubUrl?: string; // Relevant for developers
  skills?: string[]; // Helps with team formation & mentorship matching
  experienceLevel?: "Beginner" | "Intermediate" | "Advanced"; // Helps categorize users
  createdAt: string;
  updatedAt: string;
  // hackathons: UserHackathon[]; // Many-to-many relationship with hackathons
  // teams: Team[]; // A user can be in many teams
};
