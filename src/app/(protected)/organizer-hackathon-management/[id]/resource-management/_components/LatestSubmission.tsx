// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/LatestSubmission.tsx
import { useState } from "react";
import { Submission } from "@/types/entities/submission";
import { TeamRound } from "@/types/entities/teamRound";
import { JudgeEvaluations } from "./JudgeEvaluations";
import { TeamRoundStatusUpdate } from "./TeamRoundStatusUpdate";
import { formatDate, getLatestSubmission } from "../_utils/submissionHelpers";

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
  const [expandedJudgeSubmissions, setExpandedJudgeSubmissions] =
    useState(false);

  // Add the debug log here
  console.log("LatestSubmission receiving submissions:", {
    teamId: teamRound.team.id,
    roundId: teamRound.roundId,
    submissions: submissions,
    submissionCount: submissions?.length || 0,
  });

  console.log("LatestSubmission props:", {
    submissions,
    teamRound,
    roundId: teamRound.roundId,
  });

  // Pass the round ID to get only submissions for this specific round
  const latestSubmission = getLatestSubmission(submissions, teamRound.roundId);

  console.log("LatestSubmission result:", latestSubmission);

  const toggleJudgeSubmissionsExpand = () => {
    setExpandedJudgeSubmissions(!expandedJudgeSubmissions);
  };

  if (!latestSubmission) {
    return (
      <div className="mt-4">
        <h4 className="font-medium text-gray-800">Latest Submission</h4>
        <p className="text-sm text-gray-500 italic">No submissions yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h4 className="font-medium text-gray-800">Latest Submission</h4>
      <div className="p-3 bg-blue-50 rounded-md mt-2">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">
              <span className="font-medium">Submitted:</span>{" "}
              {formatDate(latestSubmission.submittedAt)}
            </p>
            <p className="text-sm">
              <span className="font-medium">Status:</span>{" "}
              {latestSubmission.status}
            </p>
            {latestSubmission.finalScore !== undefined && (
              <p className="text-sm">
                <span className="font-medium">Final Score:</span>{" "}
                {latestSubmission.finalScore}
              </p>
            )}
          </div>
          <button
            onClick={toggleJudgeSubmissionsExpand}
            className="px-3 py-1 text-sm bg-blue-200 rounded hover:bg-blue-300"
          >
            {expandedJudgeSubmissions
              ? "Hide Judgements"
              : `Judge Evaluations (${latestSubmission.judgeSubmissions.length})`}
          </button>
        </div>

        {/* Files */}
        {latestSubmission.fileUrls && latestSubmission.fileUrls.length > 0 && (
          <div className="mt-2">
            <p className="font-medium text-sm">Files:</p>
            <ul className="text-sm text-gray-700">
              {latestSubmission.fileUrls.map((file) => (
                <li key={file.id} className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-gray-500"
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
          <JudgeEvaluations
            judgeSubmissions={latestSubmission.judgeSubmissions}
            showPopup={showPopup}
          />
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
