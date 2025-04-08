// src/app/(protected)/grading-submission/[id]/round/[roundId]/submission/[submissionId]/judge-submission/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Submission } from "@/types/entities/submission";
import { TeamRound } from "@/types/entities/teamRound";
import { TeamRoundJudge } from "@/types/entities/teamRoundJudge";
import { useAuth } from "@/hooks/useAuth_v0";
import { submissionService } from "@/services/submission.service";
import { teamRoundService } from "@/services/teamRound.service";
import { teamRoundJudgeService } from "@/services/teamRoundJudge.service";
import { judgeSubmissionService } from "@/services/judgeSubmission.service";
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
  const [teamRound, setTeamRound] = useState<TeamRound | null>(null);
  const [teamRoundJudges, setTeamRoundJudges] = useState<TeamRoundJudge[]>([]);
  const [activeJudgeIndex, setActiveJudgeIndex] = useState(0);
  const [criteriaScores, setCriteriaScores] = useState<{
    [key: string]: number;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [existingJudgeSubmissionId, setExistingJudgeSubmissionId] = useState<
    string | null
  >(null);

  const { modalState, hideModal, showError, showSuccess } = useApiModal();

  useEffect(() => {
    const fetchSubmissionAndRelatedData = async () => {
      if (!user || !submissionId || !roundId) return;

      try {
        setIsLoading(true);
        // Step 1: Fetch submission data
        const submissionResponse = await submissionService.getSubmissionById(
          submissionId
        );

        if (!submissionResponse.data) {
          showError("Error", "Failed to load submission");
          router.push(`/grading-submission/${id}`);
          return;
        }

        setSubmission(submissionResponse.data);

        // Step 2: Fetch team round data using roundId and teamId from submission
        if (submissionResponse.data.roundId && submissionResponse.data.teamId) {
          const teamRoundResponse =
            await teamRoundService.getTeamRoundsByRoundIdAndTeamId(
              submissionResponse.data.roundId,
              submissionResponse.data.teamId
            );

          if (teamRoundResponse.data) {
            setTeamRound(teamRoundResponse.data);

            // Step 3: Fetch team round judges separately
            if (teamRoundResponse.data.id) {
              const teamRoundJudgesResponse =
                await teamRoundJudgeService.getTeamRoundJudgesByTeamRoundId(
                  teamRoundResponse.data.id
                );

              if (teamRoundJudgesResponse.data) {
                setTeamRoundJudges(teamRoundJudgesResponse.data);
              }
            }
          }
        }

        // Step 4: Set initial scores from the current judge's submission if it exists
        const currentJudgeSubmission =
          submissionResponse.data.judgeSubmissions?.find(
            (js) => js.judge?.id === user.id
          );

        if (currentJudgeSubmission) {
          setExistingJudgeSubmissionId(currentJudgeSubmission.id);

          const initialScores: { [key: string]: number } = {};
          currentJudgeSubmission.judgeSubmissionDetails?.forEach((jsd) => {
            initialScores[jsd.roundMarkCriterion.id] = jsd.score;
          });
          setCriteriaScores(initialScores);

          // Find the index of the current judge's submission
          const judgeIndex = submissionResponse.data.judgeSubmissions.findIndex(
            (js) => js.judge?.id === user.id
          );
          if (judgeIndex !== -1) {
            setActiveJudgeIndex(judgeIndex);
          }
        } else if (submissionResponse.data.judgeSubmissions?.length > 0) {
          // If current judge hasn't submitted yet, initialize with zeros
          const firstJudgeSubmission =
            submissionResponse.data.judgeSubmissions[0];
          const initialScores: { [key: string]: number } = {};
          firstJudgeSubmission.judgeSubmissionDetails?.forEach((jsd) => {
            initialScores[jsd.roundMarkCriterion.id] = 0;
          });
          setCriteriaScores(initialScores);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showError("Error", "Failed to load submission data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissionAndRelatedData();
  }, [user, submissionId, roundId, id, router, showError]);

  const handleScoreChange = (criterionId: string, score: number) => {
    setCriteriaScores((prev) => ({
      ...prev,
      [criterionId]: score,
    }));
  };

  const calculateTotalScore = (judgeSubmission: any) => {
    return judgeSubmission.judgeSubmissionDetails.reduce(
      (sum: number, detail: any) => sum + detail.score,
      0
    );
  };

  const calculateMaxTotalScore = (judgeSubmission: any) => {
    return judgeSubmission.judgeSubmissionDetails.reduce(
      (sum: number, detail: any) => sum + detail.roundMarkCriterion.maxScore,
      0
    );
  };

  const handleSubmit = async () => {
    if (!user || !submission) return;

    try {
      setIsLoading(true);

      // Calculate total score from criteria scores
      const totalScore = Object.values(criteriaScores).reduce(
        (sum, score) => sum + score,
        0
      );

      // Prepare judge submission details
      const judgeSubmissionDetails = Object.entries(criteriaScores).map(
        ([criterionId, score]) => ({
          roundMarkCriterionId: criterionId,
          score,
          note: "",
        })
      );

      // Prepare submission data
      const submissionData = {
        judgeId: user.id,
        submissionId: submission.id,
        score: totalScore,
        note: "",
        judgeSubmissionDetails,
      };

      let response;

      // Update or create based on whether we have an existing submission
      if (existingJudgeSubmissionId) {
        response = await judgeSubmissionService.updateJudgeSubmission(
          existingJudgeSubmissionId,
          submissionData
        );

        if (response.data) {
          showSuccess(
            "Success",
            "Your evaluation has been updated successfully"
          );
        }
      } else {
        response = await judgeSubmissionService.createJudgeSubmission(
          submissionData
        );

        if (response.data) {
          setExistingJudgeSubmissionId(response.data.id);
          showSuccess(
            "Success",
            "Your evaluation has been submitted successfully"
          );
        }
      }

      // Refresh the submission data to show the updated judge submissions
      const updatedSubmission = await submissionService.getSubmissionById(
        submissionId
      );

      if (updatedSubmission.data) {
        setSubmission(updatedSubmission.data);
      }
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      showError("Error", "Failed to submit your evaluation");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if the current user is assigned as a judge to this team
  const isAssignedJudge = teamRoundJudges.some(
    (trj) => trj.judge?.id === user?.id
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (!submission)
    return (
      <div className="text-center text-red-500 p-4">Submission not found</div>
    );
  if (!teamRound)
    return (
      <div className="text-center text-red-500 p-4">
        Team round information not found
      </div>
    );

  // Get list of judgeSubmissions for this submission
  const judgeSubmissions = submission.judgeSubmissions || [];

  // Current active judge submission (if it exists)
  const activeJudgeSubmission = judgeSubmissions[activeJudgeIndex];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Judge Submission</h1>
      <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold">Team: {submission.team?.name}</h2>
        <p className="text-gray-600">Round: {submission.round?.roundTitle}</p>
        <p className="text-gray-600">Status: {submission.status}</p>
        <p className="text-gray-600">
          Submitted: {new Date(submission.submittedAt).toLocaleString()}
        </p>
      </div>

      {/* Judge Tabs */}
      <div className="flex border-b mb-4 overflow-x-auto">
        {teamRoundJudges.map((trj, index) => {
          // Find corresponding judgeSubmission if it exists
          const judgeSubmission = judgeSubmissions.find(
            (js) => js.judge?.id === trj.judge?.id
          );

          return (
            <button
              key={trj.id || index}
              onClick={() => {
                // If this judge has a submission, set the active index to it
                const submissionIndex = judgeSubmissions.findIndex(
                  (js) => js.judge?.id === trj.judge?.id
                );
                setActiveJudgeIndex(
                  submissionIndex !== -1 ? submissionIndex : activeJudgeIndex
                );
              }}
              className={`px-4 py-2 whitespace-nowrap ${
                (judgeSubmission &&
                  judgeSubmissions.indexOf(judgeSubmission) ===
                    activeJudgeIndex) ||
                (!judgeSubmission && trj.judge?.id === user?.id)
                  ? "text-blue-600 font-bold border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {trj.judge?.firstName} {trj.judge?.lastName}
              {judgeSubmission && " ✓"}
            </button>
          );
        })}
      </div>

      {/* Evaluation Form */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Evaluation Criteria</h2>

        {activeJudgeSubmission ? (
          // Show existing judge submission
          <div>
            {activeJudgeSubmission.judgeSubmissionDetails?.map((detail) => (
              <div
                key={detail.roundMarkCriterion.id}
                className="mb-4 p-3 bg-gray-50 rounded-lg"
              >
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
                    value={
                      activeJudgeSubmission.judge?.id === user?.id
                        ? criteriaScores[detail.roundMarkCriterion.id] || 0
                        : detail.score
                    }
                    onChange={(e) =>
                      handleScoreChange(
                        detail.roundMarkCriterion.id,
                        Number(e.target.value)
                      )
                    }
                    className="w-20 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={activeJudgeSubmission.judge?.id !== user?.id}
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
                  {activeJudgeSubmission.judge?.id === user?.id
                    ? Object.values(criteriaScores).reduce(
                        (sum, score) => sum + score,
                        0
                      )
                    : calculateTotalScore(activeJudgeSubmission)}{" "}
                  /{calculateMaxTotalScore(activeJudgeSubmission)}
                </span>
              </div>
            </div>

            {/* Submit Button - Only show for current user's submission */}
            {activeJudgeSubmission.judge?.id === user?.id && (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                {isLoading ? "Updating..." : "Update Evaluation"}
              </button>
            )}
          </div>
        ) : // Show empty form for new evaluation (only for assigned judges)
        isAssignedJudge ? (
          <div>
            <p className="mb-4 text-yellow-600">
              You haven't submitted an evaluation yet. Please fill out the form
              below.
            </p>

            {/* Create an empty form based on criteria from another judge's submission if available */}
            {judgeSubmissions.length > 0 &&
            judgeSubmissions[0].judgeSubmissionDetails ? (
              <div>
                {judgeSubmissions[0].judgeSubmissionDetails.map((detail) => (
                  <div
                    key={detail.roundMarkCriterion.id}
                    className="mb-4 p-3 bg-gray-50 rounded-lg"
                  >
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
                        value={
                          criteriaScores[detail.roundMarkCriterion.id] || 0
                        }
                        onChange={(e) =>
                          handleScoreChange(
                            detail.roundMarkCriterion.id,
                            Number(e.target.value)
                          )
                        }
                        className="w-20 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      {Object.values(criteriaScores).reduce(
                        (sum, score) => sum + score,
                        0
                      )}{" "}
                      /{calculateMaxTotalScore(judgeSubmissions[0])}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                >
                  {isLoading ? "Submitting..." : "Submit Evaluation"}
                </button>
              </div>
            ) : (
              <p className="text-red-500">No evaluation criteria available.</p>
            )}
          </div>
        ) : (
          // Not an assigned judge
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">
              You are not assigned as a judge for this team submission.
            </p>
          </div>
        )}
      </div>

      {/* Submission Files */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Submitted Files</h3>
        {submission.fileUrls && submission.fileUrls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submission.fileUrls?.map((file) => (
              <div
                key={file.id}
                className="border p-3 rounded flex items-center justify-between hover:bg-gray-50"
              >
                <span className="truncate">{file.fileName}</span>
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-2 flex-shrink-0"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No files have been submitted.</p>
        )}
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
