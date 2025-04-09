// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_utils/submissionHelpers.tsx

import { Submission } from "@/types/entities/submission";

/**
 * Formats a date string into a readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  // Check if date is invalid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  // Format: Mar 15, 2025, 2:30 PM
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

/**
 * Gets the latest submission from an array of submissions
 * @param submissions Array of submission objects
 * @param roundId Round ID to filter submissions by
 * @returns The most recent submitted submission or undefined if none
 */
export function getLatestSubmission(
  submissions: Submission[] | undefined,
  roundId: string
): Submission | undefined {
  if (!submissions || submissions.length === 0) {
    return undefined;
  }

  // Filter for only SUBMITTED status submissions that belong to this round
  const submittedRoundSubmissions = submissions.filter((submission) => {
    // Check if submission.status is SUBMITTED
    const statusMatches = submission.status === "SUBMITTED";

    // Check if roundId matches, handling both direct roundId and nested round.id
    const roundMatches =
      submission.roundId === roundId ||
      (submission.round && submission.round.id === roundId);

    return statusMatches && roundMatches;
  });

  if (submittedRoundSubmissions.length === 0) {
    return undefined;
  }

  // Sort by submission date (newest first)
  return submittedRoundSubmissions.sort((a, b) => {
    if (!a.submittedAt || !b.submittedAt) {
      return 0;
    }
    return (
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  })[0];
}

/**
 * Calculates average score from judge submissions
 * @param judgeSubmissions Array of judge submission objects
 * @returns Average score or undefined if no submissions
 */
export function calculateAverageScore(
  judgeSubmissions: any[]
): number | undefined {
  if (!judgeSubmissions || judgeSubmissions.length === 0) {
    return undefined;
  }

  const sum = judgeSubmissions.reduce((total, submission) => {
    return total + (submission.score || 0);
  }, 0);

  return parseFloat((sum / judgeSubmissions.length).toFixed(1));
}

/**
 * Determines status color class based on submission status
 * @param status Submission status string
 * @returns CSS class string for the status color
 */
export function getStatusColorClass(status: string): string {
  switch (status) {
    case "SUBMITTED":
      return "text-green-600";
    case "DRAFT":
      return "text-amber-600";
    case "REJECTED":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
}
