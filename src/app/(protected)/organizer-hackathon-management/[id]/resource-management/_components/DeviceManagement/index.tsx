// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/index.tsx
import React, { useState, useEffect } from "react";
import { Device } from "@/types/entities/device";
import { Round } from "@/types/entities/round";
import RoundNavigation from "./RoundNavigation";
import LocationFilter from "./LocationFilter";
import DeviceList from "./DeviceList";
import { deviceService } from "@/services/device.service";
import { roundService } from "@/services/round.service";

interface DeviceManagementProps {
  hackathonId: string;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({ hackathonId }) => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeRoundId, setActiveRoundId] = useState<string | null>(null);
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch rounds and initial devices on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Load rounds first
        const roundsResponse = await roundService.getRoundsByHackathonId(
          hackathonId
        );
        if (roundsResponse.data) {
          setRounds(roundsResponse.data);
        }

        // Load all devices for the hackathon
        const devicesResponse = await deviceService.getDevicesByHackathonId(
          hackathonId
        );
        if (devicesResponse.data) {
          setDevices(devicesResponse.data);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        setError("Failed to load data. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [hackathonId]);

  // Fetch devices when round or location selection changes
  useEffect(() => {
    const loadDevices = async () => {
      if (!activeRoundId && !activeLocationId) {
        // Skip API call if no filters are applied (we already have all devices)
        return;
      }

      setLoading(true);
      setError(null);
      try {
        let devicesResponse;

        if (activeLocationId) {
          // If location is selected, filter by location ID
          devicesResponse = await deviceService.getDevicesByRoundLocationId(
            activeLocationId
          );
        } else if (activeRoundId) {
          // If only round is selected, filter by round ID
          devicesResponse = await deviceService.getDevicesByRoundId(
            activeRoundId
          );
        }

        if (devicesResponse && devicesResponse.data) {
          setDevices(devicesResponse.data);
        }
      } catch (error) {
        console.error("Error loading devices:", error);
        setError("Failed to load devices for the selected filters.");
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

  // Handle device added
  const handleDeviceAdded = (newDevice: Device) => {
    setDevices([...devices, newDevice]);
  };

  // Handle device deletion
  const handleDeviceDeleted = (deviceId: string) => {
    setDevices(devices.filter((device) => device.id !== deviceId));
  };

  // Get the active round
  const activeRound = activeRoundId
    ? rounds.find((round) => round.id === activeRoundId)
    : null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Device Management</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">{error}</div>
      )}

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
            onDeviceAdded={handleDeviceAdded}
            onDeviceDeleted={handleDeviceDeleted}
          />
        </>
      )}
    </div>
  );
};

export default DeviceManagement;
