// src/types/entities/forumThread.ts
export type ForumThread = {
  id: string;
  title: string;
  authorId: string;
  categoryId: string; // Updated from subcategoryId
  createdAt: string;
  updatedAt?: string;
};
