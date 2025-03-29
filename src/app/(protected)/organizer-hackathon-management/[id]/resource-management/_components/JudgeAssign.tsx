// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/JudgeAssign.tsx
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchMockRounds } from "../_mocks/fetchMockRounds";
import { fetchMockTeamRounds } from "../_mocks/fetchMockTeamRounds";
import { fetchMockTeamRoundJudges } from "../_mocks/fetchMockTeamRoundJudges";
import { Round } from "@/types/entities/round";
import { TeamRound } from "@/types/entities/teamRound";
import { TeamRoundJudge } from "@/types/entities/teamRoundJudge";

export default function JudgeAssign({ hackathonId }: { hackathonId: string }) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [activeRoundId, setActiveRoundId] = useState<string | null>(null);
  const [teamRounds, setTeamRounds] = useState<{
    [roundId: string]: TeamRound[];
  }>({});
  const [teamRoundJudges, setTeamRoundJudges] = useState<{
    [teamRoundId: string]: TeamRoundJudge[];
  }>({});

  useEffect(() => {
    fetchMockRounds(hackathonId).then((roundsData) => {
      setRounds(roundsData);
      if (roundsData.length > 0) {
        setActiveRoundId(roundsData[0].id);
      }

      roundsData.forEach((round) => {
        fetchMockTeamRounds(hackathonId, round.id).then((teamRoundsData) => {
          setTeamRounds((prev) => ({ ...prev, [round.id]: teamRoundsData }));

          teamRoundsData.forEach((teamRound) => {
            fetchMockTeamRoundJudges(teamRound.id).then((judgesData) => {
              setTeamRoundJudges((prev) => ({
                ...prev,
                [teamRound.id]: judgesData,
              }));
            });
          });
        });
      });
    });
  }, [hackathonId]);

  const handleRemoveJudge = (judgeId: string, teamRoundId: string) => {
    console.log(`Removing judge ${judgeId} from team round ${teamRoundId}`);
  };

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
          {teamRounds[activeRoundId]?.map((teamRound) => (
            <div
              key={teamRound.id}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-medium text-gray-800">
                Team ID: {teamRound.teamId}
              </h3>
              <p className="text-gray-600">{teamRound.description}</p>

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
                        <button
                          onClick={() =>
                            handleRemoveJudge(judge.judge.id, teamRound.id)
                          }
                          className="ml-2 text-xs text-black-500 hover:text-blue-500 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No judges assigned yet.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
