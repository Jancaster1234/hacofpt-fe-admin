// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement.tsx
import React, { useState, useEffect } from "react";
import { fetchMockDevices } from "../_mocks/fetchMockDevices";
import { fetchMockRounds } from "../_mocks/fetchMockRounds";
import { fetchMockFileUrls } from "../_mocks/fetchMockFileUrls";
import { Device } from "@/types/entities/device";
import { Round } from "@/types/entities/round";
import { FileUrl } from "@/types/entities/fileUrl";

interface DeviceManagementProps {
  hackathonId: string;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({ hackathonId }) => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceFiles, setDeviceFiles] = useState<{ [key: string]: FileUrl[] }>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [activeRoundId, setActiveRoundId] = useState<string | null>(null);
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);
  const [expandedDeviceIds, setExpandedDeviceIds] = useState<string[]>([]);

  // Fetch rounds on component mount
  useEffect(() => {
    const loadRounds = async () => {
      setLoading(true);
      try {
        const fetchedRounds = await fetchMockRounds(hackathonId);
        setRounds(fetchedRounds);

        // Initially load all devices without round/location filter
        const allDevices = await fetchMockDevices({ hackathonId });
        setDevices(allDevices);
      } catch (error) {
        console.error("Error loading rounds or devices:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRounds();
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

  // Fetch device files when a device is expanded
  const toggleDeviceExpansion = async (deviceId: string) => {
    if (expandedDeviceIds.includes(deviceId)) {
      // If already expanded, collapse it
      setExpandedDeviceIds(expandedDeviceIds.filter((id) => id !== deviceId));
    } else {
      // Expand and fetch files if not already fetched
      setExpandedDeviceIds([...expandedDeviceIds, deviceId]);

      if (!deviceFiles[deviceId]) {
        try {
          const files = await fetchMockFileUrls({ deviceId });
          setDeviceFiles((prev) => ({ ...prev, [deviceId]: files }));
        } catch (error) {
          console.error(`Error fetching files for device ${deviceId}:`, error);
        }
      }
    }
  };

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

  // Display files for a device
  const renderDeviceFiles = (deviceId: string) => {
    const files = deviceFiles[deviceId] || [];

    if (files.length === 0) {
      return (
        <p className="text-gray-500 ml-8 italic">
          No files associated with this device
        </p>
      );
    }

    return (
      <div className="ml-8 mt-2">
        <h4 className="font-medium text-sm">Associated Files:</h4>
        <ul className="divide-y divide-gray-200">
          {files.map((file) => (
            <li key={file.id} className="py-2 flex items-center">
              <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                {getFileIcon(file.fileType)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {file.fileName}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.fileSize)} • {formatDate(file.createdAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Helper function to get file icon based on type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <span className="text-blue-500">🖼️</span>;
    } else if (fileType.includes("pdf")) {
      return <span className="text-red-500">📄</span>;
    } else if (fileType.includes("word") || fileType.includes("document")) {
      return <span className="text-indigo-500">📝</span>;
    } else {
      return <span className="text-gray-500">📎</span>;
    }
  };

  // Helper function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    const colorMap: { [key: string]: string } = {
      AVAILABLE: "bg-green-100 text-green-800",
      IN_USE: "bg-blue-100 text-blue-800",
      DAMAGED: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          colorMap[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Device Management</h2>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && (
        <>
          {/* Navigation tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6">
              <button
                onClick={() => handleRoundSelect(null)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeRoundId === null
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                All Devices
              </button>

              {rounds.map((round) => (
                <button
                  key={round.id}
                  onClick={() => handleRoundSelect(round.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeRoundId === round.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {round.roundTitle}
                </button>
              ))}
            </nav>
          </div>

          {/* Round location tabs (shown only when a round is selected) */}
          {activeRound &&
            activeRound.roundLocations &&
            activeRound.roundLocations.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium mb-2">Locations</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleLocationSelect(null)}
                    className={`py-1 px-3 rounded-full text-sm ${
                      activeLocationId === null
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    All Locations
                  </button>

                  {activeRound.roundLocations.map((rl) => (
                    <button
                      key={rl.id}
                      onClick={() => handleLocationSelect(rl.location.id)}
                      className={`py-1 px-3 rounded-full text-sm ${
                        activeLocationId === rl.location.id
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {rl.location.name} ({rl.type})
                    </button>
                  ))}
                </div>
              </div>
            )}

          {/* Devices section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {activeRound
                  ? activeLocationId
                    ? `Devices at ${
                        activeRound.roundLocations.find(
                          (rl) => rl.location.id === activeLocationId
                        )?.location.name
                      }`
                    : `Devices for ${activeRound.roundTitle}`
                  : "All Hackathon Devices"}
              </h3>

              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded-md text-sm"
                onClick={() =>
                  alert("Add device functionality to be implemented")
                }
              >
                Add Device
              </button>
            </div>

            {devices.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No devices found for this selection.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {devices.map((device) => (
                  <li key={device.id} className="py-4">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleDeviceExpansion(device.id)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">💻</span>
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium">{device.name}</h4>
                          <p className="text-sm text-gray-500">
                            {device.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {renderStatusBadge(device.status)}
                        <span className="ml-2">
                          {expandedDeviceIds.includes(device.id) ? "▼" : "►"}
                        </span>
                      </div>
                    </div>

                    {expandedDeviceIds.includes(device.id) && (
                      <>
                        <div className="mt-4 ml-14 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Created by</p>
                            <p>{device.createdByUserName}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Last updated</p>
                            <p>
                              {new Date(device.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {renderDeviceFiles(device.id)}
                        <div className="mt-4 ml-14 flex gap-2">
                          <button
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Edit device ${device.id}`);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Upload files for device ${device.id}`);
                            }}
                          >
                            Upload Files
                          </button>
                          <button
                            className="bg-red-100 hover:bg-red-200 text-red-800 py-1 px-3 rounded text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Delete device ${device.id}`);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DeviceManagement;
