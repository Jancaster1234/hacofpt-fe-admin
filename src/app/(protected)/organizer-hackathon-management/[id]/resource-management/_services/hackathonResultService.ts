// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_services/hackathonResultService.ts
import { HackathonResult } from "@/types/entities/hackathonResult";

export const createBulkHackathonResults = async (
  hackathonId: string,
  resultData: Omit<
    HackathonResult,
    "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
  >[]
): Promise<HackathonResult[]> => {
  // This is a mock implementation that simulates an API call
  console.log("Creating bulk hackathon results:", resultData);

  // Simulate API response
  return resultData.map((result, index) => ({
    ...result,
    id: `result-${Date.now()}-${index}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "current-user",
    updatedBy: "current-user",
  }));
};
