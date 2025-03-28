// src/types/entities/forumThread.ts
import { AuditCreatedBase } from "./auditCreatedBase";
import { ForumCategory } from "./forumCategory";
import { ThreadPost } from "./threadPost";

export type ForumThread = {
  id: string;
  title: string;
  forumCategory?: ForumCategory;
  forumCategoryId?: string;
  isLocked: boolean;
  isPinned: boolean;
  threadPosts: ThreadPost[];
} & AuditCreatedBase;
