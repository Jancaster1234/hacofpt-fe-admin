// src/types/entities/userTeam.ts
import { AuditBase } from "./auditBase";
import { User } from "./user";
import { Team } from "./team";

export type UserTeam = {
  id: string;
  user?: Partial<User>;
  userId?: string;
  team?: Team;
  teamId?: string;
} & AuditBase;
