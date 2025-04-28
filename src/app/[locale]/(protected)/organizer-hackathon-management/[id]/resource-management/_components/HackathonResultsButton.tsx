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
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/useTranslations";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
  const toast = useToast();
  const t = useTranslations("hackathonResults");

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
      const results =
        await hackathonResultService.createBulkHackathonResults(resultData);

      if (results.data && results.data.length > 0) {
        toast.success(results.message || t("resultsCreatedSuccess"));
      } else {
        toast.error(t("resultsCreationIssue"));
      }
    } catch (err) {
      console.error("Error creating hackathon results:", err);
      toast.error((err as any)?.message || t("resultsCreationFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3 transition-colors duration-300">
      <div className="flex flex-col space-y-2">
        <button
          onClick={handleCreateResults}
          disabled={!hasAllScores || isLoading}
          className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            hasAllScores
              ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 focus:ring-blue-500 dark:focus:ring-blue-400"
              : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          }`}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              {t("creating")}
            </>
          ) : (
            t("createHackathonResults")
          )}
        </button>

        {teamsWithMissingScores.length > 0 && (
          <div className="text-sm text-red-600 dark:text-red-400 mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
            <p>
              <strong>{t("note")}:</strong> {t("cannotCreateResults")}
              {" " + teamsWithMissingScores.join(", ")}
            </p>
          </div>
        )}
      </div>

      {teamScores.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2 text-gray-900 dark:text-gray-100">
            {t("previewTeamRankings")}
          </h4>
          <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t("placement")}
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t("team")}
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t("totalScore")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {teamScores.map((team, index) => (
                  <tr
                    key={team.teamId}
                    className={
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-900"
                        : "bg-gray-50 dark:bg-gray-800/50"
                    }
                  >
                    <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {index + 1}
                    </td>
                    <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {team.teamName}
                    </td>
                    <td className="px-4 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
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
