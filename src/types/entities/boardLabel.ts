import { AuditBase } from "./auditBase";
import { Board } from "./board";

export type BoardLabel = {
  id: string;
  name: string;
  color: string;
  board?: Board;
  boardId?: string;
} & AuditBase;
