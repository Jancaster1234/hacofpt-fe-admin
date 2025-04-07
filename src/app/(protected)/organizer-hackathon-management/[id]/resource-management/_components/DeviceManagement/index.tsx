// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/index.tsx
import React, { useState, useEffect } from "react";
import { fetchMockDevices } from "../../_mocks/fetchMockDevices";
import { fetchMockRounds } from "../../_mocks/fetchMockRounds";
import { Device } from "@/types/entities/device";
import { Round } from "@/types/entities/round";
import RoundNavigation from "./RoundNavigation";
import LocationFilter from "./LocationFilter";
import DeviceList from "./DeviceList";

interface DeviceManagementProps {
  hackathonId: string;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({ hackathonId }) => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeRoundId, setActiveRoundId] = useState<string | null>(null);
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);

  // Fetch rounds and initial devices on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const fetchedRounds = await fetchMockRounds(hackathonId);
        setRounds(fetchedRounds);

        // Initially load all devices without round/location filter
        const allDevices = await fetchMockDevices({ hackathonId });
        setDevices(allDevices);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [hackathonId]);

  // Fetch devices when round or location selection changes
  useEffect(() => {
    const loadDevices = async () => {
      setLoading(true);
      try {
        let params: {
          hackathonId?: string;
          roundId?: string;
          roundLocationId?: string;
        } = {
          hackathonId,
        };

        if (activeRoundId) {
          params.roundId = activeRoundId;
        }

        if (activeLocationId) {
          params.roundLocationId = activeLocationId;
        }

        const fetchedDevices = await fetchMockDevices(params);
        setDevices(fetchedDevices);
      } catch (error) {
        console.error("Error loading devices:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDevices();
  }, [hackathonId, activeRoundId, activeLocationId]);

  // Handle round selection
  const handleRoundSelect = (roundId: string | null) => {
    setActiveRoundId(roundId);
    setActiveLocationId(null);
  };

  // Handle location selection
  const handleLocationSelect = (locationId: string | null) => {
    setActiveLocationId(locationId);
  };

  // Get the active round
  const activeRound = activeRoundId
    ? rounds.find((round) => round.id === activeRoundId)
    : null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Device Management</h2>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && (
        <>
          <RoundNavigation
            rounds={rounds}
            activeRoundId={activeRoundId}
            onRoundSelect={handleRoundSelect}
          />

          {activeRound &&
            activeRound.roundLocations &&
            activeRound.roundLocations.length > 0 && (
              <LocationFilter
                locations={activeRound.roundLocations}
                activeLocationId={activeLocationId}
                onLocationSelect={handleLocationSelect}
              />
            )}

          <DeviceList
            devices={devices}
            activeRound={activeRound}
            activeLocationId={activeLocationId}
            hackathonId={hackathonId}
          />
        </>
      )}
    </div>
  );
};

export default DeviceManagement;
