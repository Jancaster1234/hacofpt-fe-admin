// src/types/entities/threadPost.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { ForumThread } from "./forumThread";
import { User } from "./user";
import { ThreadPostLike } from "./threadPostLike";
import { ThreadPostReport } from "./threadPostReport";

export type ThreadPost = {
  id: string;
  forumThread?: Partial<ForumThread>;
  forumThreadId?: string;
  content: string;
  threadPostLikes?: ThreadPostLike[];
  threadPostReports?: ThreadPostReport[];
  isDeleted: boolean;
  deletedBy?: User;
  deletedById?: string;
} & AuditCreatedBase;
