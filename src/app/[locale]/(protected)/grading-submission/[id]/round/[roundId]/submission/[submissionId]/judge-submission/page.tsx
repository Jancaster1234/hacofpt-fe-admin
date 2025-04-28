// src/app/[locale]/(protected)/grading-submission/[id]/round/[roundId]/submission/[submissionId]/judge-submission/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Submission } from "@/types/entities/submission";
import { TeamRound } from "@/types/entities/teamRound";
import { TeamRoundJudge } from "@/types/entities/teamRoundJudge";
import { RoundMarkCriterion } from "@/types/entities/roundMarkCriterion";
import { useAuth } from "@/hooks/useAuth_v0";
import { submissionService } from "@/services/submission.service";
import { teamRoundService } from "@/services/teamRound.service";
import { teamRoundJudgeService } from "@/services/teamRoundJudge.service";
import { judgeSubmissionService } from "@/services/judgeSubmission.service";
import { roundMarkCriterionService } from "@/services/roundMarkCriterion.service";
import { useApiModal } from "@/hooks/useApiModal";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function JudgeSubmissionPage() {
  const { id, roundId, submissionId } = useParams<{
    id: string;
    roundId: string;
    submissionId: string;
  }>();
  const router = useRouter();
  const { user } = useAuth();
  const t = useTranslations("judgeSubmission");
  const toast = useToast();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [teamRound, setTeamRound] = useState<TeamRound | null>(null);
  const [teamRoundJudges, setTeamRoundJudges] = useState<TeamRoundJudge[]>([]);
  const [roundMarkCriteria, setRoundMarkCriteria] = useState<
    RoundMarkCriterion[]
  >([]);
  const [activeJudgeIndex, setActiveJudgeIndex] = useState(-1);
  const [criteriaScores, setCriteriaScores] = useState<{
    [key: string]: number;
  }>({});
  const [criteriaFeedback, setCriteriaFeedback] = useState<{
    [key: string]: string;
  }>({});
  const [generalFeedback, setGeneralFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [judgeSubmissions, setJudgeSubmissions] = useState([]);
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
        const submissionResponse =
          await submissionService.getSubmissionById(submissionId);

        if (!submissionResponse.data) {
          // Don't use toast here since this is part of data initialization
          showError("Error", "Failed to load submission");
          return;
        }

        setSubmission(submissionResponse.data);

        // Store judge submissions separately for easier access
        const judgeSubmissionsData =
          submissionResponse.data.judgeSubmissions || [];
        setJudgeSubmissions(judgeSubmissionsData);

        // Step 2: Fetch round mark criteria
        if (submissionResponse.data.round?.id) {
          const roundMarkCriteriaResponse =
            await roundMarkCriterionService.getRoundMarkCriteriaByRoundId(
              submissionResponse.data.round.id
            );

          if (roundMarkCriteriaResponse.data) {
            setRoundMarkCriteria(roundMarkCriteriaResponse.data);

            // Initialize criteria scores and feedback with empty values
            const initialScores = {};
            const initialFeedback = {};
            roundMarkCriteriaResponse.data.forEach((criterion) => {
              initialScores[criterion.id] = 0;
              initialFeedback[criterion.id] = "";
            });
            setCriteriaScores(initialScores);
            setCriteriaFeedback(initialFeedback);
          }
        }

        // Step 3: Fetch team round data
        if (
          submissionResponse.data.round?.id &&
          submissionResponse.data.team?.id
        ) {
          const teamRoundResponse =
            await teamRoundService.getTeamRoundsByRoundIdAndTeamId(
              submissionResponse.data.round.id,
              submissionResponse.data.team.id
            );

          if (teamRoundResponse.data.length > 0) {
            // Get the latest team round
            const sortedTeamRounds = teamRoundResponse.data.sort((a, b) => {
              if (!a.createdAt) return 1;
              if (!b.createdAt) return -1;
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            });

            const latestTeamRound = sortedTeamRounds[0];
            setTeamRound(latestTeamRound);

            // Step 4: Fetch team round judges
            if (latestTeamRound.id) {
              const teamRoundJudgesResponse =
                await teamRoundJudgeService.getTeamRoundJudgesByTeamRoundId(
                  latestTeamRound.id
                );

              if (teamRoundJudgesResponse.data) {
                setTeamRoundJudges(teamRoundJudgesResponse.data);
              }
            }
          }
        }

        // Step 5: Check if current user has an existing submission
        const currentJudgeSubmission = judgeSubmissionsData.find(
          (js) => js.judge?.id === user.id
        );

        if (currentJudgeSubmission) {
          setExistingJudgeSubmissionId(currentJudgeSubmission.id);
          setGeneralFeedback(currentJudgeSubmission.note || "");

          // Set scores and feedback from existing submission
          const existingScores = {};
          const existingFeedback = {};
          currentJudgeSubmission.judgeSubmissionDetails?.forEach((jsd) => {
            existingScores[jsd.roundMarkCriterion.id] = jsd.score;
            existingFeedback[jsd.roundMarkCriterion.id] = jsd.note || "";
          });
          setCriteriaScores((prev) => ({ ...prev, ...existingScores }));
          setCriteriaFeedback((prev) => ({ ...prev, ...existingFeedback }));

          // Find index of current judge's submission
          const judgeIndex = judgeSubmissionsData.findIndex(
            (js) => js.judge?.id === user.id
          );
          if (judgeIndex !== -1) {
            setActiveJudgeIndex(judgeIndex);
          } else {
            // If no submission exists yet, select current judge's tab
            const currentJudgeTabIndex = teamRoundJudges.findIndex(
              (trj) => trj.judge?.id === user.id
            );
            if (currentJudgeTabIndex !== -1) {
              setActiveJudgeIndex(currentJudgeTabIndex);
            } else {
              setActiveJudgeIndex(0); // Default to first tab
            }
          }
        } else {
          // No existing submission, set to current judge's tab
          const currentJudgeTabIndex = teamRoundJudges.findIndex(
            (trj) => trj.judge?.id === user.id
          );

          if (currentJudgeTabIndex !== -1) {
            setActiveJudgeIndex(currentJudgeTabIndex);
          } else if (teamRoundJudges.length > 0) {
            setActiveJudgeIndex(0); // Default to first tab
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showError("Error", `Failed to load submission: ${error.message}`);
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

  const handleFeedbackChange = (criterionId: string, feedback: string) => {
    setCriteriaFeedback((prev) => ({
      ...prev,
      [criterionId]: feedback,
    }));
  };

  const calculateTotalScore = () => {
    return Object.values(criteriaScores).reduce((sum, score) => sum + score, 0);
  };

  const calculateMaxTotalScore = () => {
    return roundMarkCriteria.reduce(
      (sum, criterion) => sum + criterion.maxScore,
      0
    );
  };

  const handleSubmit = async () => {
    if (!user || !submission) return;

    try {
      setIsSubmitting(true);

      // Calculate total score from criteria scores
      const totalScore = calculateTotalScore();

      // Prepare judge submission details
      const judgeSubmissionDetails = Object.entries(criteriaScores).map(
        ([criterionId, score]) => ({
          roundMarkCriterionId: criterionId,
          score,
          note: criteriaFeedback[criterionId] || "",
        })
      );

      // Prepare submission data
      const submissionData = {
        judgeId: user.id,
        submissionId: submission.id,
        score: totalScore,
        note: generalFeedback,
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
          toast.success(response.message || t("evaluationUpdated"));
        }
      } else {
        response =
          await judgeSubmissionService.createJudgeSubmission(submissionData);

        if (response.data) {
          setExistingJudgeSubmissionId(response.data.id);
          toast.success(response.message || t("evaluationSubmitted"));
        }
      }

      // Refresh the submission data to show the updated judge submissions
      const updatedSubmission =
        await submissionService.getSubmissionById(submissionId);

      if (updatedSubmission.data) {
        setSubmission(updatedSubmission.data);
        setJudgeSubmissions(updatedSubmission.data.judgeSubmissions || []);

        // Set the active tab to the current judge's submission
        const currentJudgeSubmissionIndex =
          updatedSubmission.data.judgeSubmissions?.findIndex(
            (js) => js.judge?.id === user.id
          );

        if (currentJudgeSubmissionIndex !== -1) {
          setActiveJudgeIndex(currentJudgeSubmissionIndex);
        }
      }
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      toast.error(error.message || t("failedToSubmit"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if the current user is assigned as a judge to this team
  const isAssignedJudge = teamRoundJudges.some(
    (trj) => trj.judge?.id === user?.id
  );

  // Determine if current tab is the current user's tab
  const isCurrentUserTab = () => {
    if (activeJudgeIndex === -1) return false;

    const activeJudge = judgeSubmissions[activeJudgeIndex]?.judge;
    return activeJudge?.id === user?.id;
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64 dark:bg-gray-900 transition-colors duration-300">
        <LoadingSpinner size="lg" showText={true} />
      </div>
    );

  if (!submission)
    return (
      <div className="text-center text-red-500 dark:text-red-400 p-4 transition-colors duration-300">
        {t("submissionNotFound")}
      </div>
    );

  if (!teamRound)
    return (
      <div className="text-center text-red-500 dark:text-red-400 p-4 transition-colors duration-300">
        {t("teamRoundNotFound")}
      </div>
    );

  // Current active judge submission (if it exists)
  const activeJudgeSubmission = judgeSubmissions[activeJudgeIndex];

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <h1 className="text-xl md:text-2xl font-bold mb-4 dark:text-gray-100">
        {t("pageTitle")}
      </h1>

      {/* Submission Info */}
      <div className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm transition-colors duration-300">
        <h2 className="text-lg md:text-xl font-semibold dark:text-gray-100">
          {t("team")}: {submission.team?.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {t("round")}: {submission.round?.roundTitle}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          {t("status")}: {submission.status}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          {t("submitted")}: {new Date(submission.submittedAt).toLocaleString()}
        </p>

        {/* Display average score if multiple judges have submitted */}
        {judgeSubmissions.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <p className="font-medium dark:text-gray-200">
              {t("judges")}: {judgeSubmissions.length}/{teamRoundJudges.length}{" "}
              {t("submitted")}
            </p>
            {judgeSubmissions.length > 0 && (
              <p className="font-medium dark:text-gray-200">
                {t("averageScore")}:{" "}
                {(
                  judgeSubmissions.reduce(
                    (sum, js) => sum + (js.score || 0),
                    0
                  ) / judgeSubmissions.length
                ).toFixed(1)}{" "}
                / {calculateMaxTotalScore()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Judge Tabs - Horizontal scroll on mobile */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4 overflow-x-auto transition-colors duration-300">
        {teamRoundJudges.map((trj, index) => {
          // Find corresponding judgeSubmission if it exists
          const judgeSubmission = judgeSubmissions.find(
            (js) => js.judge?.id === trj.judge?.id
          );

          const isCurrentUser = trj.judge?.id === user?.id;
          const hasSubmitted = !!judgeSubmission;

          return (
            <button
              key={trj.id || index}
              onClick={() => {
                // If this judge has a submission, set the active index to it
                const submissionIndex = judgeSubmissions.findIndex(
                  (js) => js.judge?.id === trj.judge?.id
                );

                if (submissionIndex !== -1) {
                  setActiveJudgeIndex(submissionIndex);
                } else if (isCurrentUser) {
                  // For current user without submission, show their edit form
                  setActiveJudgeIndex(-1);
                }
              }}
              className={`px-3 py-2 md:px-4 md:py-2 whitespace-nowrap flex items-center transition-all duration-300 ${
                (judgeSubmission &&
                  judgeSubmissions.indexOf(judgeSubmission) ===
                    activeJudgeIndex) ||
                (!judgeSubmission &&
                  trj.judge?.id === user?.id &&
                  activeJudgeIndex === -1)
                  ? "text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              }`}
            >
              {trj.judge?.firstName} {trj.judge?.lastName}
              {isCurrentUser && (
                <span className="ml-1 text-green-500 dark:text-green-400 text-xs md:text-sm">
                  ({t("you")})
                </span>
              )}
              {hasSubmitted && (
                <span className="ml-1 text-blue-500 dark:text-blue-400">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Evaluation Form or View */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 md:p-6 transition-colors duration-300">
        <h2 className="text-lg md:text-xl font-semibold mb-4 dark:text-gray-100">
          {activeJudgeIndex !== -1 && activeJudgeSubmission
            ? `${t("evaluationBy")} ${activeJudgeSubmission.judge?.firstName} ${
                activeJudgeSubmission.judge?.lastName
              }`
            : t("yourEvaluation")}
        </h2>

        {activeJudgeIndex !== -1 &&
        activeJudgeSubmission &&
        !isCurrentUserTab() ? (
          // View another judge's submission (read-only)
          <div>
            {activeJudgeSubmission.judgeSubmissionDetails?.map((detail) => (
              <div
                key={detail.roundMarkCriterion.id}
                className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
                  <label className="font-medium dark:text-gray-200 mb-1 md:mb-0">
                    {detail.roundMarkCriterion.name}
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      ({t("max")}: {detail.roundMarkCriterion.maxScore})
                    </span>
                  </label>
                  <div className="flex items-center mt-1 md:mt-0">
                    <input
                      type="number"
                      value={detail.score}
                      className="w-20 p-2 border rounded focus:outline-none dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100 transition-colors duration-300"
                      disabled
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {detail.roundMarkCriterion.note}
                </p>
                {detail.note && (
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2 transition-colors duration-300">
                    <p className="text-sm font-medium dark:text-gray-200">
                      {t("judgesFeedback")}:
                    </p>
                    <p className="text-sm dark:text-gray-300">{detail.note}</p>
                  </div>
                )}
              </div>
            ))}

            {/* General Feedback */}
            {activeJudgeSubmission.note && (
              <div className="mt-4 mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
                <p className="font-medium mb-2 dark:text-gray-200">
                  {t("generalFeedback")}:
                </p>
                <p className="dark:text-gray-300">
                  {activeJudgeSubmission.note}
                </p>
              </div>
            )}

            {/* Total Score */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="flex justify-between items-center">
                <span className="font-bold dark:text-gray-200">
                  {t("totalScore")}:
                </span>
                <span className="text-xl font-bold dark:text-gray-200">
                  {activeJudgeSubmission.score} / {calculateMaxTotalScore()}
                </span>
              </div>
            </div>
          </div>
        ) : isAssignedJudge ? (
          // Show editable form for current judge (either new or existing submission)
          <div>
            {roundMarkCriteria.length > 0 ? (
              <div>
                {roundMarkCriteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300"
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
                      <label className="font-medium dark:text-gray-200 mb-1 md:mb-0">
                        {criterion.name}
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          ({t("max")}: {criterion.maxScore})
                        </span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={criterion.maxScore}
                        value={criteriaScores[criterion.id] || 0}
                        onChange={(e) =>
                          handleScoreChange(
                            criterion.id,
                            Number(e.target.value)
                          )
                        }
                        className="w-20 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 md:mt-0 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100 transition-colors duration-300"
                      />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {criterion.note}
                    </p>
                    <div>
                      <label className="text-sm font-medium dark:text-gray-200">
                        {t("feedbackForCriterion")}:
                      </label>
                      <textarea
                        value={criteriaFeedback[criterion.id] || ""}
                        onChange={(e) =>
                          handleFeedbackChange(criterion.id, e.target.value)
                        }
                        className="w-full mt-1 p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100 transition-colors duration-300"
                        rows={2}
                        placeholder={t("criterionFeedbackPlaceholder")}
                      />
                    </div>
                  </div>
                ))}

                {/* General Feedback */}
                <div className="mb-6">
                  <label className="block font-medium mb-2 dark:text-gray-200">
                    {t("generalFeedback")}:
                  </label>
                  <textarea
                    value={generalFeedback}
                    onChange={(e) => setGeneralFeedback(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100 transition-colors duration-300"
                    rows={4}
                    placeholder={t("generalFeedbackPlaceholder")}
                  />
                </div>

                {/* Total Score */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <div className="flex justify-between items-center">
                    <span className="font-bold dark:text-gray-200">
                      {t("totalScore")}:
                    </span>
                    <span className="text-xl font-bold dark:text-gray-200">
                      {calculateTotalScore()} / {calculateMaxTotalScore()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800 dark:disabled:bg-blue-500 transition-colors duration-300 flex justify-center items-center"
                >
                  {isSubmitting && (
                    <LoadingSpinner size="sm" className="mr-2" />
                  )}
                  {isSubmitting
                    ? existingJudgeSubmissionId
                      ? t("updating")
                      : t("submitting")
                    : existingJudgeSubmissionId
                      ? t("updateEvaluation")
                      : t("submitEvaluation")}
                </button>
              </div>
            ) : (
              <p className="text-red-500 dark:text-red-400 transition-colors duration-300">
                {t("noCriteriaAvailable")}
              </p>
            )}
          </div>
        ) : (
          // Not an assigned judge
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md transition-colors duration-300">
            <p className="text-red-600 dark:text-red-400">
              {t("notAssignedJudge")}
            </p>
          </div>
        )}
      </div>

      {/* Submission Files */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3 dark:text-gray-100">
          {t("submittedFiles")}
        </h3>
        {submission.fileUrls && submission.fileUrls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submission.fileUrls?.map((file) => (
              <div
                key={file.id}
                className="border border-gray-200 dark:border-gray-700 p-3 rounded flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <span className="truncate dark:text-gray-200">
                  {file.fileName}
                </span>
                <a
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-2 flex-shrink-0 transition-colors duration-300"
                >
                  {t("download")}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
            {t("noFilesSubmitted")}
          </p>
        )}
      </div>
    </div>
  );
}
