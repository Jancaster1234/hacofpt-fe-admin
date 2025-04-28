// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/RoundTabs.tsx
import { Round } from "@/types/entities/round";
import { useTranslations } from "@/hooks/useTranslations";

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
  const t = useTranslations("rounds");

  return (
    <div className="flex space-x-2 overflow-x-auto border-b mb-4 pb-1 transition-colors duration-300 dark:border-gray-700">
      {rounds.length > 0 ? (
        rounds.map((round) => (
          <button
            key={round.id}
            className={`p-2 text-sm sm:text-base whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-green-400 ${
              selectedRoundId === round.id
                ? "border-b-2 border-green-500 text-green-500 font-medium dark:border-green-400 dark:text-green-400"
                : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
            onClick={() => setSelectedRoundId(round.id)}
            aria-selected={selectedRoundId === round.id}
            role="tab"
          >
            {round.roundTitle}
          </button>
        ))
      ) : (
        <p className="p-2 text-gray-500 dark:text-gray-400">{t("noRounds")}</p>
      )}
    </div>
  );
}
