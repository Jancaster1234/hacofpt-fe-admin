// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/RoundTabs.tsx
import { Round } from "@/types/entities/round";

interface RoundTabsProps {
  rounds: Round[];
  selectedRoundId: string | null;
  setSelectedRoundId: (id: string) => void;
}

export function RoundTabs({
  rounds,
  selectedRoundId,
  setSelectedRoundId,
}: RoundTabsProps) {
  return (
    <div className="flex space-x-2 overflow-x-auto border-b mb-4">
      {rounds.map((round) => (
        <button
          key={round.id}
          className={`p-2 ${
            selectedRoundId === round.id
              ? "border-b-2 border-green-500 text-green-500"
              : "text-gray-600"
          }`}
          onClick={() => setSelectedRoundId(round.id)}
        >
          {round.roundTitle}
        </button>
      ))}
    </div>
  );
}
