// src/types/entities/threadPostLike.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { ThreadPost } from "./threadPost";

export type ThreadPostLike = {
  id: string;
  threadPost?: ThreadPost;
  threadPostId?: string;
} & AuditCreatedBase;
