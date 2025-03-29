// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/AssignJudgeToRound.tsx
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchMockRounds } from "../_mocks/fetchMockRounds";
import { fetchMockJudgeRounds } from "../_mocks/fetchMockJudgeRounds";
import { fetchMockUserHackathons } from "../_mocks/fetchMockUserHackathons";
import { Round } from "@/types/entities/round";
import { JudgeRound } from "@/types/entities/judgeRound";
import { UserHackathon } from "@/types/entities/userHackathon";

// Simulated API functions for judge assignment
const assignJudgeToRound = async (
  judgeId: string,
  roundId: string
): Promise<boolean> => {
  // This would be an API call in a real application
  return new Promise((resolve) => {
    console.log(`Assigning judge ${judgeId} to round ${roundId}`);
    // Simulate API delay
    setTimeout(() => {
      // Simulate successful response
      //api create request body format: judgeId: string, roundId: string, isDeleted: false
      resolve(true);
    }, 500);
  });
};

const removeJudgeFromRound = async (
  judgeId: string,
  roundId: string
): Promise<boolean> => {
  // This would be an API call in a real application
  return new Promise((resolve) => {
    console.log(`Removing judge ${judgeId} from round ${roundId}`);
    // Simulate API delay
    setTimeout(() => {
      // Simulate successful response
      resolve(true);
    }, 500);
  });
};

export default function AssignJudgeToRound({
  hackathonId,
}: {
  hackathonId: string;
}) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [roundJudges, setRoundJudges] = useState<{
    [roundId: string]: JudgeRound[];
  }>({});
  const [availableJudges, setAvailableJudges] = useState<UserHackathon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState<boolean>(false);

  // Fetch rounds, judges, and available users
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch rounds
        const roundsData = await fetchMockRounds(hackathonId);
        setRounds(roundsData);

        // Fetch judges for each round
        const judgesPromises = roundsData.map((round) =>
          fetchMockJudgeRounds(round.id)
        );
        const judgesResults = await Promise.all(judgesPromises);

        const newRoundJudges: { [roundId: string]: JudgeRound[] } = {};
        roundsData.forEach((round, index) => {
          newRoundJudges[round.id] = judgesResults[index];
        });
        setRoundJudges(newRoundJudges);

        // Fetch available judges (users with JUDGE role)
        const userHackathons = await fetchMockUserHackathons(hackathonId);
        const judgeUsers = userHackathons.filter((uh) => uh.role === "JUDGE");
        setAvailableJudges(judgeUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hackathonId]);

  const handleRemoveJudge = async (judgeId: string, roundId: string) => {
    try {
      const success = await removeJudgeFromRound(judgeId, roundId);

      if (success) {
        // Update the local state to reflect the removal
        setRoundJudges((prev) => ({
          ...prev,
          [roundId]: prev[roundId].filter((jr) => jr.judge.id !== judgeId),
        }));
      }
    } catch (error) {
      console.error("Error removing judge:", error);
    }
  };

  const handleAssignJudge = async (judgeId: string, roundId: string) => {
    try {
      const success = await assignJudgeToRound(judgeId, roundId);

      if (success) {
        // Get the judge details from the available judges
        const judgeUser = availableJudges.find((j) => j.user.id === judgeId);

        if (judgeUser) {
          // Create a new JudgeRound object
          const newJudgeRound: JudgeRound = {
            id: `jr-${Date.now()}`, // Generate a temporary ID
            roundId: roundId,
            judge: judgeUser.user,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Update the local state
          setRoundJudges((prev) => ({
            ...prev,
            [roundId]: [...prev[roundId], newJudgeRound],
          }));
        }
      }
    } catch (error) {
      console.error("Error assigning judge:", error);
    }
  };

  const isJudgeAssignedToRound = (
    judgeId: string,
    roundId: string
  ): boolean => {
    return roundJudges[roundId]?.some((jr) => jr.judge.id === judgeId) || false;
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Judges Assigned to Rounds
      </h2>

      {rounds.map((round) => (
        <div key={round.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">
              {round.roundTitle}
            </h3>
            <button
              onClick={() => {
                setSelectedRound(selectedRound === round.id ? null : round.id);
                setIsAssigning(selectedRound !== round.id);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              {selectedRound === round.id ? "Cancel" : "Assign Judges"}
            </button>
          </div>

          {/* Display assigned judges */}
          <div className="flex flex-wrap gap-2 mt-2">
            {roundJudges[round.id]?.length ? (
              roundJudges[round.id].map((judgeRound) => (
                <div
                  key={judgeRound.id}
                  className="flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full shadow-sm"
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
                    {judgeRound.judge.firstName} {judgeRound.judge.lastName}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {judgeRound.judge.email}
                  </span>
                  <button
                    onClick={() =>
                      handleRemoveJudge(judgeRound.judge.id, round.id)
                    }
                    className="ml-2 text-xs text-red-500 hover:text-red-700 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No judges assigned yet.</p>
            )}
          </div>

          {/* Show available judges for assignment */}
          {selectedRound === round.id && isAssigning && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <h4 className="text-md font-medium text-gray-700 mb-2">
                Available Judges
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
                          isAssigned ? "bg-green-100" : "bg-gray-50"
                        } text-gray-800 px-3 py-1 rounded-full shadow-sm`}
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
                          <span className="w-6 h-6 flex items-center justify-center bg-gray-300 text-xs rounded-full mr-2">
                            {judge.user.firstName[0]}
                          </span>
                        )}
                        <span className="text-sm font-medium">
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
                  <p className="text-gray-500">No judges available.</p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
