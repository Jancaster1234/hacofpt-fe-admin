"use client";

import { useEffect, useState } from "react";
import { fetchMockRounds } from "../_mocks/fetchMockRounds";
import { Round } from "@/types/entities/round";

export default function RoundsList({ hackathonId }: { hackathonId: string }) {
  const [rounds, setRounds] = useState<Round[]>([]);

  useEffect(() => {
    fetchMockRounds(hackathonId).then(setRounds);
  }, [hackathonId]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Rounds</h2>
      {rounds.length > 0 ? (
        rounds.map((round) => (
          <div
            key={round.id}
            className="bg-white p-4 rounded-lg shadow-md mb-4"
          >
            <h3 className="text-lg font-medium text-gray-800">
              {round.roundTitle} (Round {round.roundNumber})
            </h3>
            <p className="text-gray-600">
              <strong>Status:</strong> {round.status}
            </p>
            <p className="text-gray-600">
              <strong>Start Time:</strong>{" "}
              {new Date(round.startTime).toLocaleString()}
            </p>
            <p className="text-gray-600">
              <strong>End Time:</strong>{" "}
              {new Date(round.endTime).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No rounds found.</p>
      )}
    </div>
  );
}
