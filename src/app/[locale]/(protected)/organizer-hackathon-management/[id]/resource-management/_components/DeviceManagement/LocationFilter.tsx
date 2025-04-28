// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/LocationFilter.tsx
import React from "react";
import { RoundLocation } from "@/types/entities/roundLocation";
import { useTranslations } from "@/hooks/useTranslations";

interface LocationFilterProps {
  locations: RoundLocation[];
  activeRoundLocationId: string | null;
  onLocationSelect: (roundLocationId: string | null) => void;
}

const LocationFilter: React.FC<LocationFilterProps> = ({
  locations,
  activeRoundLocationId,
  onLocationSelect,
}) => {
  const t = useTranslations("deviceManagement");

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 shadow-sm transition-colors duration-200">
      <h3 className="text-base sm:text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">
        {t("locations")}
      </h3>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        <button
          onClick={() => onLocationSelect(null)}
          className={`py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
            activeRoundLocationId === null
              ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
          aria-current={activeRoundLocationId === null ? "page" : undefined}
        >
          {t("allLocations")}
        </button>

        {locations.map((rl) => (
          <button
            key={rl.id}
            onClick={() => onLocationSelect(rl.id)}
            className={`py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
              activeRoundLocationId === rl.id
                ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
            aria-current={activeRoundLocationId === rl.id ? "page" : undefined}
          >
            {rl.location?.name || t("unknownLocation")} ({rl.type})
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocationFilter;
