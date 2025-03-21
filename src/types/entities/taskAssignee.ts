import { AuditBase } from "./auditBase";
import { Task } from "./task";
import { User } from "./user";

export type TaskAssignee = {
  id: string;
  task?: Task;
  taskId?: string;
  user?: User;
  userId?: string;
} & AuditBase;
