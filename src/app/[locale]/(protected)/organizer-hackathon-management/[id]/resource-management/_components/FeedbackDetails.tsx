// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/FeedbackDetails.tsx
import React, { useState, useEffect } from "react";
import { feedbackDetailService } from "@/services/feedbackDetail.service";
import { Feedback } from "@/types/entities/feedback";
import { FeedbackDetail } from "@/types/entities/feedbackDetail";
import { User } from "@/types/entities/user";
import { useApiModal } from "@/hooks/useApiModal";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface FeedbackDetailsProps {
  feedback: Feedback;
  currentUser: User | null;
}

export default function FeedbackDetails({
  feedback,
  currentUser,
}: FeedbackDetailsProps) {
  const t = useTranslations("feedbackDetails");
  const toast = useToast();
  const { showModal } = useApiModal();

  const [expanded, setExpanded] = useState(false);
  const [feedbackDetails, setFeedbackDetails] = useState<FeedbackDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [organizerDetails, setOrganizerDetails] = useState<FeedbackDetail[]>(
    []
  );
  const [otherUserDetails, setOtherUserDetails] = useState<
    Record<string, FeedbackDetail[]>
  >({});

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
          title: t("error"),
          message: response.message || t("failedToLoadFeedbackDetails"),
          type: "error",
        });
      }
    } catch (error: any) {
      console.error("Error fetching feedback details:", error);
      showModal({
        title: t("error"),
        message:
          error.message || t("errorOccurredWhileFetchingFeedbackDetails"),
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
    ? `${t("mentorFeedback")}: ${feedback.mentor?.username || feedback.mentorId}`
    : t("hackathonFeedback");

  return (
    <div className="border rounded-lg overflow-hidden dark:border-gray-700 transition-colors duration-200">
      <div
        className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center transition-colors duration-200"
        onClick={toggleExpand}
        aria-expanded={expanded}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleExpand();
          }
        }}
      >
        <div className="mb-2 sm:mb-0">
          <h3 className="font-medium text-gray-900 dark:text-white">
            {feedback.title || feedbackType}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {t("createdBy")} {feedback.createdByUserName} {t("on")} {createdAt}
          </p>
        </div>
        <div className="text-blue-600 dark:text-blue-400 text-sm sm:text-base whitespace-nowrap">
          {expanded ? t("hideDetails") : t("viewDetails")}
        </div>
      </div>

      {expanded && (
        <div className="p-3 sm:p-4 border-t dark:border-gray-700 transition-colors duration-200">
          {feedback.description && (
            <p className="mb-3 sm:mb-4 text-gray-700 dark:text-gray-300 text-sm sm:text-base transition-colors duration-200">
              {feedback.description}
            </p>
          )}

          {isLoading ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner size="sm" />
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Organizer's feedback template */}
              {organizerDetails.length > 0 && (
                <div className="border-b dark:border-gray-700 pb-4 transition-colors duration-200">
                  <h4 className="font-medium mb-2 text-gray-900 dark:text-white text-sm sm:text-base">
                    {t("feedbackFormTemplate")}:
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    {organizerDetails.map((detail) => (
                      <div
                        key={detail.id}
                        className="bg-gray-50 dark:bg-gray-700 p-2 sm:p-3 rounded text-sm sm:text-base transition-colors duration-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="font-medium text-gray-900 dark:text-white mb-1 sm:mb-0">
                            {detail.content}
                          </span>
                          {detail.maxRating > 0 && (
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              {t("maxRating")}: {detail.maxRating}
                            </span>
                          )}
                        </div>
                        {detail.note && (
                          <p className="mt-1 text-gray-500 dark:text-gray-400 italic text-xs sm:text-sm">
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
                  <h4 className="font-medium mb-2 text-gray-900 dark:text-white text-sm sm:text-base">
                    {t("responses")}:
                  </h4>
                  {Object.entries(otherUserDetails).map(
                    ([username, details]) => (
                      <div
                        key={username}
                        className="mb-3 sm:mb-4 border-b dark:border-gray-700 pb-3 sm:pb-4 transition-colors duration-200"
                      >
                        <h5 className="text-xs sm:text-sm font-semibold mb-2 text-gray-800 dark:text-gray-300">
                          {t("responseFrom")} {username}:
                        </h5>
                        <div className="space-y-2 sm:space-y-3">
                          {details.map((detail) => (
                            <div
                              key={detail.id}
                              className="bg-gray-50 dark:bg-gray-700 p-2 sm:p-3 rounded text-sm transition-colors duration-200"
                            >
                              <div className="flex flex-col sm:flex-row sm:justify-between">
                                <span className="font-medium text-gray-900 dark:text-white mb-1 sm:mb-0">
                                  {detail.content}
                                </span>
                                {detail.rate > 0 && (
                                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    {t("rating")}: {detail.rate}/
                                    {detail.maxRating}
                                  </span>
                                )}
                              </div>
                              {detail.note && (
                                <p className="mt-1 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
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
                <p className="text-gray-500 dark:text-gray-400 italic text-sm">
                  {t("noResponsesSubmittedYet")}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
