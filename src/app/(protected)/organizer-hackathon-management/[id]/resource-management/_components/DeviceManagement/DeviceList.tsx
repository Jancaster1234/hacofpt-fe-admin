// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/DeviceList.tsx
import React, { useState } from "react";
import { Device } from "@/types/entities/device";
import { Round } from "@/types/entities/round";
import DeviceItem from "./DeviceItem";
import DeviceForm from "./DeviceForm";
import { deviceService } from "@/services/device.service";

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
  const [expandedDeviceIds, setExpandedDeviceIds] = useState<string[]>([]);
  const [isAddingDevice, setIsAddingDevice] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

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

    return roundLocation?.location?.name || "Unknown Location";
  };

  const getTitle = () => {
    if (activeRound) {
      if (activeLocationId) {
        return `Devices at ${getLocationName()}`;
      } else {
        return `Devices for ${activeRound.roundTitle}`;
      }
    } else {
      return "All Hackathon Devices";
    }
  };

  const toggleAddDeviceForm = () => {
    setIsAddingDevice(!isAddingDevice);
    setFormError(null);
  };

  const handleSubmitDevice = async (formData: any) => {
    try {
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
      }
    } catch (error) {
      console.error("Error creating device:", error);
      setFormError("Failed to create device. Please try again.");
      throw error;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{getTitle()}</h3>

        {isHackathonCreator && (
          <button
            className={`${
              isAddingDevice
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white py-1 px-4 rounded-md text-sm`}
            onClick={toggleAddDeviceForm}
          >
            {isAddingDevice ? "Cancel" : "Add Device"}
          </button>
        )}
      </div>

      {isAddingDevice && isHackathonCreator && (
        <div className="mb-6">
          <h4 className="text-md font-medium mb-4">Add New Device</h4>
          <DeviceForm
            hackathonId={hackathonId}
            activeRound={activeRound}
            activeRoundLocationId={activeLocationId} // Pass the roundLocationId
            onSubmit={handleSubmitDevice}
            onCancel={toggleAddDeviceForm}
          />
          {formError && (
            <div className="mt-2 p-3 bg-red-50 text-red-600 text-sm rounded">
              {formError}
            </div>
          )}
        </div>
      )}

      {devices.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No devices found for this selection.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {devices.map((device) => (
            <DeviceItem
              key={device.id}
              device={device}
              isExpanded={expandedDeviceIds.includes(device.id)}
              onToggleExpansion={() => toggleDeviceExpansion(device.id)}
              hackathonId={hackathonId}
              onDeviceDeleted={onDeviceDeleted}
              isHackathonCreator={isHackathonCreator}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeviceList;
