// src/app/(protected)/grading-submission/[id]/round/[roundId]/submission/[submissionId]/judge-submission/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Submission } from "@/types/entities/submission";
import { useAuth } from "@/hooks/useAuth_v0";
import { submissionService } from "@/services/submission.service";
import ApiResponseModal from "@/components/common/ApiResponseModal";
import { useApiModal } from "@/hooks/useApiModal";

export default function JudgeSubmissionPage() {
  const { id, roundId, submissionId } = useParams<{
    id: string;
    roundId: string;
    submissionId: string;
  }>();
  const router = useRouter();
  const { user } = useAuth();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [activeJudgeIndex, setActiveJudgeIndex] = useState(0);
  const [criteriaScores, setCriteriaScores] = useState<{
    [key: string]: number;
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  const { modalState, hideModal, showError, showSuccess } = useApiModal();

  useEffect(() => {
    const fetchSubmission = async () => {
      if (!user || !submissionId) return;

      try {
        setIsLoading(true);
        const response = await submissionService.getSubmissionById(
          submissionId
        );

        if (response.data) {
          setSubmission(response.data);

          // Set initial scores from the current judge's submission if it exists
          const currentJudgeSubmission = response.data.judgeSubmissions?.find(
            (js) => js.judge.id === user.id
          );

          if (currentJudgeSubmission) {
            const initialScores: { [key: string]: number } = {};
            currentJudgeSubmission.judgeSubmissionDetails.forEach((jsd) => {
              initialScores[jsd.roundMarkCriterion.id] = jsd.score;
            });
            setCriteriaScores(initialScores);

            // Find the index of the current judge
            const judgeIndex = response.data.judgeSubmissions.findIndex(
              (js) => js.judge.id === user.id
            );
            if (judgeIndex !== -1) {
              setActiveJudgeIndex(judgeIndex);
            }
          } else if (response.data.judgeSubmissions?.length > 0) {
            // If current judge hasn't submitted yet, initialize with zeros
            const firstJudgeSubmission = response.data.judgeSubmissions[0];
            const initialScores: { [key: string]: number } = {};
            firstJudgeSubmission.judgeSubmissionDetails.forEach((jsd) => {
              initialScores[jsd.roundMarkCriterion.id] = 0;
            });
            setCriteriaScores(initialScores);
          }
        } else {
          showError("Error", "Failed to load submission");
          router.push(`/grading-submission/${id}`);
        }
      } catch (error) {
        console.error("Error fetching submission:", error);
        showError("Error", "Failed to load submission data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmission();
  }, [user, submissionId, id, router, showError]);

  const handleScoreChange = (criterionId: string, score: number) => {
    setCriteriaScores((prev) => ({
      ...prev,
      [criterionId]: score,
    }));
  };

  const calculateTotalScore = () => {
    return Object.values(criteriaScores).reduce((sum, score) => sum + score, 0);
  };

  const handleSubmit = async () => {
    if (!user || !submission) return;

    try {
      // Prepare judgeSubmission data
      const judgeSubmissionData = {
        submissionId: submission.id,
        judgeId: user.id,
        criteriaScores: criteriaScores,
      };

      // Call the service to save the judge submission
      const response = await submissionService.saveJudgeSubmission(
        judgeSubmissionData
      );

      if (response.data) {
        showSuccess(
          "Success",
          "Your evaluation has been submitted successfully"
        );
        // Refresh the submission data
        const updatedSubmission = await submissionService.getSubmissionById(
          submissionId
        );
        if (updatedSubmission.data) {
          setSubmission(updatedSubmission.data);
        }
      } else {
        showError("Error", response.message || "Failed to submit evaluation");
      }
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      showError("Error", "Failed to submit your evaluation");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!submission) return <div>Submission not found</div>;

  const judgeSubmissions = submission.judgeSubmissions || [];
  const activeJudgeSubmission = judgeSubmissions[activeJudgeIndex];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Judge Submission</h1>

      {/* Judge Submission Tabs */}
      <div className="flex border-b mb-4">
        {judgeSubmissions.map((js, index) => (
          <button
            key={js.id}
            onClick={() => setActiveJudgeIndex(index)}
            className={`px-4 py-2 ${
              index === activeJudgeIndex
                ? "text-blue-600 font-bold border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
          >
            {js.judge.lastName} {js.judge.firstName}
          </button>
        ))}
      </div>

      {/* Submission Details for Active Judge */}
      {activeJudgeSubmission && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Evaluation Criteria</h2>

          {/* Dynamically render mark criteria */}
          {activeJudgeSubmission.judgeSubmissionDetails.map((detail) => (
            <div key={detail.roundMarkCriterion.id} className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium">
                  {detail.roundMarkCriterion.name}
                  <span className="text-sm text-gray-500 ml-2">
                    (Max: {detail.roundMarkCriterion.maxScore})
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  max={detail.roundMarkCriterion.maxScore}
                  value={criteriaScores[detail.roundMarkCriterion.id] || 0}
                  onChange={(e) =>
                    handleScoreChange(
                      detail.roundMarkCriterion.id,
                      Number(e.target.value)
                    )
                  }
                  className="w-20 p-2 border rounded"
                  disabled={activeJudgeSubmission.judge.id !== user?.id}
                />
              </div>
              <p className="text-sm text-gray-500">
                {detail.roundMarkCriterion.note}
              </p>
            </div>
          ))}

          {/* Total Score */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-bold">Total Score:</span>
              <span className="text-xl font-bold">
                {calculateTotalScore()} /
                {activeJudgeSubmission.judgeSubmissionDetails.reduce(
                  (sum, detail) => sum + detail.roundMarkCriterion.maxScore,
                  0
                )}
              </span>
            </div>
          </div>

          {/* Submit Button - Only show for current user's submission */}
          {activeJudgeSubmission.judge.id === user?.id && (
            <button
              onClick={handleSubmit}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Submit Evaluation
            </button>
          )}
        </div>
      )}

      {/* Submission Files */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Submitted Files</h3>
        <div className="grid grid-cols-2 gap-4">
          {submission.fileUrls?.map((file) => (
            <div
              key={file.id}
              className="border p-3 rounded flex items-center justify-between"
            >
              <span>{file.fileName}</span>
              <a
                href={file.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* API Response Modal */}
      <ApiResponseModal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
    </div>
  );
}
