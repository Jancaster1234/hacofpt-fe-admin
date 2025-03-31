// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/HackathonResultsButton.tsx
import { useState } from "react";
import { Round } from "@/types/entities/round";
import { TeamRound } from "@/types/entities/teamRound";
import { Submission } from "@/types/entities/submission";
import {
  calculateTeamTotalScores,
  prepareHackathonResults,
} from "../_utils/hackathonResultHelpers";
import { createBulkHackathonResults } from "../_services/hackathonResultService";
import { HackathonResult } from "@/types/entities/hackathonResult";

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
  const [results, setResults] = useState<HackathonResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { teamScores, teamsWithMissingScores } = calculateTeamTotalScores(
    rounds,
    teamRounds,
    teamSubmissions
  );

  const isDisabled = teamsWithMissingScores.length > 0;

  const handleCreateResults = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const resultData = prepareHackathonResults(hackathonId, teamScores);
      const createdResults = await createBulkHackathonResults(
        hackathonId,
        resultData
      );

      setResults(createdResults);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to create hackathon results. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex flex-col space-y-2">
        <button
          onClick={handleCreateResults}
          disabled={isDisabled || isLoading}
          className={`px-4 py-2 rounded-md font-medium ${
            isDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Creating Results..." : "Create Hackathon Results"}
        </button>

        {isDisabled && (
          <p className="text-sm text-orange-600">
            <span className="font-medium">Note:</span> Cannot create results
            because the following teams are missing final scores:
            {teamsWithMissingScores.map((team, index) => (
              <span key={team}>
                {index > 0 ? ", " : " "}
                <span className="font-medium">{team}</span>
              </span>
            ))}
          </p>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {results && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <h4 className="font-medium text-green-800">
              Results Successfully Created!
            </h4>
            <p className="text-sm text-green-700 mt-1">
              Created results for {results.length} teams.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
