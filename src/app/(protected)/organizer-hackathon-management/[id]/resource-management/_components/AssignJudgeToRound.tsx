import { useEffect, useState } from "react";
import { fetchMockRounds } from "../_mocks/fetchMockRounds";
import { fetchMockJudgeRounds } from "../_mocks/fetchMockJudgeRounds";
import { Round } from "@/types/entities/round";
import { JudgeRound } from "@/types/entities/judgeRound";

export default function AssignJudgeToRound({
  hackathonId,
}: {
  hackathonId: string;
}) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [roundJudges, setRoundJudges] = useState<{
    [roundId: string]: JudgeRound[];
  }>({});

  useEffect(() => {
    fetchMockRounds(hackathonId).then((roundsData) => {
      setRounds(roundsData);

      roundsData.forEach((round) => {
        fetchMockJudgeRounds(round.id).then((judgesData) => {
          setRoundJudges((prev) => ({ ...prev, [round.id]: judgesData }));
        });
      });
    });
  }, [hackathonId]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Judges Assigned to Rounds
      </h2>
      {rounds.map((round) => (
        <div key={round.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-lg font-medium text-gray-800">
            {round.roundTitle}
          </h3>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            {roundJudges[round.id]?.length ? (
              roundJudges[round.id].map((judgeRound) => (
                <li key={judgeRound.id}>
                  {judgeRound.judge?.firstName} {judgeRound.judge?.lastName}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No judges assigned yet.</p>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
