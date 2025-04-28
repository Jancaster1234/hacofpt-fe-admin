// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/RoundNavigation.tsx
import React from "react";
import { Round } from "@/types/entities/round";
import { useTranslations } from "@/hooks/useTranslations";

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
  const t = useTranslations("deviceManagement");

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-4 sm:mb-6 transition-colors duration-200 overflow-x-auto">
      <nav className="-mb-px flex space-x-4 sm:space-x-6 min-w-max">
        <button
          onClick={() => onRoundSelect(null)}
          className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-white dark:focus:ring-offset-gray-900 ${
            activeRoundId === null
              ? "border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
          }`}
          aria-current={activeRoundId === null ? "page" : undefined}
        >
          {t("allDevices")}
        </button>

        {rounds.map((round) => (
          <button
            key={round.id}
            onClick={() => onRoundSelect(round.id)}
            className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-white dark:focus:ring-offset-gray-900 ${
              activeRoundId === round.id
                ? "border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
            aria-current={activeRoundId === round.id ? "page" : undefined}
          >
            {round.roundTitle}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default RoundNavigation;
