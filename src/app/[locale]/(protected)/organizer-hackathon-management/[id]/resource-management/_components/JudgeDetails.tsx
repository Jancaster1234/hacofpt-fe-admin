// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/JudgeDetails.tsx
import { JudgeSubmissionDetail } from "@/types/entities/judgeSubmissionDetail";
import { useTranslations } from "@/hooks/useTranslations";

interface JudgeDetailsProps {
  judgeSubmissionDetails: JudgeSubmissionDetail[];
  showPopup: (type: string, id: string, note: string) => void;
}

export function JudgeDetails({
  judgeSubmissionDetails,
  showPopup,
}: JudgeDetailsProps) {
  const t = useTranslations("judging");

  return (
    <div className="mt-3 pl-2 sm:pl-10 transition-all duration-200">
      <h6 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
        {t("scoringDetails")}
      </h6>
      <div className="space-y-2">
        {judgeSubmissionDetails.map((detail) => (
          <div
            key={detail.id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1 border-b border-gray-100 dark:border-gray-700 transition-colors duration-200"
          >
            <div className="flex items-center">
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                {detail.roundMarkCriterion.name}
                <button
                  onClick={() =>
                    showPopup(
                      "criterionNote",
                      detail.roundMarkCriterion.id,
                      detail.roundMarkCriterion.note
                    )
                  }
                  className="ml-1 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition-colors duration-200"
                  aria-label={t("viewCriterionNote")}
                >
                  <svg
                    className="w-4 h-4 inline"
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
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-1 sm:mt-0">
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                {detail.score} / {detail.roundMarkCriterion.maxScore}
              </span>
              <button
                onClick={() => showPopup("detailNote", detail.id, detail.note)}
                className="text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition-colors duration-200"
                aria-label={t("viewDetailNote")}
              >
                <svg
                  className="w-4 h-4"
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
