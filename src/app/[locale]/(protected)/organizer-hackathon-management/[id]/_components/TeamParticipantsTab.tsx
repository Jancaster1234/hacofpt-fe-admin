// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/_components/TeamParticipantsTab.tsx
"use client";

import { useState, useEffect } from "react";
import { teamService } from "@/services/team.service";
import { Team } from "@/types/entities/team";
import Image from "next/image";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export function TeamParticipantsTab({ hackathonId }: { hackathonId: string }) {
  const t = useTranslations("teams");
  const { error: showError } = useToast(); // Destructure the error function

  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchTeams = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await teamService.getTeamsByHackathonId(hackathonId);

        if (!isCancelled) {
          setTeams(response.data || []);
        }
      } catch (err) {
        console.error("Error fetching teams:", err);
        if (!isCancelled) {
          const errorMessage = t("failedToLoadTeams");
          setError(errorMessage);
          showError(errorMessage); // Use the destructured error function
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchTeams();

    return () => {
      isCancelled = true;
    };
  }, [hackathonId, t, showError]); // Add showError to dependencies

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8 transition-colors duration-300">
        <LoadingSpinner size="md" showText={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 dark:text-red-400 py-4 transition-colors duration-300">
        {error}
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="py-4 text-gray-700 dark:text-gray-300 transition-colors duration-300">
        {t("noTeamsRegistered")}
      </div>
    );
  }

  return (
    <div className="transition-colors duration-300">
      <h3 className="text-xl font-medium mb-4 text-gray-900 dark:text-gray-100">
        {t("registeredTeams")} ({teams.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="border dark:border-gray-700 rounded-lg p-3 sm:p-4 shadow-sm 
                     bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {team.name}
              </h4>
              <span className="text-xs sm:text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded transition-colors duration-300">
                {team.teamMembers.length} {t("members")}
              </span>
            </div>

            {team.bio && (
              <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm sm:text-base">
                {team.bio}
              </p>
            )}

            <div className="border-t dark:border-gray-700 pt-3 transition-colors duration-300">
              <h5 className="font-medium mb-2 text-gray-800 dark:text-gray-200">
                {t("teamMembers")}:
              </h5>
              <ul className="space-y-2">
                {team.teamMembers.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center gap-3 transition-colors duration-300"
                  >
                    {member.user && member.user.avatarUrl ? (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={member.user.avatarUrl}
                          alt={`${member.user.firstName || ""} ${member.user.lastName || ""}`}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {member.user && member.user.firstName
                            ? member.user.firstName.charAt(0)
                            : ""}
                          {member.user && member.user.lastName
                            ? member.user.lastName.charAt(0)
                            : ""}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 dark:text-gray-100 flex flex-wrap items-center gap-1">
                        <span className="truncate">
                          {member.user
                            ? `${member.user.firstName || ""} ${member.user.lastName || ""}`
                            : t("unknownUser")}
                        </span>
                        {team.teamLeader &&
                          member.user &&
                          team.teamLeader.id === member.user.id && (
                            <span className="ml-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-0.5 rounded whitespace-nowrap">
                              {t("teamLeader")}
                            </span>
                          )}
                      </div>
                      {member.user && (
                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                          {member.user.email} • @{member.user.username}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
