// src/mocks/markCriteria.mock.ts
import { RoundMarkCriteria } from "@/types/entities/markCriteria";

export const mockRoundMarkCriteria: RoundMarkCriteria[] = [
  {
    id: "1",
    roundId: "101",
    criterionName: "Innovation (Tính sáng tạo)",
    maxScore: 10,
    note: "none",
  },
  {
    id: "2",
    roundId: "101",
    criterionName: "Feasibility (Tính khả thi)",
    maxScore: 10,
    note: "none",
  },
  {
    id: "3",
    roundId: "101",
    criterionName: "Functionality (Chức năng)",
    maxScore: 10,
    note: "none",
  },
  {
    id: "4",
    roundId: "101",
    criterionName: "Impact (Tác động)",
    maxScore: 10,
    note: "none",
  },
  {
    id: "5",
    roundId: "101",
    criterionName: "User Experience (Trải nghiệm người dùng)",
    maxScore: 10,
    note: "none",
  },
];
