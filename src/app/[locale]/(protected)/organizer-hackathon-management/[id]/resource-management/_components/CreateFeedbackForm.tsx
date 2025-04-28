// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/CreateFeedbackForm.tsx
import React, { useState } from "react";
import { feedbackService } from "@/services/feedback.service";
import { feedbackDetailService } from "@/services/feedbackDetail.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";
import { useHackathonMentors } from "@/hooks/useHackathonMentors";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
  const t = useTranslations("feedbackForm");
  const toast = useToast();

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
      toast.error(t("validationErrorQuestions"));
      return;
    }

    if (feedbackType === "mentor" && !selectedMentorId) {
      toast.error(t("validationErrorMentorSelection"));
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
          toast.success(response.message || t("successCreateFeedback"));
          onFeedbackCreated();
        } else {
          toast.error(
            detailsResponse.message || t("errorCreateFeedbackDetails")
          );
        }
      } else {
        toast.error(response.message || t("errorCreateFeedback"));
      }
    } catch (error: any) {
      console.error("Error creating feedback:", error);
      toast.error(error?.message || t("errorGeneric"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
        {t("createFeedbackForm")}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("feedbackType")}
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  value="hackathon"
                  checked={feedbackType === "hackathon"}
                  onChange={() => setFeedbackType("hackathon")}
                  className="mr-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  aria-label={t("hackathonFeedback")}
                />
                {t("hackathonFeedback")}
              </label>
              <label className="flex items-center text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  value="mentor"
                  checked={feedbackType === "mentor"}
                  onChange={() => setFeedbackType("mentor")}
                  className="mr-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  aria-label={t("mentorFeedback")}
                />
                {t("mentorFeedback")}
              </label>
            </div>
          </div>

          {/* Mentor Selection (show only when mentor feedback type is selected) */}
          {feedbackType === "mentor" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("selectMentor")}
              </label>
              {loadingMentors ? (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t("loadingMentors")}
                </div>
              ) : mentorsError ? (
                <div className="text-sm text-red-500 dark:text-red-400">
                  {mentorsError}
                </div>
              ) : (
                <select
                  value={selectedMentorId}
                  onChange={(e) => setSelectedMentorId(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md p-2 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                  aria-label={t("selectMentor")}
                >
                  <option value="">{t("selectAMentor")}</option>
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
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t("title")}
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("titlePlaceholder")}
              className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
              required
              aria-required="true"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t("description")}
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("descriptionPlaceholder")}
              className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
              rows={3}
            />
          </div>

          {/* Feedback Detail Items */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("feedbackQuestions")}
              </label>
              <Button
                type="button"
                onClick={handleAddFeedbackDetail}
                variant="outline"
                size="sm"
                className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
              >
                <Plus size={16} className="mr-1" /> {t("addQuestion")}
              </Button>
            </div>

            <div className="space-y-4">
              {feedbackDetails.map((detail, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-md p-3 sm:p-4 relative bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200"
                >
                  {feedbackDetails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFeedbackDetail(index)}
                      className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                      aria-label={t("removeQuestion")}
                    >
                      <X size={18} />
                    </button>
                  )}

                  <div className="space-y-3">
                    {/* Question Content */}
                    <div>
                      <label
                        htmlFor={`question-${index}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        {t("question")}
                      </label>
                      <Input
                        id={`question-${index}`}
                        type="text"
                        value={detail.content}
                        onChange={(e) =>
                          handleDetailChange(index, "content", e.target.value)
                        }
                        placeholder={t("questionPlaceholder")}
                        className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                        required
                      />
                    </div>

                    {/* Max Rating */}
                    <div>
                      <label
                        htmlFor={`rating-${index}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        {t("maxRating")}
                      </label>
                      <select
                        id={`rating-${index}`}
                        value={detail.maxRating}
                        onChange={(e) =>
                          handleDetailChange(
                            index,
                            "maxRating",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md p-2 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      >
                        <option value="0">{t("noRating")}</option>
                        <option value="5">{t("fiveStars")}</option>
                        <option value="10">{t("tenPoints")}</option>
                      </select>
                    </div>

                    {/* Note */}
                    <div>
                      <label
                        htmlFor={`note-${index}`}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        {t("noteOptional")}
                      </label>
                      <Textarea
                        id={`note-${index}`}
                        value={detail.note || ""}
                        onChange={(e) =>
                          handleDetailChange(index, "note", e.target.value)
                        }
                        placeholder={t("notePlaceholder")}
                        className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto order-2 sm:order-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto order-1 sm:order-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white transition-colors duration-200"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" /> {t("creating")}
                </>
              ) : (
                t("createFeedbackForm")
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
