// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/DeviceList.tsx
import React, { useState } from "react";
import { Device, DeviceStatus } from "@/types/entities/device";
import { Round } from "@/types/entities/round";
import DeviceItem from "./DeviceItem";
import { deviceService } from "@/services/device.service";

interface DeviceListProps {
  devices: Device[];
  activeRound: Round | null;
  activeLocationId: string | null;
  hackathonId: string;
  onDeviceAdded: (device: Device) => void;
  onDeviceDeleted: (deviceId: string) => void;
}

const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  activeRound,
  activeLocationId,
  hackathonId,
  onDeviceAdded,
  onDeviceDeleted,
}) => {
  const [expandedDeviceIds, setExpandedDeviceIds] = useState<string[]>([]);
  const [isAddingDevice, setIsAddingDevice] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "AVAILABLE" as DeviceStatus,
    files: [] as File[],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const toggleAddDeviceForm = () => {
    setIsAddingDevice(!isAddingDevice);
    // Reset form when toggling
    if (!isAddingDevice) {
      setFormData({
        name: "",
        description: "",
        status: "AVAILABLE" as DeviceStatus,
        files: [],
      });
      setErrors({});
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user changes input
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        files: Array.from(e.target.files),
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Device name is required";
    }

    if (!activeRound) {
      newErrors.round = "Please select a round";
    }

    if (activeRound && !activeLocationId) {
      newErrors.location = "Please select a location";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const deviceData = {
        hackathonId,
        roundId: activeRound?.id || "",
        roundLocationId: activeLocationId || "",
        name: formData.name,
        description: formData.description,
        status: formData.status,
        files: formData.files,
      };

      const response = await deviceService.createDevice(deviceData);

      if (response.data) {
        onDeviceAdded(response.data);
        toggleAddDeviceForm();
      }
    } catch (error) {
      console.error("Error creating device:", error);
      setErrors({
        ...errors,
        form: "Failed to create device. Please try again.",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{getTitle()}</h3>

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
      </div>

      {isAddingDevice && (
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h4 className="text-md font-medium mb-4">Add New Device</h4>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
                  placeholder="Enter device name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="IN_USE">IN USE</option>
                  <option value="DAMAGED">DAMAGED</option>
                  <option value="LOST">LOST</option>
                  <option value="RETIRED">RETIRED</option>
                  <option value="PENDING">PENDING</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Enter device description"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Device Files
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload device manuals, specifications, etc.
                </p>
              </div>
            </div>

            {(errors.round || errors.location) && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded">
                {errors.round && <p>{errors.round}</p>}
                {errors.location && <p>{errors.location}</p>}
              </div>
            )}

            {errors.form && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded">
                {errors.form}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={toggleAddDeviceForm}
                className="mr-2 px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                Create Device
              </button>
            </div>
          </form>
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
              onToggleExpand={() => toggleDeviceExpansion(device.id)}
              hackathonId={hackathonId}
              onDeviceDeleted={onDeviceDeleted}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeviceList;
