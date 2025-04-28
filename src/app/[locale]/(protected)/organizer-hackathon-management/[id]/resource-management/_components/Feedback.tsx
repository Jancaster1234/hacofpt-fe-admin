// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Feedback.tsx
import React, { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import { feedbackService } from "@/services/feedback.service";
import { Feedback as FeedbackType } from "@/types/entities/feedback";
import { useApiModal } from "@/hooks/useApiModal";
import { useAuth } from "@/hooks/useAuth_v0";
import FeedbackDetails from "./FeedbackDetails";
import CreateFeedbackForm from "./CreateFeedbackForm";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface FeedbackProps {
  hackathonId: string;
}

export default function Feedback({ hackathonId }: FeedbackProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [hackathonFeedbacks, setHackathonFeedbacks] = useState<FeedbackType[]>(
    []
  );
  const [mentorFeedbacks, setMentorFeedbacks] = useState<
    Record<string, FeedbackType[]>
  >({});
  const { showModal } = useApiModal();
  const { user } = useAuth();
  const t = useTranslations("feedback");
  const toast = useToast();

  // Fetch all feedbacks when component mounts
  useEffect(() => {
    const fetchFeedbacks = async () => {
      setIsLoading(true);
      try {
        const response =
          await feedbackService.getFeedbacksByHackathonId(hackathonId);
        if (response.data) {
          setFeedbacks(response.data);

          // Separate feedbacks into hackathon and mentor categories
          const hackathonFeedbacks = response.data.filter(
            (feedback) => !feedback.mentorId && !feedback.teamId
          );
          setHackathonFeedbacks(hackathonFeedbacks);

          // Group mentor feedbacks by mentorId
          const mentorFeedbacksMap: Record<string, FeedbackType[]> = {};
          response.data.forEach((feedback) => {
            if (feedback.mentorId && !feedback.teamId) {
              if (!mentorFeedbacksMap[feedback.mentorId]) {
                mentorFeedbacksMap[feedback.mentorId] = [];
              }
              mentorFeedbacksMap[feedback.mentorId].push(feedback);
            }
          });
          setMentorFeedbacks(mentorFeedbacksMap);
        } else {
          showModal({
            title: t("error"),
            message: t("failedToLoad"),
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        showModal({
          title: t("error"),
          message: t("errorOccurred"),
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hackathonId, showModal]); // Do not include toast in dependency array

  const handleFeedbackCreated = async () => {
    // Refresh feedbacks after creating a new one
    setShowCreateForm(false);
    setIsLoading(true);
    try {
      // Refetch feedbacks
      const response =
        await feedbackService.getFeedbacksByHackathonId(hackathonId);
      if (response.data) {
        setFeedbacks(response.data);

        // Update hackathon feedbacks
        const hackathonFeedbacks = response.data.filter(
          (feedback) => !feedback.mentorId && !feedback.teamId
        );
        setHackathonFeedbacks(hackathonFeedbacks);

        // Update mentor feedbacks
        const mentorFeedbacksMap: Record<string, FeedbackType[]> = {};
        response.data.forEach((feedback) => {
          if (feedback.mentorId && !feedback.teamId) {
            if (!mentorFeedbacksMap[feedback.mentorId]) {
              mentorFeedbacksMap[feedback.mentorId] = [];
            }
            mentorFeedbacksMap[feedback.mentorId].push(feedback);
          }
        });
        setMentorFeedbacks(mentorFeedbacksMap);

        // Show success toast only in response to user action
        toast.success(response.message || t("feedbackCreated"));
      } else {
        toast.error(response.message || t("failedToRefresh"));
      }
    } catch (error: any) {
      console.error("Error refreshing feedbacks:", error);
      toast.error(error.message || t("errorRefreshing"));
    } finally {
      setIsLoading(false);
    }
  };

  // Generate tabs for each mentor feedback category
  const tabCategories = [
    { name: t("hackathonFeedback"), type: "hackathon" },
    ...Object.keys(mentorFeedbacks).map((mentorId) => ({
      name: `${t("mentor")}: ${
        mentorFeedbacks[mentorId][0]?.mentor?.username || mentorId
      }`,
      type: "mentor",
      mentorId,
    })),
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {t("hackathonFeedbackTitle")}
        </h2>
        {!showCreateForm && (
          <Button
            onClick={() => setShowCreateForm(true)}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          >
            {t("createFeedbackForm")}
          </Button>
        )}
      </div>

      {showCreateForm ? (
        <CreateFeedbackForm
          hackathonId={hackathonId}
          onFeedbackCreated={handleFeedbackCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      ) : isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" showText />
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {t("noFeedbackAvailable")}
        </div>
      ) : (
        <Tab.Group>
          <Tab.List className="flex flex-wrap space-x-1 border-b dark:border-gray-700 overflow-x-auto">
            {tabCategories.map((category) => (
              <Tab
                key={
                  category.type === "mentor"
                    ? `mentor-${category.mentorId}`
                    : "hackathon"
                }
                className={({ selected }) =>
                  `py-2 px-3 sm:px-4 text-sm font-medium leading-5 text-gray-700 dark:text-gray-300 border-b-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all whitespace-nowrap ${
                    selected
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600"
                  }`
                }
              >
                {category.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-4">
            {/* Hackathon Feedback Panel */}
            <Tab.Panel>
              {hackathonFeedbacks.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {t("noHackathonFeedback")}
                </div>
              ) : (
                <div className="space-y-6">
                  {hackathonFeedbacks.map((feedback) => (
                    <FeedbackDetails
                      key={feedback.id}
                      feedback={feedback}
                      currentUser={user}
                    />
                  ))}
                </div>
              )}
            </Tab.Panel>

            {/* Mentor Feedback Panels */}
            {Object.keys(mentorFeedbacks).map((mentorId) => (
              <Tab.Panel key={`mentor-panel-${mentorId}`}>
                <div className="space-y-6">
                  {mentorFeedbacks[mentorId].map((feedback) => (
                    <FeedbackDetails
                      key={feedback.id}
                      feedback={feedback}
                      currentUser={user}
                    />
                  ))}
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      )}
    </div>
  );
}
