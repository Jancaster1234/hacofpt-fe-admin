// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/AllSubmissions.tsx
import { Submission } from "@/types/entities/submission";
import { formatDate } from "../_utils/submissionHelpers";

interface AllSubmissionsProps {
  submissions: Submission[];
}

export function AllSubmissions({ submissions }: AllSubmissionsProps) {
  if (!submissions || submissions.length === 0) {
    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <h4 className="font-medium mb-2">All Submissions</h4>
        <p className="text-sm text-gray-500 italic">
          No submissions found for this team.
        </p>
      </div>
    );
  }

  const sortedSubmissions = [...submissions].sort((a, b) => {
    // Sort by submittedAt, with SUBMITTED items first
    if (a.status === "SUBMITTED" && b.status !== "SUBMITTED") return -1;
    if (a.status !== "SUBMITTED" && b.status === "SUBMITTED") return 1;
    if (a.submittedAt && b.submittedAt)
      return (
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
    return 0;
  });

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-md">
      <h4 className="font-medium mb-2">All Submissions</h4>
      <div className="space-y-2">
        {sortedSubmissions.map((submission) => (
          <div
            key={submission.id}
            className="p-2 bg-white rounded border border-gray-200"
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm">
                  <span className="font-medium">Status:</span>{" "}
                  {submission.status}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Created by:</span>{" "}
                  {submission.createdBy.firstName}{" "}
                  {submission.createdBy.lastName}
                </p>
                {submission.submittedAt && (
                  <p className="text-sm">
                    <span className="font-medium">Submitted:</span>{" "}
                    {formatDate(submission.submittedAt)}
                  </p>
                )}
                {submission.finalScore !== undefined && (
                  <p className="text-sm">
                    <span className="font-medium">Final Score:</span>{" "}
                    {submission.finalScore}
                  </p>
                )}
              </div>
              <div>
                {submission.fileUrls && (
                  <p className="text-sm">
                    <span className="font-medium">Files:</span>{" "}
                    {submission.fileUrls.length}
                  </p>
                )}
                {submission.judgeSubmissions && (
                  <p className="text-sm">
                    <span className="font-medium">Judge evaluations:</span>{" "}
                    {submission.judgeSubmissions.length}
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
