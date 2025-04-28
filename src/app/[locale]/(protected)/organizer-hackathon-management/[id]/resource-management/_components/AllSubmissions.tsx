// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/AllSubmissions.tsx
import { Submission } from "@/types/entities/submission";
import { formatDate } from "../_utils/submissionHelpers";
import { useTranslations } from "@/hooks/useTranslations";

interface AllSubmissionsProps {
  submissions: Submission[];
  roundId: string;
}

export function AllSubmissions({ submissions, roundId }: AllSubmissionsProps) {
  const t = useTranslations("submissions");

  // Filter submissions for this specific round
  const roundSubmissions = submissions.filter((sub) => sub.roundId === roundId);

  if (!roundSubmissions.length) {
    return (
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm transition-all duration-200">
        <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">
          {t("allSubmissionsTitle")}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          {t("noSubmissionsForRound")}
        </p>
      </div>
    );
  }

  // Sort submissions with SUBMITTED status first, then by submittedAt date
  const sortedSubmissions = [...roundSubmissions].sort((a, b) => {
    // Sort by status (SUBMITTED items first)
    if (a.status === "SUBMITTED" && b.status !== "SUBMITTED") return -1;
    if (a.status !== "SUBMITTED" && b.status === "SUBMITTED") return 1;

    // Then sort by submission date (newest first)
    if (a.submittedAt && b.submittedAt)
      return (
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
    return 0;
  });

  return (
    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md shadow-sm transition-all duration-200">
      <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">
        {t("allSubmissionsTitle")}
      </h4>
      <div className="space-y-2">
        {sortedSubmissions.map((submission) => (
          <div
            key={submission.id}
            className="p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <div>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  <span className="font-medium">{t("status")}:</span>{" "}
                  <span
                    className={`${
                      submission.status === "SUBMITTED"
                        ? "text-green-600 dark:text-green-400"
                        : "text-yellow-600 dark:text-yellow-400"
                    }`}
                  >
                    {t(`status${submission.status}`)}
                  </span>
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  <span className="font-medium">{t("createdBy")}:</span>{" "}
                  {submission.createdByUserName}
                </p>
                {submission.submittedAt && (
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    <span className="font-medium">{t("submitted")}:</span>{" "}
                    {formatDate(submission.submittedAt)}
                  </p>
                )}
                {submission.finalScore !== undefined && (
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    <span className="font-medium">{t("finalScore")}:</span>{" "}
                    {submission.finalScore}
                  </p>
                )}
              </div>
              <div className="mt-1 sm:mt-0">
                {submission.fileUrls && (
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    <span className="font-medium">{t("files")}:</span>{" "}
                    {submission.fileUrls.length}
                  </p>
                )}
                {submission.judgeSubmissions && (
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    <span className="font-medium">
                      {t("judgeEvaluations")}:
                    </span>{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      {submission.judgeSubmissions.length}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
