// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/FeedbackDetails.tsx
import React, { useState, useEffect } from "react";
import { feedbackDetailService } from "@/services/feedbackDetail.service";
import { Feedback } from "@/types/entities/feedback";
import { FeedbackDetail } from "@/types/entities/feedbackDetail";
import { User } from "@/types/entities/user";
import { useApiModal } from "@/hooks/useApiModal";

interface FeedbackDetailsProps {
  feedback: Feedback;
  currentUser: User | null;
}

export default function FeedbackDetails({
  feedback,
  currentUser,
}: FeedbackDetailsProps) {
  const [expanded, setExpanded] = useState(false);
  const [feedbackDetails, setFeedbackDetails] = useState<FeedbackDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [organizerDetails, setOrganizerDetails] = useState<FeedbackDetail[]>(
    []
  );
  const [otherUserDetails, setOtherUserDetails] = useState<
    Record<string, FeedbackDetail[]>
  >({});
  const { showModal } = useApiModal();

  useEffect(() => {
    // Only fetch details when expanded
    if (expanded && feedbackDetails.length === 0) {
      fetchFeedbackDetails();
    }
  }, [expanded]);

  const fetchFeedbackDetails = async () => {
    setIsLoading(true);
    try {
      const response =
        await feedbackDetailService.getFeedbackDetailsByFeedbackId(feedback.id);
      if (response.data) {
        setFeedbackDetails(response.data);

        // Separate organizer details from other users
        const organizerFeedbackDetails = response.data.filter(
          (detail) => detail.createdByUserName === feedback.createdByUserName
        );
        setOrganizerDetails(organizerFeedbackDetails);

        // Group other user details by createdByUserName
        const otherUserDetailsMap: Record<string, FeedbackDetail[]> = {};
        response.data.forEach((detail) => {
          if (detail.createdByUserName !== feedback.createdByUserName) {
            if (!otherUserDetailsMap[detail.createdByUserName || ""]) {
              otherUserDetailsMap[detail.createdByUserName || ""] = [];
            }
            otherUserDetailsMap[detail.createdByUserName || ""].push(detail);
          }
        });
        setOtherUserDetails(otherUserDetailsMap);
      } else {
        showModal({
          title: "Error",
          message: "Failed to load feedback details",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching feedback details:", error);
      showModal({
        title: "Error",
        message: "An error occurred while fetching feedback details",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const createdAt = new Date(feedback.createdAt || "").toLocaleDateString();
  const feedbackType = feedback.mentorId
    ? `Mentor Feedback: ${feedback.mentor?.username || feedback.mentorId}`
    : "Hackathon Feedback";

  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        className="bg-gray-50 p-4 cursor-pointer flex justify-between items-center"
        onClick={toggleExpand}
      >
        <div>
          <h3 className="font-medium">{feedback.title || feedbackType}</h3>
          <p className="text-sm text-gray-600">
            Created by {feedback.createdByUserName} on {createdAt}
          </p>
        </div>
        <div className="text-blue-600">
          {expanded ? "Hide Details" : "View Details"}
        </div>
      </div>

      {expanded && (
        <div className="p-4 border-t">
          {feedback.description && (
            <p className="mb-4 text-gray-700">{feedback.description}</p>
          )}

          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Organizer's feedback template */}
              {organizerDetails.length > 0 && (
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">Feedback Form Template:</h4>
                  <div className="space-y-3">
                    {organizerDetails.map((detail) => (
                      <div key={detail.id} className="bg-gray-50 p-3 rounded">
                        <div className="flex justify-between">
                          <span className="font-medium">{detail.content}</span>
                          {detail.maxRating > 0 && (
                            <span className="text-sm text-gray-600">
                              Max Rating: {detail.maxRating}
                            </span>
                          )}
                        </div>
                        {detail.note && (
                          <p className="mt-1 text-gray-500 italic">
                            {detail.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other users' responses */}
              {Object.keys(otherUserDetails).length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Responses:</h4>
                  {Object.entries(otherUserDetails).map(
                    ([username, details]) => (
                      <div key={username} className="mb-4 border-b pb-4">
                        <h5 className="text-sm font-semibold mb-2">
                          Response from {username}:
                        </h5>
                        <div className="space-y-3">
                          {details.map((detail) => (
                            <div
                              key={detail.id}
                              className="bg-gray-50 p-3 rounded"
                            >
                              <div className="flex justify-between">
                                <span className="font-medium">
                                  {detail.content}
                                </span>
                                {detail.rate > 0 && (
                                  <span className="text-sm text-gray-600">
                                    Rating: {detail.rate}/{detail.maxRating}
                                  </span>
                                )}
                              </div>
                              {detail.note && (
                                <p className="mt-1 text-gray-700">
                                  {detail.note}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* No responses message */}
              {Object.keys(otherUserDetails).length === 0 && (
                <p className="text-gray-500 italic">
                  No responses submitted yet.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
