// src/types/entities/forumCategory.ts
import { AuditBase } from "./auditBase";
import { ForumThread } from "./forumThread";

export type ForumCategory = {
  id: string;
  name: string;
  description?: string;
  section: string;
  forumThreads: ForumThread[];
} & AuditBase;
