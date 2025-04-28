// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/LatestSubmission.tsx
import { useState, useEffect } from "react";
import { Submission } from "@/types/entities/submission";
import { TeamRound } from "@/types/entities/teamRound";
import { JudgeEvaluations } from "./JudgeEvaluations";
import { TeamRoundStatusUpdate } from "./TeamRoundStatusUpdate";
import { formatDate, getLatestSubmission } from "../_utils/submissionHelpers";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";

interface LatestSubmissionProps {
  submissions: Submission[];
  teamRound: TeamRound;
  showPopup: (type: string, id: string, note: string) => void;
  refreshData: () => void;
}

export function LatestSubmission({
  submissions,
  teamRound,
  showPopup,
  refreshData,
}: LatestSubmissionProps) {
  const t = useTranslations("submissions");
  const toast = useToast();
  const [expandedJudgeSubmissions, setExpandedJudgeSubmissions] =
    useState(false);

  // Pass the round ID to get only submissions for this specific round
  const latestSubmission = getLatestSubmission(submissions, teamRound.roundId);

  console.log("LatestSubmission result:", latestSubmission);

  const toggleJudgeSubmissionsExpand = () => {
    setExpandedJudgeSubmissions(!expandedJudgeSubmissions);
  };

  if (!latestSubmission) {
    return (
      <div className="mt-4 transition-colors duration-200">
        <h4 className="font-medium text-gray-800 dark:text-gray-200">
          {t("latestSubmissionTitle")}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          {t("noSubmissionsYet")}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 transition-colors duration-200">
      <h4 className="font-medium text-gray-800 dark:text-gray-200">
        {t("latestSubmissionTitle")}
      </h4>
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md mt-2 shadow-sm transition-all duration-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <p className="text-sm text-gray-800 dark:text-gray-200">
              <span className="font-medium">{t("submitted")}:</span>{" "}
              {formatDate(latestSubmission.submittedAt)}
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-200">
              <span className="font-medium">{t("status")}:</span>{" "}
              <span
                className={`${
                  latestSubmission.status === "SUBMITTED"
                    ? "text-green-600 dark:text-green-400"
                    : "text-yellow-600 dark:text-yellow-400"
                }`}
              >
                {t(`status${latestSubmission.status}`)}
              </span>
            </p>
            {latestSubmission.finalScore !== undefined && (
              <p className="text-sm text-gray-800 dark:text-gray-200">
                <span className="font-medium">{t("finalScore")}:</span>{" "}
                {latestSubmission.finalScore}
              </p>
            )}
          </div>
          <button
            onClick={toggleJudgeSubmissionsExpand}
            className="px-3 py-1 text-sm bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded hover:bg-blue-300 dark:hover:bg-blue-700 transition-colors duration-200 mt-2 sm:mt-0 w-full sm:w-auto"
            aria-expanded={expandedJudgeSubmissions}
          >
            {expandedJudgeSubmissions
              ? t("hideJudgements")
              : `${t("judgeEvaluations")} (${latestSubmission.judgeSubmissions.length})`}
          </button>
        </div>

        {/* Files */}
        {latestSubmission.fileUrls && latestSubmission.fileUrls.length > 0 && (
          <div className="mt-2">
            <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
              {t("files")}:
            </p>
            <ul className="text-sm text-gray-700 dark:text-gray-300">
              {latestSubmission.fileUrls.map((file) => (
                <li key={file.id} className="flex items-center py-1">
                  <svg
                    className="w-4 h-4 mr-1 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  {file.fileName}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Judge Submissions */}
        {expandedJudgeSubmissions && (
          <div className="mt-2 transition-all duration-300">
            <JudgeEvaluations
              judgeSubmissions={latestSubmission.judgeSubmissions}
              showPopup={showPopup}
            />
          </div>
        )}

        {/* Team Round Status Update */}
        <TeamRoundStatusUpdate
          teamRound={teamRound}
          latestSubmission={latestSubmission}
          refreshData={refreshData}
        />
      </div>
    </div>
  );
}
