import { useEffect, useState } from "react";
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
                <ul className="list-disc list-inside text-gray-700">
                  {teamRoundJudges[teamRound.id]?.length ? (
                    teamRoundJudges[teamRound.id].map((judge) => (
                      <li key={judge.id}>
                        {judge.judge?.firstName} {judge.judge?.lastName}
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500">No judges assigned yet.</p>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
