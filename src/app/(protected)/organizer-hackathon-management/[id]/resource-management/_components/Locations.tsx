// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/Locations.tsx
"use client";
import React, { useEffect, useState } from "react";
import { fetchMockLocations } from "../_mocks/fetchMockLocations";
import { Location } from "@/types/entities/location";

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    fetchMockLocations().then(setLocations);
  }, []);

  return (
    <div className="bg-white shadow-md p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Available Locations</h2>
      {locations.length === 0 ? (
        <p>Loading locations...</p>
      ) : (
        <ul className="space-y-2">
          {locations.map((location) => (
            <li
              key={location.id}
              className="border p-3 rounded-md shadow-sm bg-gray-50"
            >
              <h3 className="font-medium text-lg">{location.name}</h3>
              <p className="text-gray-600">{location.address}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
