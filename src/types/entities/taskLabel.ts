import { AuditBase } from "./auditBase";
import { Task } from "./task";
import { BoardLabel } from "./boardLabel";

export type TaskLabel = {
  id: string;
  task?: Task;
  taskId?: string;
  boardLabel?: BoardLabel;
  boardLabelId?: string;
} & AuditBase;
