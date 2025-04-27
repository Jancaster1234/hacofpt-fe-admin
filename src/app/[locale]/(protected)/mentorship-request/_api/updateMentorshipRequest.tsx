// src/app/[locale]/(protected)/mentorship-request/_api/updateMentorshipRequest.tsx
import { mentorshipRequestService } from "@/services/mentorshipRequest.service";
import {
  MentorshipRequest,
  MentorshipStatus,
} from "@/types/entities/mentorshipRequest";

type UpdateMentorshipRequestParams = {
  requestId: string;
  status: Extract<MentorshipStatus, "APPROVED" | "REJECTED">;
  evaluatedById: string;
};

export const updateMentorshipRequest = async (
  params: UpdateMentorshipRequestParams
): Promise<MentorshipRequest> => {
  const { requestId, status, evaluatedById } = params;

  try {
    // Call the actual service method
    const response = await mentorshipRequestService.updateMentorshipRequest({
      id: requestId,
      status,
      evaluatedById,
      // Note: You'll need to get these from the original request or from context
      hackathonId: "", // This needs to be filled with the actual hackathon ID
      mentorId: "", // This needs to be filled with the actual mentor ID
    });

    if (!response.data) {
      throw new Error(
        response.message || "Failed to update mentorship request"
      );
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};
