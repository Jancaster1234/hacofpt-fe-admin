// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/AssignJudgeToRound.tsx
import { useEffect, useState } from "react";
import Image from "next/image";
import { Round } from "@/types/entities/round";
import { JudgeRound } from "@/types/entities/judgeRound";
import { UserHackathon } from "@/types/entities/userHackathon";
import { roundService } from "@/services/round.service";
import { judgeRoundService } from "@/services/judgeRound.service";
import { userHackathonService } from "@/services/userHackathon.service";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AssignJudgeToRound({
  hackathonId,
}: {
  hackathonId: string;
}) {
  const t = useTranslations("judgeManagement");
  const toast = useToast();

  const [rounds, setRounds] = useState<Round[]>([]);
  const [roundJudges, setRoundJudges] = useState<{
    [roundId: string]: JudgeRound[];
  }>({});
  const [availableJudges, setAvailableJudges] = useState<UserHackathon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<{
    status: boolean;
    judgeId?: string;
    roundId?: string;
  }>({ status: false });
  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState<boolean>(false);

  // Remove toast from the dependency array in useEffect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch rounds
        const roundsResponse =
          await roundService.getRoundsByHackathonId(hackathonId);
        if (!roundsResponse.data || roundsResponse.data.length === 0) {
          //toast.info(t("noRoundsFound"));
          setLoading(false);
          return;
        }
        setRounds(roundsResponse.data);

        // Fetch judges for each round
        const judgesPromises = roundsResponse.data.map((round) =>
          judgeRoundService.getJudgeRoundsByRoundId(round.id)
        );
        const judgesResults = await Promise.all(judgesPromises);

        const newRoundJudges: { [roundId: string]: JudgeRound[] } = {};
        roundsResponse.data.forEach((round, index) => {
          newRoundJudges[round.id] = judgesResults[index].data || [];
        });
        setRoundJudges(newRoundJudges);

        // Fetch available judges (users with JUDGE role)
        const userHackathonsResponse =
          await userHackathonService.getUserHackathonsByRole(
            hackathonId,
            "JUDGE"
          );
        setAvailableJudges(userHackathonsResponse.data || []);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast.error(error.message || t("dataFetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Remove toast from dependency array
  }, [hackathonId, t]);

  const handleRemoveJudge = async (judgeId: string, roundId: string) => {
    setIsProcessing({ status: true, judgeId, roundId });
    try {
      const response = await judgeRoundService.deleteJudgeRoundByJudgeAndRound(
        judgeId,
        roundId
      );

      // Update the local state to reflect the removal
      setRoundJudges((prev) => ({
        ...prev,
        [roundId]: prev[roundId].filter((jr) => jr.judge.id !== judgeId),
      }));

      toast.success(response.message || t("judgeRemoved"));
    } catch (error: any) {
      console.error("Error removing judge:", error);
      toast.error(error.message || t("judgeRemoveError"));
    } finally {
      setIsProcessing({ status: false });
    }
  };

  const handleAssignJudge = async (judgeId: string, roundId: string) => {
    setIsProcessing({ status: true, judgeId, roundId });
    try {
      const response = await judgeRoundService.createJudgeRound({
        judgeId,
        roundId,
      });

      if (response.data) {
        // Get the judge rounds for this round again to refresh state
        const updatedJudgeRoundsResponse =
          await judgeRoundService.getJudgeRoundsByRoundId(roundId);

        // Update the local state
        setRoundJudges((prev) => ({
          ...prev,
          [roundId]: updatedJudgeRoundsResponse.data || [],
        }));

        toast.success(response.message || t("judgeAssigned"));
      }
    } catch (error: any) {
      console.error("Error assigning judge:", error);
      toast.error(error.message || t("judgeAssignError"));
    } finally {
      setIsProcessing({ status: false });
    }
  };

  const isJudgeAssignedToRound = (
    judgeId: string,
    roundId: string
  ): boolean => {
    return roundJudges[roundId]?.some((jr) => jr.judge.id === judgeId) || false;
  };

  if (loading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[200px] text-center">
        <LoadingSpinner size="md" showText={true} />
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {t("loadingData")}
        </p>
      </div>
    );
  }

  if (rounds.length === 0) {
    return (
      <div className="p-4 text-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
        {t("noRoundsCreated")}
      </div>
    );
  }

  return (
    <div className="transition-colors duration-200">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {t("judgesAssignedTitle")}
      </h2>

      <div className="space-y-4">
        {rounds.map((round) => (
          <div
            key={round.id}
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                {round.roundTitle} ({t("round")} {round.roundNumber})
              </h3>
              <button
                onClick={() => {
                  setSelectedRound(
                    selectedRound === round.id ? null : round.id
                  );
                  setIsAssigning(selectedRound !== round.id);
                }}
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50 transition-colors duration-200 w-full sm:w-auto"
                disabled={isProcessing.status}
                aria-label={
                  selectedRound === round.id
                    ? t("cancelAction")
                    : t("assignJudges")
                }
              >
                {selectedRound === round.id
                  ? t("cancelAction")
                  : t("assignJudges")}
              </button>
            </div>

            {/* Display assigned judges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {roundJudges[round.id]?.length ? (
                roundJudges[round.id].map((judgeRound) => (
                  <div
                    key={judgeRound.id}
                    className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full shadow-sm transition-colors duration-200 w-full sm:w-auto"
                  >
                    {judgeRound.judge.avatarUrl ? (
                      <Image
                        src={judgeRound.judge.avatarUrl}
                        alt={judgeRound.judge.firstName}
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                    ) : (
                      <span className="w-6 h-6 flex items-center justify-center bg-gray-300 dark:bg-gray-600 text-xs rounded-full mr-2">
                        {judgeRound.judge.firstName[0]}
                      </span>
                    )}
                    <span className="text-sm font-medium truncate">
                      {judgeRound.judge.firstName} {judgeRound.judge.lastName}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 hidden sm:inline truncate max-w-[150px]">
                      {judgeRound.judge.email}
                    </span>
                    <button
                      onClick={() =>
                        handleRemoveJudge(judgeRound.judge.id, round.id)
                      }
                      className="ml-2 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold disabled:opacity-50 transition-colors duration-200"
                      disabled={
                        isProcessing.status &&
                        isProcessing.judgeId === judgeRound.judge.id
                      }
                      aria-label={t("removeJudge")}
                    >
                      {isProcessing.status &&
                      isProcessing.judgeId === judgeRound.judge.id &&
                      isProcessing.roundId === round.id ? (
                        <LoadingSpinner size="sm" showText={false} />
                      ) : (
                        "✕"
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  {t("noJudgesAssigned")}
                </p>
              )}
            </div>

            {/* Show available judges for assignment */}
            {selectedRound === round.id && isAssigning && (
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 transition-all duration-300">
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("availableJudges")}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {availableJudges.length > 0 ? (
                    availableJudges.map((judge) => {
                      const isAssigned = isJudgeAssignedToRound(
                        judge.user.id,
                        round.id
                      );
                      return (
                        <div
                          key={judge.id}
                          className={`flex items-center ${
                            isAssigned
                              ? "bg-green-100 dark:bg-green-900/30"
                              : "bg-gray-50 dark:bg-gray-700/50"
                          } text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full shadow-sm transition-all duration-200 w-full sm:w-auto`}
                        >
                          {judge.user.avatarUrl ? (
                            <Image
                              src={judge.user.avatarUrl}
                              alt={judge.user.firstName}
                              width={24}
                              height={24}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                          ) : (
                            <span className="w-6 h-6 flex items-center justify-center bg-gray-300 dark:bg-gray-600 text-xs rounded-full mr-2">
                              {judge.user.firstName[0]}
                            </span>
                          )}
                          <span className="text-sm font-medium truncate">
                            {judge.user.firstName} {judge.user.lastName}
                          </span>
                          <button
                            onClick={() => {
                              if (isAssigned) {
                                handleRemoveJudge(judge.user.id, round.id);
                              } else {
                                handleAssignJudge(judge.user.id, round.id);
                              }
                            }}
                            className={`ml-2 text-xs ${
                              isAssigned
                                ? "text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                : "text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            } font-medium disabled:opacity-50 transition-colors duration-200`}
                            disabled={
                              isProcessing.status &&
                              isProcessing.judgeId === judge.user.id
                            }
                            aria-label={
                              isAssigned ? t("removeAction") : t("assignAction")
                            }
                          >
                            {isProcessing.status &&
                            isProcessing.judgeId === judge.user.id &&
                            isProcessing.roundId === round.id ? (
                              <LoadingSpinner size="sm" showText={false} />
                            ) : isAssigned ? (
                              t("removeAction")
                            ) : (
                              t("assignAction")
                            )}
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("noJudgesAvailable")}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
