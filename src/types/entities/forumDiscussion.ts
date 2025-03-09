// src/types/entities/forumDiscussion.ts
export type ForumDiscussion = {
  id: string;
  threadId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
};
