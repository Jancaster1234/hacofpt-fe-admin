import { useEffect, useState } from "react";
import Image from "next/image";
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

  const handleRemoveJudge = (judgeId: string, roundId: string) => {
    console.log(`Removing judge ${judgeId} from round ${roundId}`);
  };

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
      ))}
    </div>
  );
}
