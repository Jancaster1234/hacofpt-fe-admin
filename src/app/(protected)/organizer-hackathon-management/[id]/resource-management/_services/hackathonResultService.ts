// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_services/hackathonResultService.ts
import { hackathonResultService } from "@/services/hackathonResult.service";

export const createBulkHackathonResults = async (
  hackathonId: string,
  resultData: Array<{
    hackathonId: string;
    teamId: string;
    totalScore: number;
    placement: number;
    award?: string;
  }>
) => {
  try {
    const response = await hackathonResultService.createBulkHackathonResults(
      resultData
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "[HackathonResultService] Error creating bulk results:",
      error
    );
    throw error;
  }
};
