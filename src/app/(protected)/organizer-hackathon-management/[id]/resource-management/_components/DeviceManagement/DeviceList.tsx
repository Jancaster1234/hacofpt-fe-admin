// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/DeviceList.tsx
import React, { useState } from "react";
import { Device } from "@/types/entities/device";
import { Round } from "@/types/entities/round";
import DeviceItem from "./DeviceItem";

interface DeviceListProps {
  devices: Device[];
  activeRound: Round | null;
  activeLocationId: string | null;
  hackathonId: string;
}

const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  activeRound,
  activeLocationId,
  hackathonId,
}) => {
  const [expandedDeviceIds, setExpandedDeviceIds] = useState<string[]>([]);

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

    const location = activeRound.roundLocations.find(
      (rl) => rl.location.id === activeLocationId
    );

    return location?.location.name;
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{getTitle()}</h3>

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-md text-sm"
          onClick={() => alert("Add device functionality to be implemented")}
        >
          Add Device
        </button>
      </div>

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
              onToggleExpand={() => toggleDeviceExpansion(device.id)}
              hackathonId={hackathonId}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeviceList;
