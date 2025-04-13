// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/BulkTeamRoundUpdate.tsx
import { useState } from "react";
import { teamRoundService } from "@/services/teamRound.service";
import { TeamRound } from "@/types/entities/teamRound";
import { Submission } from "@/types/entities/submission";
import { useApiModal } from "@/hooks/useApiModal";
import { getLatestSubmission } from "../_utils/submissionHelpers";

interface BulkTeamRoundUpdateProps {
  selectedRoundId: string | null;
  teamRounds: {
    [roundId: string]: TeamRound[];
  };
  teamSubmissions: {
    [teamId: string]: Submission[];
  };
  refreshData: () => void;
}

export function BulkTeamRoundUpdate({
  selectedRoundId,
  teamRounds,
  teamSubmissions,
  refreshData,
}: BulkTeamRoundUpdateProps) {
  const [numTeamsToProceed, setNumTeamsToProceed] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const { showSuccess, showError } = useApiModal();

  if (!selectedRoundId || !teamRounds[selectedRoundId]) {
    return null;
  }

  // Filter and prepare teams for evaluation
  const eligibleTeams = teamRounds[selectedRoundId]
    .filter((teamRound) => {
      // Exclude teams with DISQUALIFIED_DUE_TO_VIOLATION or PENDING status
      if (
        teamRound.status === "DISQUALIFIED_DUE_TO_VIOLATION" ||
        teamRound.status === "PENDING"
      ) {
        return false;
      }

      // Get the latest submission for this team
      const teamId = teamRound.teamId || teamRound.team?.id;
      if (!teamId) return false;

      const submissions = teamSubmissions[teamId] || [];
      const latestSubmission = getLatestSubmission(
        submissions,
        teamRound.roundId
      );

      // Check if the latest submission has a final score
      return latestSubmission && latestSubmission.finalScore !== undefined;
    })
    .map((teamRound) => {
      const teamId = teamRound.teamId || teamRound.team?.id || "";
      const submissions = teamSubmissions[teamId] || [];
      const latestSubmission = getLatestSubmission(
        submissions,
        teamRound.roundId
      );

      return {
        teamRound,
        score: latestSubmission?.finalScore || 0,
        teamName: teamRound.team?.name || "",
      };
    });

  // Sort by score (highest first)
  eligibleTeams.sort((a, b) => b.score - a.score);

  const teamsWithoutFinalScores = teamRounds[selectedRoundId].filter(
    (teamRound) => {
      const teamId = teamRound.teamId || teamRound.team?.id;
      if (!teamId) return false;

      const submissions = teamSubmissions[teamId] || [];
      const latestSubmission = getLatestSubmission(
        submissions,
        teamRound.roundId
      );

      return !latestSubmission || latestSubmission.finalScore === undefined;
    }
  );

  const isButtonDisabled =
    eligibleTeams.length === 0 ||
    teamsWithoutFinalScores.length > 0 ||
    numTeamsToProceed <= 0 ||
    numTeamsToProceed > eligibleTeams.length ||
    isUpdating;

  const handleBulkUpdate = async () => {
    if (isButtonDisabled) return;

    setIsUpdating(true);
    try {
      // Prepare teams to be passed
      const passTeams = eligibleTeams
        .slice(0, numTeamsToProceed)
        .map((item) => ({
          id: item.teamRound.id,
          teamId: item.teamRound.teamId || item.teamRound.team?.id || "",
          roundId: selectedRoundId,
          status: "PASSED" as const,
        }));

      // Prepare teams to be failed
      const failTeams = eligibleTeams
        .slice(numTeamsToProceed)
        .filter((item) => item.teamRound.status === "AWAITING_JUDGING")
        .map((item) => ({
          id: item.teamRound.id,
          teamId: item.teamRound.teamId || item.teamRound.team?.id || "",
          roundId: selectedRoundId,
          status: "FAILED" as const,
        }));

      // Combine all updates
      const allUpdates = [...passTeams, ...failTeams];

      if (allUpdates.length > 0) {
        const response = await teamRoundService.updateBulkTeamRounds(
          allUpdates
        );

        if (response.data) {
          showSuccess(
            "Teams Updated",
            `Successfully updated ${passTeams.length} teams to PASSED and ${failTeams.length} teams to FAILED`
          );
          refreshData();
        }
      }
    } catch (error) {
      console.error("Error updating team rounds in bulk:", error);
      showError(
        "Bulk Update Failed",
        "Failed to update team statuses. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-800 mb-3">
        Bulk Status Update
      </h3>

      {teamsWithoutFinalScores.length > 0 ? (
        <div className="text-sm text-red-600 mb-3">
          <p>
            <strong>Note:</strong> Cannot perform bulk update because{" "}
            {teamsWithoutFinalScores.length} teams are missing final scores.
          </p>
        </div>
      ) : eligibleTeams.length === 0 ? (
        <div className="text-sm text-red-600 mb-3">
          <p>
            <strong>Note:</strong> No eligible teams found for bulk update.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Number of Teams to Pass (Top Scores)
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="number"
                min="1"
                max={eligibleTeams.length}
                value={numTeamsToProceed || ""}
                onChange={(e) =>
                  setNumTeamsToProceed(parseInt(e.target.value) || 0)
                }
                className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                placeholder="Enter number of teams"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Total eligible teams: {eligibleTeams.length}
            </p>
          </div>

          {numTeamsToProceed > 0 && (
            <div className="text-sm">
              <p>
                This will mark the top {numTeamsToProceed} teams as PASSED, and
                remaining AWAITING_JUDGING teams as FAILED.
              </p>
              <p className="mt-1 text-gray-500">
                Teams already marked as PASSED or FAILED will maintain their
                status.
              </p>
            </div>
          )}

          <button
            onClick={handleBulkUpdate}
            disabled={isButtonDisabled}
            className={`px-4 py-2 rounded-md font-medium ${
              isButtonDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isUpdating ? "Updating..." : "Update Team Statuses"}
          </button>
        </div>
      )}

      {eligibleTeams.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2">Team Score Rankings</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {eligibleTeams.map((team, index) => (
                  <tr
                    key={team.teamRound.id}
                    className={index < numTeamsToProceed ? "bg-green-50" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {team.teamName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {team.score.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {team.teamRound.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
