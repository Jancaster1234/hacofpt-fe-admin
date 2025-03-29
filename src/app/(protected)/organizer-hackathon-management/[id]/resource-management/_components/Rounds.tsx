// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Rounds.tsx
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

  // Helper function to format location type badge
  const renderLocationType = (type: string) => {
    return (
      <span
        className={`text-xs font-medium px-2 py-1 rounded-full ${
          type === "ONLINE"
            ? "bg-blue-100 text-blue-800"
            : type === "HYBRID"
            ? "bg-green-100 text-green-800"
            : "bg-purple-100 text-purple-800"
        }`}
      >
        {type}
      </span>
    );
  };

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
            <div className="flex items-center gap-2 mb-2">
              <p className="text-gray-600">
                <strong>Round Number:</strong> {round.roundNumber}
              </p>
              <span
                className={`ml-2 text-sm px-2 py-1 rounded ${
                  round.status === "UPCOMING"
                    ? "bg-yellow-300 text-yellow-800"
                    : "bg-green-300 text-green-800"
                }`}
              >
                {round.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <p className="text-gray-600">
                <strong>Start:</strong>{" "}
                {new Date(round.startTime).toLocaleString()}
              </p>
              <p className="text-gray-600">
                <strong>End:</strong> {new Date(round.endTime).toLocaleString()}
              </p>
            </div>

            {/* Locations Section */}
            <div className="mt-4">
              <h4 className="text-md font-medium text-gray-700 mb-2">
                Locations
              </h4>
              {round.roundLocations && round.roundLocations.length > 0 ? (
                <div className="space-y-3">
                  {round.roundLocations.map((location) => (
                    <div
                      key={location.id}
                      className="bg-gray-50 p-3 rounded-md border border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">
                          {location.location.name}
                        </span>
                        {renderLocationType(location.type)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {location.location.address}
                      </p>
                      {location.location.latitude !== 0 &&
                        location.location.longitude !== 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Coordinates: {location.location.latitude},{" "}
                            {location.location.longitude}
                          </p>
                        )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  No locations assigned to this round.
                </p>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No rounds available.</p>
      )}
    </div>
  );
}
