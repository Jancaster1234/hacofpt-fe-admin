// src/mocks/forumThread.mock.ts
import { ForumThread } from "@/types/entities/forumThread";

export const mockForumThreads: ForumThread[] = [
  {
    id: "1001",
    title: "Hackathon 2025 Announced!",
    authorId: "1",
    categoryId: "1", // Updated to match new category-based structure
    createdAt: "2025-03-01",
  },
  {
    id: "1002",
    title: "Looking for a frontend developer!",
    authorId: "2",
    categoryId: "2", // Updated to match category instead of subcategory
    createdAt: "2025-03-05",
  },
];
