// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/DeviceItem.tsx
import React, { useState, useEffect } from "react";
import { Device } from "@/types/entities/device";
import { FileUrl } from "@/types/entities/fileUrl";
import { UserDevice } from "@/types/entities/userDevice";
import { User } from "@/types/entities/user";
import DeviceFiles from "./DeviceFiles";
import UserDevicesTabs from "./UserDevicesTabs";
import DeviceForm from "./DeviceForm";
import { fileUrlService } from "@/services/fileUrl.service";
import { userDeviceService } from "@/services/userDevice.service";
import { userService } from "@/services/user.service";
import { deviceService } from "@/services/device.service";

interface DeviceItemProps {
  device: Device;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  hackathonId: string;
  onDeviceDeleted: (deviceId: string) => void;
  isHackathonCreator: boolean;
  roundTitle?: string;
  locationName?: string;
}

const DeviceItem: React.FC<DeviceItemProps> = ({
  device,
  isExpanded,
  onToggleExpansion,
  hackathonId,
  onDeviceDeleted,
  isHackathonCreator,
  roundTitle,
  locationName,
}) => {
  // Device files state
  const [deviceFiles, setDeviceFiles] = useState<FileUrl[]>([]);
  const [loadingDeviceFiles, setLoadingDeviceFiles] = useState<boolean>(false);

  // User devices state
  const [userDevices, setUserDevices] = useState<UserDevice[]>([]);
  const [loadingUserDevices, setLoadingUserDevices] = useState<boolean>(false);
  const [activeUserDeviceId, setActiveUserDeviceId] = useState<string | null>(
    null
  );

  // User info state
  const [userInfo, setUserInfo] = useState<{ [userId: string]: User }>({});

  // Delete and edit loading state
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    if (isExpanded) {
      loadDeviceFiles();
      loadUserDevices();
    }
  }, [isExpanded]);

  const loadDeviceFiles = async () => {
    if (!deviceFiles.length && !loadingDeviceFiles) {
      setLoadingDeviceFiles(true);
      try {
        const response = await fileUrlService.getFileUrlsByDeviceId(device.id);
        if (response.data) {
          setDeviceFiles(response.data);
        }
      } catch (error) {
        console.error(`Error fetching files for device ${device.id}:`, error);
      } finally {
        setLoadingDeviceFiles(false);
      }
    }
  };

  const loadUserDevices = async () => {
    setLoadingUserDevices(true);
    try {
      const response = await userDeviceService.getUserDevicesByDeviceId(
        device.id
      );
      if (response.data) {
        setUserDevices(response.data);

        // If we got user devices, set the first one as active
        if (response.data.length > 0) {
          setActiveUserDeviceId(response.data[0].id);

          // Fetch user info for each user device
          await fetchUsersInfo(response.data);
        }
      }
    } catch (error) {
      console.error(
        `Error fetching user devices for device ${device.id}:`,
        error
      );
    } finally {
      setLoadingUserDevices(false);
    }
  };

  const fetchUsersInfo = async (userDevices: UserDevice[]) => {
    const userIdsToFetch = userDevices
      .filter((ud) => ud.userId && !userInfo[ud.userId])
      .map((ud) => ud.userId);

    // Remove duplicates
    const uniqueUserIds = [...new Set(userIdsToFetch)];

    // Fetch user info for each unique user ID
    for (const userId of uniqueUserIds) {
      if (userId) {
        try {
          const userResponse = await userService.getUserById(userId);
          if (userResponse.data) {
            setUserInfo((prev) => ({
              ...prev,
              [userResponse.data.id]: userResponse.data,
            }));
          }
        } catch (error) {
          console.error(`Error fetching user info for ${userId}:`, error);
        }
      }
    }
  };

  const handleUserDeviceSelect = (userDeviceId: string) => {
    setActiveUserDeviceId(userDeviceId);
  };

  const handleUserDevicesUpdated = () => {
    // Reload user devices
    loadUserDevices();
  };

  const handleEditDevice = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdateError(null);
  };

  const handleUpdateDevice = async (formData: any) => {
    try {
      const deviceData = {
        hackathonId,
        roundId: formData.roundId || "",
        roundLocationId: formData.roundLocationId || "",
        name: formData.name,
        description: formData.description,
        status: formData.status,
        quantity: formData.quantity,
        files: formData.files || [],
      };

      const response = await deviceService.updateDevice(device.id, deviceData);

      if (response.data) {
        // Update the device in the parent component
        // For now we'll just close the edit form and refresh the page
        // In a real app, you might want to update the device in the parent's state
        setIsEditing(false);
        window.location.reload();
      }
    } catch (error) {
      console.error(`Error updating device ${device.id}:`, error);
      setUpdateError("Failed to update device. Please try again.");
      throw error;
    }
  };

  const handleDeleteDevice = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (window.confirm(`Are you sure you want to delete ${device.name}?`)) {
      setIsDeleting(true);
      try {
        const response = await deviceService.deleteDevice(device.id);
        if (response.message) {
          onDeviceDeleted(device.id);
        }
      } catch (error) {
        console.error(`Error deleting device ${device.id}:`, error);
        alert("Failed to delete device. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleUploadFiles = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Keep the alert for now as requested
    alert(`Upload files for device ${device.id}`);
  };

  // Prepare initial data for the form
  const initialDeviceData = {
    id: device.id,
    name: device.name,
    description: device.description || "",
    status: device.status,
    quantity: device.quantity || 1,
    roundId: device.roundId || "",
    roundLocationId: device.roundLocationId || "",
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    const colorMap: { [key: string]: string } = {
      AVAILABLE: "bg-green-100 text-green-800",
      IN_USE: "bg-blue-100 text-blue-800",
      DAMAGED: "bg-red-100 text-red-800",
      LOST: "bg-orange-100 text-orange-800",
      RETIRED: "bg-gray-100 text-gray-800",
      PENDING: "bg-yellow-100 text-yellow-800",
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
    <li className="py-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggleExpansion}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-lg">💻</span>
          </div>
          <div className="ml-4">
            <h4 className="font-medium">{device.name}</h4>
            <p className="text-sm text-gray-500">{device.description}</p>
          </div>
        </div>
        <div className="flex items-center">
          {renderStatusBadge(device.status)}
          <span className="ml-2">{isExpanded ? "▼" : "►"}</span>
        </div>
      </div>

      {isExpanded && (
        <>
          {isEditing && isHackathonCreator ? (
            <div className="mt-4 ml-14">
              <h4 className="text-md font-medium mb-4">Edit Device</h4>
              <DeviceForm
                hackathonId={hackathonId}
                initialData={initialDeviceData}
                onSubmit={handleUpdateDevice}
                onCancel={handleCancelEdit}
                submitButtonText="Update Device"
              />
              {updateError && (
                <div className="mt-2 p-3 bg-red-50 text-red-600 text-sm rounded">
                  {updateError}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mt-4 ml-14 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Created by</p>
                  <p>{device.createdByUserName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Last updated</p>
                  <p>{new Date(device.updatedAt).toLocaleDateString()}</p>
                </div>
                {device.roundId && (
                  <div>
                    <p className="text-gray-500">Round</p>
                    <p>{roundTitle || device.roundId}</p>
                  </div>
                )}
                {device.roundLocationId && (
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p>{locationName || device.roundLocationId}</p>
                  </div>
                )}
              </div>

              {/* Device files */}
              <DeviceFiles files={deviceFiles} isLoading={loadingDeviceFiles} />

              {/* User devices */}
              <UserDevicesTabs
                userDevices={userDevices}
                isLoading={loadingUserDevices}
                activeUserDeviceId={activeUserDeviceId}
                userInfo={userInfo}
                onUserDeviceSelect={handleUserDeviceSelect}
                hackathonId={hackathonId}
                deviceId={device.id}
                onUserDevicesUpdated={handleUserDevicesUpdated}
                isHackathonCreator={isHackathonCreator}
              />

              {/* Only render action buttons if user is hackathon creator */}
              {isHackathonCreator && (
                <div className="mt-4 ml-14 flex gap-2">
                  <button
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded text-sm"
                    onClick={handleEditDevice}
                    disabled={isDeleting}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded text-sm"
                    onClick={handleUploadFiles}
                    disabled={isDeleting || isEditing}
                  >
                    Upload Files
                  </button>
                  <button
                    className="bg-red-100 hover:bg-red-200 text-red-800 py-1 px-3 rounded text-sm"
                    onClick={handleDeleteDevice}
                    disabled={isDeleting || isEditing}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </li>
  );
};

export default DeviceItem;
