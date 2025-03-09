// src/mocks/forumCategory.mock.ts
import { ForumCategory } from "@/types/entities/forumCategory";

export const mockForumCategories: ForumCategory[] = [
  {
    id: "1",
    name: "Hackathon Announcements",
    description: "Official updates about upcoming hackathons.",
    section: "Official",
  },
  {
    id: "2",
    name: "Team Formation",
    description: "Find and join hackathon teams.",
    section: "Community",
  },
  {
    id: "3",
    name: "Technical Discussions",
    description: "Discuss technical challenges and solutions.",
    section: "Technical",
  },
  {
    id: "4",
    name: "General Chat",
    description: "Casual discussions and networking.",
    section: "Community",
  },
];
