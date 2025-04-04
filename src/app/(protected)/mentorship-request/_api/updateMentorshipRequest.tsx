// src/app/(protected)/mentorship-request/_api/updateMentorshipRequest.tsx
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

  // This would be a real API call in production
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Simulate successful API response
        const updatedRequest: MentorshipRequest = {
          id: requestId,
          status,
          evaluatedAt: new Date().toISOString(),
          evaluatedById,
          // Note: In a real implementation, the API would return the full updated object
          // with all properties. This is a simplified version.
          createdByUserName: "User",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        resolve(updatedRequest);
      } catch (error) {
        reject(new Error("Failed to update mentorship request"));
      }
    }, 500); // Simulate network delay
  });
};
