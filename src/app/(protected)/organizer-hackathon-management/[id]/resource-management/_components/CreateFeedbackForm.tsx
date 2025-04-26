// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/CreateFeedbackForm.tsx
import React, { useState } from "react";
import { feedbackService } from "@/services/feedback.service";
import { feedbackDetailService } from "@/services/feedbackDetail.service";
import { useApiModal } from "@/hooks/useApiModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";
import { useHackathonMentors } from "@/hooks/useHackathonMentors";

interface CreateFeedbackFormProps {
  hackathonId: string;
  onFeedbackCreated: () => void;
  onCancel: () => void;
}

interface FeedbackDetailInput {
  id?: string;
  content: string;
  maxRating: number;
  note?: string;
}

export default function CreateFeedbackForm({
  hackathonId,
  onFeedbackCreated,
  onCancel,
}: CreateFeedbackFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [feedbackType, setFeedbackType] = useState<"hackathon" | "mentor">(
    "hackathon"
  );
  const [selectedMentorId, setSelectedMentorId] = useState<string>("");
  const [feedbackDetails, setFeedbackDetails] = useState<FeedbackDetailInput[]>(
    [{ content: "", maxRating: 5, note: "" }]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showModal } = useApiModal();
  const {
    mentors,
    loading: loadingMentors,
    error: mentorsError,
  } = useHackathonMentors(hackathonId);

  const handleAddFeedbackDetail = () => {
    setFeedbackDetails([
      ...feedbackDetails,
      { content: "", maxRating: 5, note: "" },
    ]);
  };

  const handleRemoveFeedbackDetail = (index: number) => {
    const updatedDetails = [...feedbackDetails];
    updatedDetails.splice(index, 1);
    setFeedbackDetails(updatedDetails);
  };

  const handleDetailChange = (
    index: number,
    field: keyof FeedbackDetailInput,
    value: string | number
  ) => {
    const updatedDetails = [...feedbackDetails];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value,
    };
    setFeedbackDetails(updatedDetails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (feedbackDetails.some((detail) => !detail.content)) {
      showModal({
        title: "Validation Error",
        message: "All feedback questions must have content",
        type: "error",
      });
      return;
    }

    if (feedbackType === "mentor" && !selectedMentorId) {
      showModal({
        title: "Validation Error",
        message: "Please select a mentor for mentor feedback",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First create the feedback
      const feedbackData = {
        hackathonId,
        mentorId: feedbackType === "mentor" ? selectedMentorId : undefined,
        title,
        description,
      };

      const response = await feedbackService.createFeedback(feedbackData);

      if (response.data && response.data.id) {
        // Then create feedback details
        const detailsResponse =
          await feedbackDetailService.bulkCreateFeedbackDetails(
            response.data.id,
            feedbackDetails.map((detail) => ({
              content: detail.content,
              maxRating: detail.maxRating,
              note: detail.note,
            }))
          );

        if (detailsResponse.data) {
          showModal({
            title: "Success",
            message: "Feedback form created successfully",
            type: "success",
          });
          onFeedbackCreated();
        } else {
          showModal({
            title: "Error",
            message: "Failed to create feedback details",
            type: "error",
          });
        }
      } else {
        showModal({
          title: "Error",
          message: "Failed to create feedback",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error creating feedback:", error);
      showModal({
        title: "Error",
        message: "An error occurred while creating feedback",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-medium mb-4">Create Feedback Form</h3>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Feedback Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="hackathon"
                  checked={feedbackType === "hackathon"}
                  onChange={() => setFeedbackType("hackathon")}
                  className="mr-2"
                />
                Hackathon Feedback
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="mentor"
                  checked={feedbackType === "mentor"}
                  onChange={() => setFeedbackType("mentor")}
                  className="mr-2"
                />
                Mentor Feedback
              </label>
            </div>
          </div>

          {/* Mentor Selection (show only when mentor feedback type is selected) */}
          {feedbackType === "mentor" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Mentor
              </label>
              {loadingMentors ? (
                <div className="flex items-center text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                  Loading mentors...
                </div>
              ) : mentorsError ? (
                <div className="text-sm text-red-500">{mentorsError}</div>
              ) : (
                <select
                  value={selectedMentorId}
                  onChange={(e) => setSelectedMentorId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  <option value="">Select a mentor</option>
                  {mentors.map((mentor) => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.username ||
                        `${mentor.firstName} ${mentor.lastName}`}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter feedback form title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
              rows={3}
            />
          </div>

          {/* Feedback Detail Items */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Feedback Questions
              </label>
              <Button
                type="button"
                onClick={handleAddFeedbackDetail}
                variant="outline"
                size="sm"
              >
                <Plus size={16} className="mr-1" /> Add Question
              </Button>
            </div>

            <div className="space-y-4">
              {feedbackDetails.map((detail, index) => (
                <div key={index} className="border rounded-md p-4 relative">
                  {feedbackDetails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFeedbackDetail(index)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                    >
                      <X size={18} />
                    </button>
                  )}

                  <div className="space-y-3">
                    {/* Question Content */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question
                      </label>
                      <Input
                        type="text"
                        value={detail.content}
                        onChange={(e) =>
                          handleDetailChange(index, "content", e.target.value)
                        }
                        placeholder="Enter question"
                        required
                      />
                    </div>

                    {/* Max Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Rating
                      </label>
                      <select
                        value={detail.maxRating}
                        onChange={(e) =>
                          handleDetailChange(
                            index,
                            "maxRating",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="0">No Rating</option>
                        <option value="5">5 Stars</option>
                        <option value="10">10 Points</option>
                      </select>
                    </div>

                    {/* Note */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Note (Optional)
                      </label>
                      <Textarea
                        value={detail.note || ""}
                        onChange={(e) =>
                          handleDetailChange(index, "note", e.target.value)
                        }
                        placeholder="Additional notes or instructions"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Feedback Form"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
