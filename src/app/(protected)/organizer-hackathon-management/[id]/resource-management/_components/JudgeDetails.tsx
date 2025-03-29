// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/JudgeDetails.tsx
import { JudgeSubmissionDetail } from "@/types/entities/judgeSubmissionDetail";

interface JudgeDetailsProps {
  judgeSubmissionDetails: JudgeSubmissionDetail[];
  showPopup: (type: string, id: string, note: string) => void;
}

export function JudgeDetails({
  judgeSubmissionDetails,
  showPopup,
}: JudgeDetailsProps) {
  return (
    <div className="mt-3 pl-10">
      <h6 className="text-xs font-medium text-gray-500 mb-2">
        Scoring Details
      </h6>
      <div className="space-y-2">
        {judgeSubmissionDetails.map((detail) => (
          <div
            key={detail.id}
            className="flex justify-between items-center py-1 border-b border-gray-100"
          >
            <div className="flex items-center">
              <p className="text-sm">
                {detail.roundMarkCriterion.name}
                <button
                  onClick={() =>
                    showPopup(
                      "criterionNote",
                      detail.roundMarkCriterion.id,
                      detail.roundMarkCriterion.note
                    )
                  }
                  className="ml-1 text-gray-400 hover:text-blue-500"
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
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                {detail.score} / {detail.roundMarkCriterion.maxScore}
              </span>
              <button
                onClick={() => showPopup("detailNote", detail.id, detail.note)}
                className="text-gray-400 hover:text-blue-500"
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
