import { AuditCreatedBase } from "./auditCreatedBase";
import { BoardList } from "./boardList";
import { TaskAssignee } from "./taskAssignee";
import { TaskComment } from "./taskComment";
import { TaskLabel } from "./taskLabel";

export type Task = {
  id: string;
  title: string;
  description?: string;
  position: number;
  boardList?: BoardList;
  boardListId?: string;
  dueDate?: string;
  assignees?: TaskAssignee[];
  comments?: TaskComment[];
  taskLabels?: TaskLabel[];
} & AuditCreatedBase;
