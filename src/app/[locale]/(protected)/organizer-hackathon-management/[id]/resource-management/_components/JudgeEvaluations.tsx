// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/JudgeEvaluations.tsx
import { useState } from "react";
import { JudgeSubmission } from "@/types/entities/judgeSubmission";
import { JudgeDetails } from "./JudgeDetails";
import { useTranslations } from "@/hooks/useTranslations";

interface JudgeEvaluationsProps {
  judgeSubmissions: JudgeSubmission[];
  showPopup: (type: string, id: string, note: string) => void;
}

export function JudgeEvaluations({
  judgeSubmissions,
  showPopup,
}: JudgeEvaluationsProps) {
  const [expandedJudgeDetails, setExpandedJudgeDetails] = useState<{
    [key: string]: boolean;
  }>({});
  const t = useTranslations("judging");

  const toggleJudgeDetailsExpand = (judgeSubmissionId: string) => {
    setExpandedJudgeDetails((prev) => ({
      ...prev,
      [judgeSubmissionId]: !prev[judgeSubmissionId],
    }));
  };

  return (
    <div className="mt-3 space-y-3 transition-all duration-200">
      <h5 className="font-medium text-xs sm:text-sm border-b border-gray-200 dark:border-gray-700 pb-1 text-gray-800 dark:text-gray-200">
        {t("judgeEvaluations")}
      </h5>

      {judgeSubmissions.length === 0 ? (
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic">
          {t("noJudgeEvaluations")}
        </p>
      ) : (
        judgeSubmissions.map((judgeSubmission) => (
          <div
            key={judgeSubmission.id}
            className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-300 dark:bg-gray-600 text-xs rounded-full mr-2 text-gray-800 dark:text-gray-200">
                  {judgeSubmission.judge.firstName[0]}
                  {judgeSubmission.judge.lastName[0]}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                    {judgeSubmission.judge.firstName}{" "}
                    {judgeSubmission.judge.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {judgeSubmission.judge.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <span className="font-bold text-base sm:text-lg text-gray-800 dark:text-gray-200">
                  {judgeSubmission.score}
                </span>
                <button
                  onClick={() =>
                    showPopup(
                      "judgeNote",
                      judgeSubmission.id,
                      judgeSubmission.note
                    )
                  }
                  className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                  title={t("viewJudgeNote")}
                  aria-label={t("viewJudgeNote")}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </button>
                <button
                  onClick={() => toggleJudgeDetailsExpand(judgeSubmission.id)}
                  className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                  title={t("viewScoringDetails")}
                  aria-label={t("viewScoringDetails")}
                  aria-expanded={
                    expandedJudgeDetails[judgeSubmission.id] || false
                  }
                >
                  {expandedJudgeDetails[judgeSubmission.id] ? (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 15l7-7 7 7"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Judge Submission Details */}
            {expandedJudgeDetails[judgeSubmission.id] && (
              <JudgeDetails
                judgeSubmissionDetails={judgeSubmission.judgeSubmissionDetails}
                showPopup={showPopup}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
