import { AuditCreatedBase } from "./auditCreatedBase";
import { Task } from "./task";

export type TaskComment = {
  id: string;
  content: string;
  task?: Task;
  taskId?: string;
} & AuditCreatedBase;
