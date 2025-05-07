// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/JudgeAssign.tsx
import { useEffect, useState } from "react";
import Image from "next/image";
import { Round } from "@/types/entities/round";
import { TeamRound } from "@/types/entities/teamRound";
import { TeamRoundJudge } from "@/types/entities/teamRoundJudge";
import { JudgeRound } from "@/types/entities/judgeRound";
import { TeamMembersTooltip } from "./TeamMembersTooltip";
import { InfoTooltip } from "./InfoTooltip";
import { roundService } from "@/services/round.service";
import { teamRoundService } from "@/services/teamRound.service";
import { teamRoundJudgeService } from "@/services/teamRoundJudge.service";
import { judgeRoundService } from "@/services/judgeRound.service";
import { useApiModal } from "@/hooks/useApiModal";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function JudgeAssign({ hackathonId }: { hackathonId: string }) {
  const t = useTranslations("judgeAssign");
  const [rounds, setRounds] = useState<Round[]>([]);
  const [activeRoundId, setActiveRoundId] = useState<string | null>(null);
  const [teamRounds, setTeamRounds] = useState<{
    [roundId: string]: TeamRound[];
  }>({});
  const [teamRoundJudges, setTeamRoundJudges] = useState<{
    [teamRoundId: string]: TeamRoundJudge[];
  }>({});
  const [availableJudges, setAvailableJudges] = useState<{
    [roundId: string]: JudgeRound[];
  }>({});
  const [selectedTeamRound, setSelectedTeamRound] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [isAssigningJudge, setIsAssigningJudge] = useState<boolean>(false);
  const [isRemovingJudge, setIsRemovingJudge] = useState<boolean>(false);
  const [isRandomAssigning, setIsRandomAssigning] = useState<boolean>(false);
  const { showError, showSuccess } = useApiModal();
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch real rounds data
        const roundsResponse =
          await roundService.getRoundsByHackathonId(hackathonId);
        const roundsData = roundsResponse.data;
        setRounds(roundsData);

        if (roundsData.length > 0) {
          setActiveRoundId(roundsData[0].id);
        }

        // Fetch team rounds for each round
        const teamRoundsObj: { [roundId: string]: TeamRound[] } = {};
        const teamRoundJudgesObj: { [teamRoundId: string]: TeamRoundJudge[] } =
          {};
        const availableJudgesObj: { [roundId: string]: JudgeRound[] } = {};

        for (const round of roundsData) {
          // Fetch team rounds for this round
          const teamRoundsResponse =
            await teamRoundService.getTeamRoundsByRoundId(round.id);
          teamRoundsObj[round.id] = teamRoundsResponse.data;

          // Fetch judges available for this round
          const judgeRoundsResponse =
            await judgeRoundService.getJudgeRoundsByRoundId(round.id);
          availableJudgesObj[round.id] = judgeRoundsResponse.data;

          // Fetch judges for each team round
          for (const teamRound of teamRoundsResponse.data) {
            const judgesResponse =
              await teamRoundJudgeService.getTeamRoundJudgesByTeamRoundId(
                teamRound.id
              );
            teamRoundJudgesObj[teamRound.id] = judgesResponse.data;
          }
        }

        setTeamRounds(teamRoundsObj);
        setTeamRoundJudges(teamRoundJudgesObj);
        setAvailableJudges(availableJudgesObj);
      } catch (error) {
        console.error("Error fetching data:", error);
        showError(t("dataLoadingError"), t("failedToLoadHackathon"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Deliberately not including toast in dependencies to avoid infinite loops
  }, [hackathonId, showError, t]);

  const handleRemoveJudge = async (
    teamRoundJudgeId: string,
    teamRoundId: string,
    judgeId: string
  ) => {
    setIsRemovingJudge(true);
    try {
      const response = await teamRoundJudgeService.deleteTeamRoundJudge(
        teamRoundId,
        judgeId
      );

      if (response.message) {
        // Update local state to reflect removal
        setTeamRoundJudges((prev) => ({
          ...prev,
          [teamRoundId]: prev[teamRoundId].filter(
            (judge) => judge.id !== teamRoundJudgeId
          ),
        }));

        // Show toast notification for user action
        toast.success(response.message || t("judgeRemoved"));
      }
    } catch (error: any) {
      console.error("Error removing judge:", error);
      toast.error(error?.message || t("failedToRemoveJudge"));
    } finally {
      setIsRemovingJudge(false);
    }
  };

  const handleAssignJudge = async (
    judgeId: string,
    teamRoundId: string,
    roundId: string
  ) => {
    setIsAssigningJudge(true);
    try {
      const response = await teamRoundJudgeService.createTeamRoundJudge({
        teamRoundId,
        judgeId,
      });

      if (response.data) {
        // Update local state with the returned data from API
        setTeamRoundJudges((prev) => ({
          ...prev,
          [teamRoundId]: [...(prev[teamRoundId] || []), response.data],
        }));

        // Show toast notification for user action
        toast.success(response.message || t("judgeAssigned"));
      }
    } catch (error: any) {
      console.error("Error assigning judge:", error);
      toast.error(error?.message || t("failedToAssignJudge"));
    } finally {
      setIsAssigningJudge(false);
    }
  };

  const isJudgeAssignedToTeamRound = (
    judgeId: string,
    teamRoundId: string
  ): boolean => {
    return (
      teamRoundJudges[teamRoundId]?.some((trj) => trj.judge?.id === judgeId) ||
      false
    );
  };

  const handleRandomAssignment = async () => {
    if (!activeRoundId) return;

    setIsRandomAssigning(true);
    try {
      const eligibleTeamRounds = teamRounds[activeRoundId].filter(
        (tr) => tr.status !== "DISQUALIFIED_DUE_TO_VIOLATION"
      );

      const judges = availableJudges[activeRoundId] || [];
      if (judges.length === 0 || eligibleTeamRounds.length === 0) {
        toast.error(t("noJudgesOrTeamsAvailable"));
        return;
      }

      // Count current assignments for each judge
      const judgeAssignmentCount: Record<string, number> = {};
      judges.forEach((judge) => {
        const judgeId = judge.judge?.id;
        if (judgeId) {
          judgeAssignmentCount[judgeId] = 0;
        }
      });

      // Count existing assignments
      Object.values(teamRoundJudges).forEach((judgeAssignments) => {
        judgeAssignments.forEach((assignment) => {
          const judgeId = assignment.judge?.id;
          if (judgeId && judgeAssignmentCount[judgeId] !== undefined) {
            judgeAssignmentCount[judgeId]++;
          }
        });
      });

      // Create a balanced assignment plan
      const assignments: Array<{ teamRoundId: string; judgeId: string }> = [];

      // Sort judges by current assignment count (ascending)
      const sortedJudges = [...judges].sort((a, b) => {
        const countA = judgeAssignmentCount[a.judge?.id || ""] || 0;
        const countB = judgeAssignmentCount[b.judge?.id || ""] || 0;
        return countA - countB;
      });

      // For each team round, assign judges in order of who has fewest assignments
      for (const teamRound of eligibleTeamRounds) {
        const alreadyAssignedJudges = new Set(
          (teamRoundJudges[teamRound.id] || [])
            .map((trj) => trj.judge?.id)
            .filter(Boolean)
        );

        // Find the judge with the fewest assignments who isn't already assigned to this team
        for (const judge of sortedJudges) {
          const judgeId = judge.judge?.id;
          if (!judgeId) continue;

          if (!alreadyAssignedJudges.has(judgeId)) {
            assignments.push({
              teamRoundId: teamRound.id,
              judgeId: judgeId,
            });
            judgeAssignmentCount[judgeId]++;
            break;
          }
        }
      }

      // Execute the assignments in sequence
      let successCount = 0;
      let failCount = 0;

      for (const assignment of assignments) {
        try {
          await handleAssignJudge(
            assignment.judgeId,
            assignment.teamRoundId,
            activeRoundId
          );
          successCount++;
        } catch (error) {
          failCount++;
          console.error("Failed to assign judge:", error);
        }
      }

      if (successCount > 0) {
        toast.success(
          t("randomAssignmentComplete", {
            success: successCount,
            fail: failCount,
          })
        );
      } else if (failCount > 0) {
        toast.error(t("randomAssignmentFailed"));
      } else {
        toast.info(t("noNewAssignmentsNeeded"));
      }
    } catch (error) {
      console.error("Error in random assignment:", error);
      toast.error(t("randomAssignmentError"));
    } finally {
      setIsRandomAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center min-h-[200px] dark:bg-gray-800 dark:text-gray-200 transition-colors duration-300">
        <LoadingSpinner size="md" showText={true} />
      </div>
    );
  }

  return (
    <div className="transition-colors duration-300 dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4 px-1 md:px-2">
        <div className="flex space-x-2 overflow-x-auto border-b dark:border-gray-700 py-2 flex-grow">
          {rounds.map((round) => (
            <button
              key={round.id}
              className={`p-2 whitespace-nowrap transition-colors duration-200 ${
                activeRoundId === round.id
                  ? "border-b-2 border-green-500 text-green-500 dark:text-green-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              }`}
              onClick={() => setActiveRoundId(round.id)}
            >
              {round.roundTitle}
            </button>
          ))}
        </div>

        {activeRoundId && (
          <button
            onClick={handleRandomAssignment}
            disabled={isRandomAssigning}
            className="ml-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors duration-200 whitespace-nowrap flex items-center disabled:opacity-50"
          >
            {isRandomAssigning ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                {t("assigning")}
              </>
            ) : (
              t("randomlyAssignJudges")
            )}
          </button>
        )}
      </div>

      {activeRoundId && (
        <div className="space-y-4 md:space-y-6">
          {teamRounds[activeRoundId]?.map((teamRound) => {
            const isDisqualified =
              teamRound.status === "DISQUALIFIED_DUE_TO_VIOLATION";

            return (
              <div
                key={teamRound.id}
                className={`bg-white dark:bg-gray-700 p-3 md:p-4 rounded-lg shadow-md transition-all duration-300 ${
                  isDisqualified
                    ? "border-l-4 border-red-500 dark:border-red-400"
                    : ""
                }`}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-md md:text-lg font-medium text-gray-800 dark:text-gray-200">
                        {t("team")}:{" "}
                        {teamRound.team?.name || `ID: ${teamRound.teamId}`}
                      </h3>
                      <TeamMembersTooltip teamId={teamRound.teamId || ""} />
                    </div>

                    <div className="flex items-center mt-1">
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mr-2">
                        {t("status")}:{" "}
                        {t(teamRound.status?.toLowerCase() || "pending")}
                      </p>
                      <InfoTooltip
                        title={t("teamRoundStatus")}
                        content={t("teamRoundStatusDescription")}
                      />
                    </div>

                    <div className="flex items-center mt-1">
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mr-2">
                        {t("description")}:
                      </p>
                      <InfoTooltip
                        title={t("description")}
                        content={t("descriptionTooltip")}
                      />
                    </div>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-1">
                      {teamRound.description || t("noDescriptionProvided")}
                    </p>
                  </div>

                  {!isDisqualified && (
                    <button
                      onClick={() => {
                        setSelectedTeamRound(
                          selectedTeamRound === teamRound.id
                            ? null
                            : teamRound.id
                        );
                      }}
                      className="mt-3 md:mt-0 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                    >
                      {selectedTeamRound === teamRound.id
                        ? t("cancel")
                        : t("assignJudges")}
                    </button>
                  )}
                </div>

                <div className="mt-3 md:mt-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                    {t("assignedJudges")}:
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {teamRoundJudges[teamRound.id]?.length ? (
                      teamRoundJudges[teamRound.id].map((teamRoundJudge) => (
                        <div
                          key={teamRoundJudge.id}
                          className="flex items-center bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-2 md:px-3 py-1 rounded-full shadow-sm transition-colors duration-200"
                        >
                          {teamRoundJudge.judge?.avatarUrl ? (
                            <Image
                              src={teamRoundJudge.judge.avatarUrl}
                              alt={teamRoundJudge.judge.firstName || ""}
                              width={24}
                              height={24}
                              className="w-5 h-5 md:w-6 md:h-6 rounded-full mr-1 md:mr-2"
                            />
                          ) : (
                            <span className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-gray-300 dark:bg-gray-500 text-xs rounded-full mr-1 md:mr-2">
                              {teamRoundJudge.judge?.firstName?.[0] || "?"}
                            </span>
                          )}
                          <span className="text-xs md:text-sm font-medium">
                            {teamRoundJudge.judge?.firstName}{" "}
                            {teamRoundJudge.judge?.lastName}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 md:ml-2 hidden sm:inline">
                            {teamRoundJudge.judge?.email || ""}
                          </span>
                          {!isDisqualified && (
                            <button
                              onClick={() =>
                                handleRemoveJudge(
                                  teamRoundJudge.id,
                                  teamRound.id,
                                  teamRoundJudge.judge?.id || ""
                                )
                              }
                              disabled={isRemovingJudge}
                              className="ml-1 md:ml-2 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold disabled:opacity-50 transition-colors duration-200"
                            >
                              {isRemovingJudge ? "..." : "✕"}
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {t("noJudgesAssigned")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Show available judges for this team round */}
                {selectedTeamRound === teamRound.id && !isDisqualified && (
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600 transition-colors duration-200">
                    <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("availableJudges")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {availableJudges[activeRoundId]?.length > 0 ? (
                        availableJudges[activeRoundId].map((judgeRound) => {
                          const judgeId = judgeRound.judge?.id;
                          if (!judgeId) return null;

                          const isAssigned = isJudgeAssignedToTeamRound(
                            judgeId,
                            teamRound.id
                          );

                          return (
                            <div
                              key={judgeRound.id}
                              className={`flex items-center ${
                                isAssigned
                                  ? "bg-green-100 dark:bg-green-800/30"
                                  : "bg-gray-50 dark:bg-gray-600/50"
                              } text-gray-800 dark:text-gray-200 px-2 md:px-3 py-1 rounded-full shadow-sm transition-all duration-200`}
                            >
                              {judgeRound.judge?.avatarUrl ? (
                                <Image
                                  src={judgeRound.judge.avatarUrl}
                                  alt={judgeRound.judge.firstName || ""}
                                  width={24}
                                  height={24}
                                  className="w-5 h-5 md:w-6 md:h-6 rounded-full mr-1 md:mr-2"
                                />
                              ) : (
                                <span className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-gray-300 dark:bg-gray-500 text-xs rounded-full mr-1 md:mr-2">
                                  {judgeRound.judge?.firstName?.[0] || "?"}
                                </span>
                              )}
                              <span className="text-xs md:text-sm font-medium">
                                {judgeRound.judge?.firstName}{" "}
                                {judgeRound.judge?.lastName}
                              </span>
                              <button
                                onClick={() => {
                                  if (isAssigned) {
                                    const teamRoundJudge = teamRoundJudges[
                                      teamRound.id
                                    ]?.find((trj) => trj.judge?.id === judgeId);
                                    if (teamRoundJudge) {
                                      handleRemoveJudge(
                                        teamRoundJudge.id,
                                        teamRound.id,
                                        judgeId
                                      );
                                    }
                                  } else {
                                    handleAssignJudge(
                                      judgeId,
                                      teamRound.id,
                                      activeRoundId
                                    );
                                  }
                                }}
                                disabled={isAssigningJudge || isRemovingJudge}
                                className={`ml-1 md:ml-2 text-xs ${
                                  isAssigned
                                    ? "text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                    : "text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                } font-medium disabled:opacity-50 transition-colors duration-200`}
                              >
                                {isAssigningJudge || isRemovingJudge
                                  ? "..."
                                  : isAssigned
                                    ? t("remove")
                                    : t("assign")}
                              </button>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {t("noJudgesAvailable")}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
