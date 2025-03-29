// src/types/entities/role.ts

import { AuditUserBase } from "./auditUserBase";
import { UserRole } from "./userRole";
import { RolePermission } from "./rolePermission";

export type Role = {
  id: string;
  name?: string;
  description?: string;
  userRoles?: Partial<UserRole>[];
  rolePermissions?: Partial<RolePermission>[];
} & AuditUserBase;

/**
 * Predefined System Roles:
 * - ID: 1 → Name: ORGANIZER  → Manages hackathons and events
 * - ID: 2 → Name: JUDGE      → Evaluates submissions
 * - ID: 3 → Name: ADMIN      → Has full system access
 * - ID: 5 → Name: MENTOR     → Provides guidance to participants
 * - ID: 6 → Name: TEAM_MEMBER → Participates in teams
 */
