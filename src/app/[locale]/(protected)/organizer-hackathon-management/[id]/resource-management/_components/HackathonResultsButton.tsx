// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/HackathonResultsButton.tsx
import { useState } from "react";
import { Round } from "@/types/entities/round";
import { TeamRound } from "@/types/entities/teamRound";
import { Submission } from "@/types/entities/submission";
import { hackathonResultService } from "@/services/hackathonResult.service";
import {
  calculateTeamTotalScores,
  prepareHackathonResults,
} from "../_utils/hackathonResultHelpers";
import { useApiModal } from "@/hooks/useApiModal";

interface HackathonResultsButtonProps {
  hackathonId: string;
  rounds: Round[];
  teamRounds: { [roundId: string]: TeamRound[] };
  teamSubmissions: { [teamId: string]: Submission[] };
}

export function HackathonResultsButton({
  hackathonId,
  rounds,
  teamRounds,
  teamSubmissions,
}: HackathonResultsButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useApiModal();

  // Calculate team scores and check for missing data
  const { teamScores, teamsWithMissingScores } = calculateTeamTotalScores(
    rounds,
    teamRounds,
    teamSubmissions
  );

  const hasAllScores =
    teamsWithMissingScores.length === 0 && teamScores.length > 0;

  const handleCreateResults = async () => {
    if (!hasAllScores) return;

    setIsLoading(true);

    try {
      // Prepare the data for the API call
      const resultData = prepareHackathonResults(hackathonId, teamScores);

      // Make the API call
      const results = await hackathonResultService.createBulkHackathonResults(
        resultData
      );

      if (results.data && results.data.length > 0) {
        showSuccess(
          "Results Created",
          results.message || "Hackathon results have been successfully created!"
        );
      } else {
        showError(
          "Results Creation Issue",
          "The results were processed but no data was returned. Please verify results in the system."
        );
      }
    } catch (err) {
      console.error("Error creating hackathon results:", err);
      showError(
        "Results Creation Failed",
        "Failed to create hackathon results. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col space-y-2">
        <button
          onClick={handleCreateResults}
          disabled={!hasAllScores || isLoading}
          className={`px-4 py-2 rounded-md font-medium ${
            hasAllScores
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Creating..." : "Create Hackathon Results"}
        </button>

        {teamsWithMissingScores.length > 0 && (
          <div className="text-sm text-red-600">
            <p>
              <strong>Note:</strong> Cannot create results because the following
              teams are missing final scores:
              {" " + teamsWithMissingScores.join(", ")}
            </p>
          </div>
        )}
      </div>

      {teamScores.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2">Preview of Team Rankings</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Placement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamScores.map((team, index) => (
                  <tr key={team.teamId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {team.teamName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {team.totalScore.toFixed(1)}
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
