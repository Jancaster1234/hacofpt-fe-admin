import { useEffect, useState } from "react";
import { fetchMockRounds } from "../_mocks/fetchMockRounds";
import { Round } from "@/types/entities/round";

export default function Rounds({ hackathonId }: { hackathonId: string }) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMockRounds(hackathonId).then((data) => {
      setRounds(data);
      setLoading(false);
    });
  }, [hackathonId]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Rounds</h2>
      {loading ? (
        <p className="text-gray-500">Loading rounds...</p>
      ) : rounds.length > 0 ? (
        rounds.map((round) => (
          <div
            key={round.id}
            className="bg-white p-4 rounded-lg shadow-md mb-4"
          >
            <h3 className="text-lg font-medium text-gray-800">
              {round.roundTitle}
            </h3>
            <p className="text-gray-600">
              <strong>Round Number:</strong> {round.roundNumber}
            </p>
            <p className="text-gray-600">
              <strong>Start:</strong>{" "}
              {new Date(round.startTime).toLocaleString()}
            </p>
            <p className="text-gray-600">
              <strong>End:</strong> {new Date(round.endTime).toLocaleString()}
            </p>
            <p className="text-gray-600">
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded ${
                  round.status === "UPCOMING"
                    ? "bg-yellow-300 text-yellow-800"
                    : "bg-green-300 text-green-800"
                }`}
              >
                {round.status}
              </span>
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No rounds available.</p>
      )}
    </div>
  );
}
