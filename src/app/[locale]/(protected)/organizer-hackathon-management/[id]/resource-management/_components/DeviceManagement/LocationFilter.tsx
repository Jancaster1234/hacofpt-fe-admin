// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/LocationFilter.tsx
import React from "react";
import { RoundLocation } from "@/types/entities/roundLocation";

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
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-medium mb-2">Locations</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onLocationSelect(null)}
          className={`py-1 px-3 rounded-full text-sm ${
            activeRoundLocationId === null
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All Locations
        </button>

        {locations.map((rl) => (
          <button
            key={rl.id}
            onClick={() => onLocationSelect(rl.id)}
            className={`py-1 px-3 rounded-full text-sm ${
              activeRoundLocationId === rl.id
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {rl.location?.name || "Unknown Location"} ({rl.type})
          </button>
        ))}
      </div>
    </div>
  );
};

export default LocationFilter;
