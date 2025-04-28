// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/index.tsx
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
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface DeviceManagementProps {
  hackathonId: string;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({ hackathonId }) => {
  const { user } = useAuth();
  const t = useTranslations("deviceManagement");
  const toast = useToast();

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
        setLoading(true);
        const response = await hackathonService.getHackathonById(hackathonId);
        if (response.data && response.data.length > 0) {
          const hackathonData = response.data[0];
          setHackathon(hackathonData);

          // Check if current user is the hackathon creator
          if (user && hackathonData.createdByUserName === user.username) {
            setIsHackathonCreator(true);
          }
        } else {
          setHackathon(null);
          setError(t("failedToFetchHackathon"));
        }
      } catch (error: any) {
        console.error("Error fetching hackathon data:", error);
        setError(error.message || t("failedToFetchHackathon"));
      } finally {
        setLoading(false);
      }
    };

    if (hackathonId && user) {
      fetchHackathon();
    }
  }, [hackathonId, user, t]);

  // Load rounds and initial devices
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Load rounds first
        const roundsResponse =
          await roundService.getRoundsByHackathonId(hackathonId);

        if (roundsResponse.data) {
          setRounds(roundsResponse.data);
        } else if (roundsResponse.message) {
          setError(roundsResponse.message);
        }

        // Load all devices for the hackathon
        const devicesResponse =
          await deviceService.getDevicesByHackathonId(hackathonId);

        if (devicesResponse.data) {
          setDevices(devicesResponse.data);
        } else if (devicesResponse.message) {
          setError(devicesResponse.message);
        }
      } catch (error: any) {
        console.error("Error loading initial data:", error);
        setError(error.message || t("failedToLoadData"));
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [hackathonId, t]);

  // Fetch devices when round or roundLocation selection changes
  useEffect(() => {
    if (!activeRoundId && !activeRoundLocationId && devices.length > 0) {
      // Skip unnecessary API call if no filters are applied and we already have devices
      return;
    }

    const loadDevices = async () => {
      setLoading(true);
      setError(null);

      try {
        let devicesResponse;

        if (activeRoundId === null && activeRoundLocationId === null) {
          // If no filters are applied, load all devices for the hackathon
          devicesResponse =
            await deviceService.getDevicesByHackathonId(hackathonId);
        } else if (activeRoundLocationId) {
          // If roundLocation is selected, filter by roundLocation ID
          devicesResponse = await deviceService.getDevicesByRoundLocationId(
            activeRoundLocationId
          );
        } else if (activeRoundId) {
          // If only round is selected, filter by round ID
          devicesResponse =
            await deviceService.getDevicesByRoundId(activeRoundId);
        }

        if (devicesResponse && devicesResponse.data) {
          setDevices(devicesResponse.data);
        } else if (devicesResponse && devicesResponse.message) {
          setError(devicesResponse.message);
        }
      } catch (error: any) {
        console.error("Error loading devices:", error);
        setError(error.message || t("failedToLoadDevices"));
      } finally {
        setLoading(false);
      }
    };

    loadDevices();
  }, [hackathonId, activeRoundId, activeRoundLocationId, t]);

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
  const handleDeviceAdded = (newDevice: Device, message?: string) => {
    setDevices([...devices, newDevice]);
    if (message) {
      toast.success(message);
    } else {
      toast.success(t("deviceAddedSuccess"));
    }
  };

  // Handle device deletion
  const handleDeviceDeleted = (deviceId: string, message?: string) => {
    setDevices(devices.filter((device) => device.id !== deviceId));
    if (message) {
      toast.success(message);
    } else {
      toast.success(t("deviceDeletedSuccess"));
    }
  };

  // Handle device update
  const handleDeviceUpdated = (updatedDevice: Device, message?: string) => {
    setDevices(
      devices.map((device) =>
        device.id === updatedDevice.id ? updatedDevice : device
      )
    );
    if (message) {
      toast.success(message);
    } else {
      toast.success(t("deviceUpdatedSuccess"));
    }
  };

  // Get the active round
  const activeRound = activeRoundId
    ? rounds.find((round) => round.id === activeRoundId)
    : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors duration-200 p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
        {t("deviceManagement")}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition-colors duration-200">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" showText />
        </div>
      )}

      {!loading && (
        <>
          {!isHackathonCreator && (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded transition-colors duration-200">
              {t("viewOnlyMode")}
            </div>
          )}

          <div className="space-y-4 sm:space-y-6">
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
              onDeviceUpdated={handleDeviceUpdated}
              isHackathonCreator={isHackathonCreator}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DeviceManagement;
