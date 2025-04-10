// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Feedback.tsx
import React, { useState, useEffect } from "react";
import { feedbackService } from "@/services/feedback.service";
import { feedbackDetailService } from "@/services/feedbackDetail.service";
import { Feedback as FeedbackType } from "@/types/entities/feedback";
import { FeedbackDetail } from "@/types/entities/feedbackDetail";
import { useApiModal } from "@/hooks/useApiModal";

interface FeedbackProps {
  hackathonId: string;
}

export default function Feedback({ hackathonId }: FeedbackProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const [expandedFeedbackId, setExpandedFeedbackId] = useState<string | null>(
    null
  );
  const [feedbackDetails, setFeedbackDetails] = useState<
    Record<string, FeedbackDetail[]>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showModal } = useApiModal();

  // Fetch all feedbacks when component mounts
  useEffect(() => {
    const fetchFeedbacks = async () => {
      setIsLoading(true);
      try {
        const response = await feedbackService.getFeedbacksByHackathonId(
          hackathonId
        );
        if (response.data) {
          setFeedbacks(response.data);
        } else {
          showModal({
            title: "Error",
            message: "Failed to load feedback data",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        showModal({
          title: "Error",
          message: "An error occurred while fetching feedback data",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, [hackathonId, showModal]);

  // Fetch feedback details only when a feedback item is expanded
  const handleExpandFeedback = async (feedbackId: string) => {
    // Toggle expansion
    if (expandedFeedbackId === feedbackId) {
      setExpandedFeedbackId(null);
      return;
    }

    setExpandedFeedbackId(feedbackId);

    // Check if we already have the details cached
    if (!feedbackDetails[feedbackId]) {
      try {
        const response =
          await feedbackDetailService.getFeedbackDetailsByFeedbackId(
            feedbackId
          );
        if (response.data) {
          setFeedbackDetails((prev) => ({
            ...prev,
            [feedbackId]: response.data,
          }));
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
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Hackathon Feedback</h2>

      {feedbacks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No feedback available for this hackathon.
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="border rounded-lg overflow-hidden"
            >
              <div
                className="bg-gray-50 p-4 cursor-pointer flex justify-between items-center"
                onClick={() => handleExpandFeedback(feedback.id)}
              >
                <div>
                  <h3 className="font-medium">
                    {feedback.title || "Untitled Feedback"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-blue-600">
                  {expandedFeedbackId === feedback.id
                    ? "Hide Details"
                    : "View Details"}
                </div>
              </div>

              {expandedFeedbackId === feedback.id && (
                <div className="p-4 border-t">
                  <p className="mb-4 text-gray-700">{feedback.description}</p>

                  <h4 className="font-medium mb-2">Feedback Details:</h4>
                  {!feedbackDetails[feedback.id] ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  ) : feedbackDetails[feedback.id].length === 0 ? (
                    <p className="text-gray-500 italic">
                      No detailed feedback available
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {feedbackDetails[feedback.id].map((detail) => (
                        <div key={detail.id} className="bg-gray-50 p-3 rounded">
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {detail.question}
                            </span>
                            <span className="text-sm text-gray-600">
                              {detail.rating && `Rating: ${detail.rating}/5`}
                            </span>
                          </div>
                          {detail.answer && (
                            <p className="mt-1 text-gray-700">
                              {detail.answer}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
