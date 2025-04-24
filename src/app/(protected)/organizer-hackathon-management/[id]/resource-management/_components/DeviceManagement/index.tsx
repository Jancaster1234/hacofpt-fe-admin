// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/index.tsx
import React, { useState, useEffect } from "react";
import { Device } from "@/types/entities/device";
import { Round } from "@/types/entities/round";
import { Hackathon } from "@/types/entities/hackathon";
import RoundNavigation from "./RoundNavigation";
import LocationFilter from "./LocationFilter";
import DeviceList from "./DeviceList";
import { deviceService } from "@/services/device.service";
import { roundService } from "@/services/round.service";
import { hackathonService } from "@/services/hackathon.service";
import { useAuth } from "@/hooks/useAuth_v0";

interface DeviceManagementProps {
  hackathonId: string;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({ hackathonId }) => {
  const { user } = useAuth();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeRoundId, setActiveRoundId] = useState<string | null>(null);
  const [activeRoundLocationId, setActiveRoundLocationId] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [isHackathonCreator, setIsHackathonCreator] = useState<boolean>(false);

  // Fetch hackathon data to check permissions
  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const response = await hackathonService.getHackathonById(hackathonId);
        if (response.data && response.data.length > 0) {
          const hackathonData = response.data[0];
          setHackathon(hackathonData);

          // Check if current user is the hackathon creator
          if (user && hackathonData.createdByUserName === user.username) {
            setIsHackathonCreator(true);
          }
        } else {
          setHackathon(null); // or maybe show an error?
        }
      } catch (error) {
        console.error("Error fetching hackathon data:", error);
        setError("Failed to fetch hackathon information");
      }
    };

    if (hackathonId && user) {
      fetchHackathon();
    }
  }, [hackathonId, user]);

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

  // Fetch devices when round or roundLocation selection changes
  useEffect(() => {
    const loadDevices = async () => {
      setLoading(true);
      setError(null);
      try {
        let devicesResponse;

        if (activeRoundId === null && activeRoundLocationId === null) {
          // If no filters are applied, load all devices for the hackathon
          devicesResponse = await deviceService.getDevicesByHackathonId(
            hackathonId
          );
        } else if (activeRoundLocationId) {
          // If roundLocation is selected, filter by roundLocation ID
          devicesResponse = await deviceService.getDevicesByRoundLocationId(
            activeRoundLocationId
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
  }, [hackathonId, activeRoundId, activeRoundLocationId]);

  // Handle round selection
  const handleRoundSelect = (roundId: string | null) => {
    setActiveRoundId(roundId);
    setActiveRoundLocationId(null);
  };

  // Handle roundLocation selection
  const handleLocationSelect = (roundLocationId: string | null) => {
    setActiveRoundLocationId(roundLocationId);
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

      {!isHackathonCreator && !loading && (
        <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded">
          You need to be the hackathon creator to manage devices.
        </div>
      )}

      {!loading && isHackathonCreator && (
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
                activeRoundLocationId={activeRoundLocationId}
                onLocationSelect={handleLocationSelect}
              />
            )}

          <DeviceList
            devices={devices}
            activeRound={activeRound}
            activeLocationId={activeRoundLocationId}
            hackathonId={hackathonId}
            onDeviceAdded={handleDeviceAdded}
            onDeviceDeleted={handleDeviceDeleted}
            isHackathonCreator={isHackathonCreator}
          />
        </>
      )}
    </div>
  );
};

export default DeviceManagement;
