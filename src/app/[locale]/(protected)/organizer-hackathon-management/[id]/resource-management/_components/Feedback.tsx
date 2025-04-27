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

  const handleFeedbackCreated = () => {
    // Refresh feedbacks after creating a new one
    setShowCreateForm(false);
    // Refetch feedbacks
    feedbackService.getFeedbacksByHackathonId(hackathonId).then((response) => {
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
      }
    });
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

  // Generate tabs for each mentor feedback category
  const tabCategories = [
    { name: "Hackathon Feedback", type: "hackathon" },
    ...Object.keys(mentorFeedbacks).map((mentorId) => ({
      name: `Mentor: ${
        mentorFeedbacks[mentorId][0]?.mentor?.username || mentorId
      }`,
      type: "mentor",
      mentorId,
    })),
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Hackathon Feedback</h2>
        {!showCreateForm && (
          <Button onClick={() => setShowCreateForm(true)}>
            Create Feedback Form
          </Button>
        )}
      </div>

      {showCreateForm ? (
        <CreateFeedbackForm
          hackathonId={hackathonId}
          onFeedbackCreated={handleFeedbackCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No feedback available for this hackathon. Create your first feedback
          form!
        </div>
      ) : (
        <Tab.Group>
          <Tab.List className="flex space-x-1 border-b">
            {tabCategories.map((category) => (
              <Tab
                key={
                  category.type === "mentor"
                    ? `mentor-${category.mentorId}`
                    : "hackathon"
                }
                className={({ selected }) =>
                  `py-2 px-4 text-sm font-medium leading-5 text-gray-700 border-b-2 ${
                    selected
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent hover:text-gray-900 hover:border-gray-300"
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
                <div className="text-center py-8 text-gray-500">
                  No hackathon feedback available.
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
