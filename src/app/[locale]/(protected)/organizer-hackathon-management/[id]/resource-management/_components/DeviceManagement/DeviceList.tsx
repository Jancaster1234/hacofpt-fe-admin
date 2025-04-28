// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/DeviceList.tsx
import React, { useState } from "react";
import { Device } from "@/types/entities/device";
import { Round } from "@/types/entities/round";
import DeviceItem from "./DeviceItem";
import DeviceForm from "./DeviceForm";
import { deviceService } from "@/services/device.service";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface DeviceListProps {
  devices: Device[];
  activeRound: Round | null;
  activeLocationId: string | null; // This is actually a roundLocationId
  hackathonId: string;
  onDeviceAdded: (device: Device) => void;
  onDeviceDeleted: (deviceId: string) => void;
  isHackathonCreator: boolean;
}

const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  activeRound,
  activeLocationId, // This is already the roundLocationId
  hackathonId,
  onDeviceAdded,
  onDeviceDeleted,
  isHackathonCreator,
}) => {
  const t = useTranslations("deviceManagement");
  const toast = useToast();
  const [expandedDeviceIds, setExpandedDeviceIds] = useState<string[]>([]);
  const [isAddingDevice, setIsAddingDevice] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const toggleDeviceExpansion = (deviceId: string) => {
    if (expandedDeviceIds.includes(deviceId)) {
      // If already expanded, collapse it
      setExpandedDeviceIds(expandedDeviceIds.filter((id) => id !== deviceId));
    } else {
      // Expand the device
      setExpandedDeviceIds([...expandedDeviceIds, deviceId]);
    }
  };

  const getLocationName = () => {
    if (!activeRound || !activeLocationId) return null;

    const roundLocation = activeRound.roundLocations?.find(
      (rl) => rl.id === activeLocationId
    );

    return roundLocation?.location?.name || t("unknownLocation");
  };

  const getTitle = () => {
    if (activeRound) {
      if (activeLocationId) {
        return t("devicesAtLocation", { location: getLocationName() });
      } else {
        return t("devicesForRound", { round: activeRound.roundTitle });
      }
    } else {
      return t("allHackathonDevices");
    }
  };

  const toggleAddDeviceForm = () => {
    setIsAddingDevice(!isAddingDevice);
    setFormError(null);
  };

  const handleSubmitDevice = async (formData: any) => {
    try {
      setIsSubmitting(true);
      setFormError(null);

      const deviceData = {
        hackathonId,
        roundId: formData.roundId || "",
        roundLocationId: formData.roundLocationId || "",
        name: formData.name,
        description: formData.description,
        status: formData.status,
        quantity: formData.quantity,
        files: formData.files,
      };

      const response = await deviceService.createDevice(deviceData);

      if (response.data) {
        onDeviceAdded(response.data);
        toggleAddDeviceForm();
        toast.success(response.message || t("deviceCreatedSuccess"));
      }
    } catch (error: any) {
      console.error("Error creating device:", error);
      const errorMessage = error.message || t("deviceCreateError");
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // In DeviceList.tsx, add these changes to pass round and location names
  const getDeviceInfo = (device: Device) => {
    // Find round title for this device
    let roundTitle;
    if (device.roundId && activeRound && activeRound.id === device.roundId) {
      roundTitle = activeRound.roundTitle;
    }

    // Find location name for this device
    let locationName;
    if (device.roundLocationId && activeRound && activeRound.roundLocations) {
      const location = activeRound.roundLocations.find(
        (rl) => rl.id === device.roundLocationId
      );
      if (location && location.location) {
        locationName = location.location.name;
      }
    }

    return { roundTitle, locationName };
  };

  return (
    <div className="transition-colors duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200">
          {getTitle()}
        </h3>

        {isHackathonCreator && (
          <button
            className={`${
              isAddingDevice
                ? "bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700"
                : "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700"
            } text-white py-1 px-3 sm:px-4 rounded-md text-xs sm:text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-white dark:focus:ring-offset-gray-900`}
            onClick={toggleAddDeviceForm}
            disabled={isSubmitting}
          >
            {isAddingDevice ? t("cancel") : t("addDevice")}
          </button>
        )}
      </div>

      {isAddingDevice && isHackathonCreator && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200">
          <h4 className="text-sm sm:text-md font-medium mb-4 text-gray-800 dark:text-gray-200">
            {t("addNewDevice")}
          </h4>
          {isSubmitting ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner size="md" showText />
            </div>
          ) : (
            <DeviceForm
              hackathonId={hackathonId}
              activeRound={activeRound}
              activeRoundLocationId={activeLocationId} // Pass the roundLocationId
              onSubmit={handleSubmitDevice}
              onCancel={toggleAddDeviceForm}
            />
          )}
          {formError && (
            <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs sm:text-sm rounded transition-colors duration-200">
              {formError}
            </div>
          )}
        </div>
      )}

      {devices.length === 0 ? (
        <div className="text-center py-6 sm:py-8 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors duration-200">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t("noDevicesFound")}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200">
          {devices.map((device) => {
            const { roundTitle, locationName } = getDeviceInfo(device);
            return (
              <DeviceItem
                key={device.id}
                device={device}
                isExpanded={expandedDeviceIds.includes(device.id)}
                onToggleExpansion={() => toggleDeviceExpansion(device.id)}
                hackathonId={hackathonId}
                onDeviceDeleted={onDeviceDeleted}
                isHackathonCreator={isHackathonCreator}
                roundTitle={roundTitle}
                locationName={locationName}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DeviceList;
