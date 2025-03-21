import { AuditCreatedBase } from "./auditCreatedBase";
import { BoardList } from "./boardList";
import { FileUrl } from "./fileUrl";
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
  fileUrls: FileUrl[];
  assignees?: TaskAssignee[];
  comments?: TaskComment[];
  taskLabels?: TaskLabel[];
} & AuditCreatedBase;
