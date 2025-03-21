import { AuditBase } from "./auditBase";
import { Board } from "./board";
import { User } from "./user";

export type BoardUserRole = "ADMIN" | "MEMBER";

export type BoardUser = {
  id: string;
  board?: Board;
  boardId?: string;
  user?: User;
  userId?: string;
  role: BoardUserRole;
  isDeleted: boolean;
  deletedBy?: User;
  deletedById?: string;
} & AuditBase;
