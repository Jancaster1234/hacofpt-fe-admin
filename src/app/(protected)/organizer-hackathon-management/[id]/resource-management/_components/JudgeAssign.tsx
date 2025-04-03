// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/JudgeAssign.tsx
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

export default function JudgeAssign({ hackathonId }: { hackathonId: string }) {
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
  const { showError, showSuccess } = useApiModal();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch real rounds data
        const roundsResponse = await roundService.getRoundsByHackathonId(
          hackathonId
        );
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
        showError(
          "Data Loading Error",
          "Failed to load hackathon data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hackathonId, showError]);

  const handleRemoveJudge = async (
    teamRoundJudgeId: string,
    teamRoundId: string,
    judgeId: string
  ) => {
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

        showSuccess(
          "Judge Removed",
          "Judge has been successfully removed from the team."
        );
      }
    } catch (error) {
      console.error("Error removing judge:", error);
      showError(
        "Failed to Remove Judge",
        "Could not remove the judge. Please try again later."
      );
    }
  };

  const handleAssignJudge = async (
    judgeId: string,
    teamRoundId: string,
    roundId: string
  ) => {
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

        showSuccess(
          "Judge Assigned",
          "Judge has been successfully assigned to the team."
        );
      }
    } catch (error) {
      console.error("Error assigning judge:", error);
      showError(
        "Failed to Assign Judge",
        "Could not assign judge to the team. Please try again later."
      );
    }
  };

  const isJudgeAssignedToTeamRound = (
    judgeId: string,
    teamRoundId: string
  ): boolean => {
    return (
      teamRoundJudges[teamRoundId]?.some((trj) => trj.judge.id === judgeId) ||
      false
    );
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div>
      <div className="flex space-x-2 overflow-x-auto border-b mb-4">
        {rounds.map((round) => (
          <button
            key={round.id}
            className={`p-2 ${
              activeRoundId === round.id
                ? "border-b-2 border-green-500 text-green-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveRoundId(round.id)}
          >
            {round.roundTitle}
          </button>
        ))}
      </div>

      {activeRoundId && (
        <div className="space-y-6">
          {teamRounds[activeRoundId]?.map((teamRound) => {
            const isDisqualified =
              teamRound.status === "DisqualifiedDueToViolation";

            return (
              <div
                key={teamRound.id}
                className={`bg-white p-4 rounded-lg shadow-md ${
                  isDisqualified ? "border-l-4 border-red-500" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-800">
                        Team:{" "}
                        {teamRound.team?.name || `ID: ${teamRound.teamId}`}
                      </h3>
                      <TeamMembersTooltip teamId={teamRound.teamId || ""} />
                    </div>

                    <div className="flex items-center mt-1">
                      <p className="text-gray-600 mr-2">
                        Status: {teamRound.status || "Pending"}
                      </p>
                      <InfoTooltip
                        title="Team Round Status"
                        content="Describes the current state of this team in the round. Disqualified teams cannot be assigned judges."
                      />
                    </div>

                    <div className="flex items-center mt-1">
                      <p className="text-gray-600 mr-2">Description:</p>
                      <InfoTooltip
                        title="Description"
                        content="Additional information about this team's participation in the round."
                      />
                    </div>
                    <p className="text-gray-600 mt-1">
                      {teamRound.description || "No description provided."}
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
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      {selectedTeamRound === teamRound.id
                        ? "Cancel"
                        : "Assign Judges"}
                    </button>
                  )}
                </div>

                <div className="mt-2">
                  <h4 className="font-semibold">Assigned Judges:</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {teamRoundJudges[teamRound.id]?.length ? (
                      teamRoundJudges[teamRound.id].map((judge) => (
                        <div
                          key={judge.id}
                          className="flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full shadow-sm"
                        >
                          {judge.judge.avatarUrl ? (
                            <Image
                              src={judge.judge.avatarUrl}
                              alt={judge.judge.firstName}
                              width={24}
                              height={24}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                          ) : (
                            <span className="w-6 h-6 flex items-center justify-center bg-gray-300 text-xs rounded-full mr-2">
                              {judge.judge.firstName[0]}
                            </span>
                          )}
                          <span className="text-sm font-medium">
                            {judge.judge.firstName} {judge.judge.lastName}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {judge.judge.email}
                          </span>
                          {!isDisqualified && (
                            <button
                              onClick={() =>
                                handleRemoveJudge(
                                  judge.id,
                                  teamRound.id,
                                  judge.judgeId
                                )
                              }
                              className="ml-2 text-xs text-red-500 hover:text-red-700 font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No judges assigned yet.</p>
                    )}
                  </div>
                </div>

                {/* Show available judges for this team round */}
                {selectedTeamRound === teamRound.id && !isDisqualified && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <h4 className="text-md font-medium text-gray-700 mb-2">
                      Available Judges
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {availableJudges[activeRoundId]?.length > 0 ? (
                        availableJudges[activeRoundId].map((judgeRound) => {
                          const isAssigned = isJudgeAssignedToTeamRound(
                            judgeRound.judge.id,
                            teamRound.id
                          );
                          return (
                            <div
                              key={judgeRound.id}
                              className={`flex items-center ${
                                isAssigned ? "bg-green-100" : "bg-gray-50"
                              } text-gray-800 px-3 py-1 rounded-full shadow-sm`}
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
                                <span className="w-6 h-6 flex items-center justify-center bg-gray-300 text-xs rounded-full mr-2">
                                  {judgeRound.judge.firstName[0]}
                                </span>
                              )}
                              <span className="text-sm font-medium">
                                {judgeRound.judge.firstName}{" "}
                                {judgeRound.judge.lastName}
                              </span>
                              <button
                                onClick={() => {
                                  if (isAssigned) {
                                    const teamRoundJudge = teamRoundJudges[
                                      teamRound.id
                                    ]?.find(
                                      (trj) =>
                                        trj.judge.id === judgeRound.judge.id
                                    );
                                    if (teamRoundJudge) {
                                      handleRemoveJudge(
                                        teamRoundJudge.id,
                                        teamRound.id,
                                        judgeRound.judge.id
                                      );
                                    }
                                  } else {
                                    handleAssignJudge(
                                      judgeRound.judge.id,
                                      teamRound.id,
                                      activeRoundId
                                    );
                                  }
                                }}
                                className={`ml-2 text-xs ${
                                  isAssigned
                                    ? "text-red-500 hover:text-red-700"
                                    : "text-blue-500 hover:text-blue-700"
                                } font-medium`}
                              >
                                {isAssigned ? "Remove" : "Assign"}
                              </button>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-gray-500">
                          No judges available for this round.
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
