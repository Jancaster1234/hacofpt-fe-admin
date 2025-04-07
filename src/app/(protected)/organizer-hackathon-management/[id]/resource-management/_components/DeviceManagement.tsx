// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement.tsx
import React, { useState, useEffect } from "react";
import { fetchMockDevices } from "../_mocks/fetchMockDevices";
import { fetchMockRounds } from "../_mocks/fetchMockRounds";
import { fetchMockFileUrls } from "../_mocks/fetchMockFileUrls";
import { fetchMockUserDevices } from "../_mocks/fetchMockUserDevices";
import { fetchMockUserById } from "../_mocks/fetchMockUserById";
import { fetchMockUserDeviceTracks } from "../_mocks/fetchMockUserDeviceTracks";
import { Device } from "@/types/entities/device";
import { Round } from "@/types/entities/round";
import { FileUrl } from "@/types/entities/fileUrl";
import { UserDevice } from "@/types/entities/userDevice";
import { User } from "@/types/entities/user";
import { UserDeviceTrack } from "@/types/entities/userDeviceTrack";

interface DeviceManagementProps {
  hackathonId: string;
}

const DeviceManagement: React.FC<DeviceManagementProps> = ({ hackathonId }) => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeRoundId, setActiveRoundId] = useState<string | null>(null);
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);

  // Device expansion state
  const [expandedDeviceIds, setExpandedDeviceIds] = useState<string[]>([]);

  // User devices state
  const [deviceUserDevices, setDeviceUserDevices] = useState<{
    [deviceId: string]: UserDevice[];
  }>({});
  const [loadingUserDevices, setLoadingUserDevices] = useState<{
    [deviceId: string]: boolean;
  }>({});

  // User info state
  const [userInfo, setUserInfo] = useState<{
    [userId: string]: User;
  }>({});

  // Active user device tab state
  const [activeUserDeviceTabs, setActiveUserDeviceTabs] = useState<{
    [deviceId: string]: string; // deviceId -> userDeviceId
  }>({});

  // User device tracks state
  const [userDeviceTracks, setUserDeviceTracks] = useState<{
    [userDeviceId: string]: UserDeviceTrack[];
  }>({});
  const [loadingUserDeviceTracks, setLoadingUserDeviceTracks] = useState<{
    [userDeviceId: string]: boolean;
  }>({});

  // Expanded user device track state
  const [expandedTrackIds, setExpandedTrackIds] = useState<string[]>([]);

  // Track files state
  const [trackFiles, setTrackFiles] = useState<{
    [userDeviceTrackId: string]: FileUrl[];
  }>({});
  const [loadingTrackFiles, setLoadingTrackFiles] = useState<{
    [userDeviceTrackId: string]: boolean;
  }>({});

  // Device files state (for direct device files, not user device tracks)
  const [deviceFiles, setDeviceFiles] = useState<{
    [deviceId: string]: FileUrl[];
  }>({});
  const [loadingDeviceFiles, setLoadingDeviceFiles] = useState<{
    [deviceId: string]: boolean;
  }>({});

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

        // Reset expanded devices when filters change
        setExpandedDeviceIds([]);
      } catch (error) {
        console.error("Error loading devices:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDevices();
  }, [hackathonId, activeRoundId, activeLocationId]);

  // Handle device expansion and fetch associated files
  const toggleDeviceExpansion = async (deviceId: string) => {
    if (expandedDeviceIds.includes(deviceId)) {
      // If already expanded, collapse it
      setExpandedDeviceIds(expandedDeviceIds.filter((id) => id !== deviceId));
    } else {
      // Expand the device
      setExpandedDeviceIds([...expandedDeviceIds, deviceId]);

      // Fetch device files if not already fetched
      if (!deviceFiles[deviceId] && !loadingDeviceFiles[deviceId]) {
        setLoadingDeviceFiles((prev) => ({ ...prev, [deviceId]: true }));
        try {
          const files = await fetchMockFileUrls({ deviceId });
          setDeviceFiles((prev) => ({ ...prev, [deviceId]: files }));
        } catch (error) {
          console.error(`Error fetching files for device ${deviceId}:`, error);
        } finally {
          setLoadingDeviceFiles((prev) => ({ ...prev, [deviceId]: false }));
        }
      }

      // Fetch user devices if not already fetched
      if (!deviceUserDevices[deviceId] && !loadingUserDevices[deviceId]) {
        setLoadingUserDevices((prev) => ({ ...prev, [deviceId]: true }));
        try {
          const userDevices = await fetchMockUserDevices({ deviceId });
          setDeviceUserDevices((prev) => ({
            ...prev,
            [deviceId]: userDevices,
          }));

          // If we got user devices, set the first one as active
          if (userDevices.length > 0) {
            setActiveUserDeviceTabs((prev) => ({
              ...prev,
              [deviceId]: userDevices[0].id,
            }));

            // Fetch user info for each user device
            for (const userDevice of userDevices) {
              if (userDevice.userId && !userInfo[userDevice.userId]) {
                try {
                  const user = await fetchMockUserById(userDevice.userId);
                  if (user) {
                    setUserInfo((prev) => ({ ...prev, [user.id]: user }));
                  }
                } catch (error) {
                  console.error(
                    `Error fetching user info for ${userDevice.userId}:`,
                    error
                  );
                }
              }
            }
          }
        } catch (error) {
          console.error(
            `Error fetching user devices for device ${deviceId}:`,
            error
          );
        } finally {
          setLoadingUserDevices((prev) => ({ ...prev, [deviceId]: false }));
        }
      }
    }
  };

  // Handle user device tab selection and fetch user device tracks
  const handleUserDeviceTabSelect = async (
    deviceId: string,
    userDeviceId: string
  ) => {
    setActiveUserDeviceTabs((prev) => ({ ...prev, [deviceId]: userDeviceId }));

    // Fetch user device tracks if not already fetched
    if (
      !userDeviceTracks[userDeviceId] &&
      !loadingUserDeviceTracks[userDeviceId]
    ) {
      setLoadingUserDeviceTracks((prev) => ({ ...prev, [userDeviceId]: true }));
      try {
        const tracks = await fetchMockUserDeviceTracks({ userDeviceId });
        setUserDeviceTracks((prev) => ({ ...prev, [userDeviceId]: tracks }));
      } catch (error) {
        console.error(
          `Error fetching user device tracks for ${userDeviceId}:`,
          error
        );
      } finally {
        setLoadingUserDeviceTracks((prev) => ({
          ...prev,
          [userDeviceId]: false,
        }));
      }
    }
  };

  // Toggle track expansion and fetch associated files
  const toggleTrackExpansion = async (trackId: string) => {
    if (expandedTrackIds.includes(trackId)) {
      // Collapse if already expanded
      setExpandedTrackIds(expandedTrackIds.filter((id) => id !== trackId));
    } else {
      // Expand and fetch track files if not already fetched
      setExpandedTrackIds([...expandedTrackIds, trackId]);

      if (!trackFiles[trackId] && !loadingTrackFiles[trackId]) {
        setLoadingTrackFiles((prev) => ({ ...prev, [trackId]: true }));
        try {
          const files = await fetchMockFileUrls({ userDeviceTrackId: trackId });
          setTrackFiles((prev) => ({ ...prev, [trackId]: files }));
        } catch (error) {
          console.error(`Error fetching files for track ${trackId}:`, error);
        } finally {
          setLoadingTrackFiles((prev) => ({ ...prev, [trackId]: false }));
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

  // Render device files
  const renderDeviceFiles = (deviceId: string) => {
    if (loadingDeviceFiles[deviceId]) {
      return <p className="text-gray-500 ml-8">Loading files...</p>;
    }

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

  // Render user devices for a device
  const renderUserDevices = (deviceId: string) => {
    if (loadingUserDevices[deviceId]) {
      return <p className="text-gray-500 ml-8">Loading user assignments...</p>;
    }

    const userDevicesList = deviceUserDevices[deviceId] || [];

    if (userDevicesList.length === 0) {
      return (
        <p className="text-gray-500 ml-8 italic">
          No user assignments for this device
        </p>
      );
    }

    const activeUserDeviceId = activeUserDeviceTabs[deviceId];

    return (
      <div className="ml-8 mt-4">
        <h4 className="font-medium text-sm mb-2">Device Assignments:</h4>

        {/* User device tabs */}
        <div className="flex space-x-2 border-b border-gray-200 mb-4">
          {userDevicesList.map((userDevice) => {
            const user = userDevice.userId ? userInfo[userDevice.userId] : null;
            const userName = user
              ? `${user.firstName} ${user.lastName}`
              : "Unknown User";

            return (
              <button
                key={userDevice.id}
                onClick={() =>
                  handleUserDeviceTabSelect(deviceId, userDevice.id)
                }
                className={`py-2 px-4 text-sm font-medium ${
                  activeUserDeviceId === userDevice.id
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {userName}
              </button>
            );
          })}
        </div>

        {/* Active user device details */}
        {activeUserDeviceId &&
          renderUserDeviceDetails(deviceId, activeUserDeviceId)}
      </div>
    );
  };

  // Render details for the active user device
  const renderUserDeviceDetails = (deviceId: string, userDeviceId: string) => {
    const userDevice = deviceUserDevices[deviceId]?.find(
      (ud) => ud.id === userDeviceId
    );

    if (!userDevice) return null;

    const user = userDevice.userId ? userInfo[userDevice.userId] : null;

    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        {user && (
          <div className="mb-4">
            <h5 className="font-medium">User Information</h5>
            <p className="text-sm">
              Name: {user.firstName} {user.lastName}
            </p>
            <p className="text-sm">Email: {user.email}</p>
            <p className="text-sm">
              Role: {user.userRoles[0]?.role.name || "Unknown"}
            </p>
          </div>
        )}

        <div className="mb-4">
          <h5 className="font-medium">Assignment Details</h5>
          <p className="text-sm">
            Status:{" "}
            <span className={getStatusColorClass(userDevice.status)}>
              {userDevice.status}
            </span>
          </p>
          <p className="text-sm">From: {formatDateTime(userDevice.timeFrom)}</p>
          <p className="text-sm">To: {formatDateTime(userDevice.timeTo)}</p>
          <p className="text-sm">Created by: {userDevice.createdByUserName}</p>
        </div>

        {/* User device tracks */}
        <div className="mt-4">
          <h5 className="font-medium mb-2">Device Tracking History</h5>
          {renderUserDeviceTracks(userDeviceId)}
        </div>
      </div>
    );
  };

  // Render user device tracks
  const renderUserDeviceTracks = (userDeviceId: string) => {
    if (loadingUserDeviceTracks[userDeviceId]) {
      return (
        <p className="text-gray-500 text-sm">Loading tracking history...</p>
      );
    }

    const tracks = userDeviceTracks[userDeviceId] || [];

    if (tracks.length === 0) {
      return (
        <p className="text-gray-500 italic text-sm">
          No tracking history available
        </p>
      );
    }

    return (
      <ul className="divide-y divide-gray-200">
        {tracks.map((track) => (
          <li key={track.id} className="py-3">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleTrackExpansion(track.id)}
            >
              <div>
                <p
                  className={`text-sm font-medium ${getQualityStatusColorClass(
                    track.deviceQualityStatus
                  )}`}
                >
                  {track.deviceQualityStatus}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(track.createdAt)} • {track.note}
                </p>
              </div>
              <span>{expandedTrackIds.includes(track.id) ? "▼" : "►"}</span>
            </div>

            {/* Expanded track files */}
            {expandedTrackIds.includes(track.id) && renderTrackFiles(track.id)}
          </li>
        ))}
      </ul>
    );
  };

  // Render files for a track
  const renderTrackFiles = (trackId: string) => {
    if (loadingTrackFiles[trackId]) {
      return (
        <p className="text-gray-500 text-sm ml-4 mt-2">Loading files...</p>
      );
    }

    const files = trackFiles[trackId] || [];

    if (files.length === 0) {
      return (
        <p className="text-gray-500 italic text-sm ml-4 mt-2">
          No files attached to this record
        </p>
      );
    }

    return (
      <div className="ml-4 mt-2">
        <h6 className="text-xs font-medium text-gray-500">Attached Files:</h6>
        <ul className="grid grid-cols-2 gap-2 mt-1">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center p-2 bg-white rounded border border-gray-200"
            >
              <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded flex items-center justify-center">
                {getFileIcon(file.fileType)}
              </div>
              <div className="ml-2 overflow-hidden">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {file.fileName}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.fileSize)}
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

  // Helper function to format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Helper function to get status color class
  const getStatusColorClass = (status: string) => {
    const colorMap: { [key: string]: string } = {
      ASSIGNED: "text-blue-600",
      RETURNED: "text-green-600",
      LOST: "text-red-600",
      DAMAGED: "text-orange-600",
    };

    return colorMap[status] || "text-gray-600";
  };

  // Helper function to get quality status color class
  const getQualityStatusColorClass = (status: string) => {
    const colorMap: { [key: string]: string } = {
      EXCELLENT: "text-green-600",
      GOOD: "text-blue-600",
      FAIR: "text-yellow-600",
      POOR: "text-orange-600",
      NEEDS_REPAIR: "text-red-600",
    };

    return colorMap[status] || "text-gray-600";
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

                        {/* Device files */}
                        {renderDeviceFiles(device.id)}

                        {/* User devices */}
                        {renderUserDevices(device.id)}

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
