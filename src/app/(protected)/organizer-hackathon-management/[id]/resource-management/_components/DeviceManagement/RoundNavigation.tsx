// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/RoundNavigation.tsx
import React from "react";
import { Round } from "@/types/entities/round";

interface RoundNavigationProps {
  rounds: Round[];
  activeRoundId: string | null;
  onRoundSelect: (roundId: string | null) => void;
}

const RoundNavigation: React.FC<RoundNavigationProps> = ({
  rounds,
  activeRoundId,
  onRoundSelect,
}) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-6">
        <button
          onClick={() => onRoundSelect(null)}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeRoundId === null
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          All Devices
        </button>

        {rounds.map((round) => (
          <button
            key={round.id}
            onClick={() => onRoundSelect(round.id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeRoundId === round.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {round.roundTitle}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default RoundNavigation;
