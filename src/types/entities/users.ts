// src/types/entities/users.ts
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
  firstName?: string;
  lastName?: string;
  role?: UserRole;
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
  createdAt?: string;
  updatedAt?: string;
  createdById?: string; // Tracks who created this user (admin, system, etc.)
};
