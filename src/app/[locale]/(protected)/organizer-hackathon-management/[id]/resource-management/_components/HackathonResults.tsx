// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/HackathonResults.tsx
"use client";
import React, { useState, useEffect } from "react";
import { HackathonResult } from "@/types/entities/hackathonResult";
import { hackathonResultService } from "@/services/hackathonResult.service";
import { useApiModal } from "@/hooks/useApiModal";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";

interface HackathonResultsProps {
  hackathonId: string;
}

export default function HackathonResults({
  hackathonId,
}: HackathonResultsProps) {
  const [results, setResults] = useState<HackathonResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useApiModal();
  const toast = useToast();
  const t = useTranslations("hackathonResults");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const { data, message } =
          await hackathonResultService.getHackathonResultsByHackathonId(
            hackathonId
          );

        if (data && data.length > 0) {
          // Sort results by totalScore (highest to lowest)
          const sortedResults = [...data].sort(
            (a, b) => b.totalScore - a.totalScore
          );
          setResults(sortedResults);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Error fetching hackathon results:", err);
        showError(t("resultsErrorTitle"), t("resultsErrorMessage"));
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [hackathonId, showError, t]);

  const getPlacementStyle = (placement: number) => {
    switch (placement) {
      case 1:
        return "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200";
      case 2:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
      case 3:
        return "bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200";
      default:
        return "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="md" showText />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 transition-colors duration-200">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
        {t("hackathonResults")}
      </h2>

      {results.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">{t("noResults")}</p>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:-mx-6">
          <div className="inline-block min-w-full px-4 sm:px-6">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("placement")}
                  </th>
                  <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("team")}
                  </th>
                  <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("teamLead")}
                  </th>
                  <th className="hidden md:table-cell py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("members")}
                  </th>
                  <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("score")}
                  </th>
                  <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("award")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {results.map((result) => (
                  <tr
                    key={result.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="py-2 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full 
                          ${getPlacementStyle(result.placement)}`}
                        >
                          {result.placement}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 sm:py-4 px-2 sm:px-4 font-medium text-sm text-gray-900 dark:text-gray-100">
                      {result.team.name}
                    </td>
                    <td className="py-2 sm:py-4 px-2 sm:px-4">
                      <div className="flex items-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden flex-shrink-0">
                          {result.team.teamLeader.avatarUrl && (
                            <Image
                              src={result.team.teamLeader.avatarUrl}
                              alt={`${result.team.teamLeader.firstName} ${result.team.teamLeader.lastName}`}
                              width={32}
                              height={32}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <div className="text-sm text-gray-900 dark:text-gray-100">{`${result.team.teamLeader.firstName} ${result.team.teamLeader.lastName}`}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                            {result.team.teamLeader.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell py-2 sm:py-4 px-2 sm:px-4 text-sm text-gray-700 dark:text-gray-300">
                      {result.team.teamMembers.length ? (
                        <div className="flex flex-col space-y-1">
                          {result.team.teamMembers.map((member) => (
                            <div key={member.id} className="text-xs sm:text-sm">
                              {`${member.user.firstName} ${member.user.lastName}`}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                          {t("noAdditionalMembers")}
                        </span>
                      )}
                    </td>
                    <td className="py-2 sm:py-4 px-2 sm:px-4 font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {result.totalScore}
                    </td>
                    <td className="py-2 sm:py-4 px-2 sm:px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200">
                        {result.award}
                      </span>
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
