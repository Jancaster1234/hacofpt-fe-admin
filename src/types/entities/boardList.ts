// src/types/entities/boardList.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { Board } from "./board";
import { Task } from "./task";

export type BoardList = {
  id: string;
  name: string;
  position: number;
  board?: Board;
  boardId?: string;
  tasks?: Task[];
} & AuditCreatedBase;
