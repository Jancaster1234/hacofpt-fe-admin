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
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
  const t = useTranslations("deviceManagement");
  const toast = useToast();

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
        // Show success toast
        toast.success(response.message || t("deviceUpdatedSuccess"));

        // Update the device in the parent component
        setIsEditing(false);
        window.location.reload();
      }
    } catch (error) {
      console.error(`Error updating device ${device.id}:`, error);
      setUpdateError("Failed to update device. Please try again.");

      // Show error toast
      toast.error((error as any)?.message || t("deviceUpdateFailed"));
      throw error;
    }
  };

  const handleDeleteDevice = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (window.confirm(t("deleteDeviceConfirm", { deviceName: device.name }))) {
      setIsDeleting(true);
      try {
        const response = await deviceService.deleteDevice(device.id);
        if (response.message) {
          // Show success toast
          toast.success(response.message || t("deviceDeletedSuccess"));
          onDeviceDeleted(device.id);
        }
      } catch (error) {
        console.error(`Error deleting device ${device.id}:`, error);
        // Show error toast
        toast.error((error as any)?.message || t("deviceDeleteFailed"));
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleUploadFiles = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Keep the alert for now as requested
    alert(t("uploadFilesAlert", { deviceId: device.id }));
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
      AVAILABLE:
        "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100",
      IN_USE: "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100",
      DAMAGED: "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100",
      LOST: "bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-100",
      RETIRED: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100",
      PENDING:
        "bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          colorMap[status] ||
          "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
        } transition-colors duration-200`}
        aria-label={t(`status.${status.toLowerCase()}`)}
      >
        {t(`status.${status.toLowerCase()}`)}
      </span>
    );
  };

  return (
    <li className="py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-colors duration-200">
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 p-2 transition-all duration-200"
        onClick={onToggleExpansion}
        aria-expanded={isExpanded}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onToggleExpansion();
          }
        }}
      >
        <div className="flex items-center mb-2 sm:mb-0">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm transition-colors duration-200">
            <span className="text-lg" role="img" aria-label={t("deviceIcon")}>
              💻
            </span>
          </div>
          <div className="ml-4">
            <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-200">
              {device.name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
              {device.description}
            </p>
          </div>
        </div>
        <div className="flex items-center ml-14 sm:ml-0">
          {renderStatusBadge(device.status)}
          <span
            className="ml-2 text-gray-500 dark:text-gray-400 transition-transform duration-200"
            aria-hidden="true"
          >
            {isExpanded ? "▼" : "►"}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2 sm:mt-4 ml-4 sm:ml-14 transition-all duration-300 ease-in-out">
          {isEditing && isHackathonCreator ? (
            <div className="mt-4">
              <h4 className="text-md font-medium mb-4 text-gray-900 dark:text-white transition-colors duration-200">
                {t("editDevice")}
              </h4>
              <DeviceForm
                hackathonId={hackathonId}
                initialData={initialDeviceData}
                onSubmit={handleUpdateDevice}
                onCancel={handleCancelEdit}
                submitButtonText={t("updateDevice")}
              />
              {updateError && (
                <div className="mt-2 p-3 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-200 text-sm rounded transition-colors duration-200">
                  {updateError}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md transition-colors duration-200">
                  <p className="text-gray-500 dark:text-gray-400">
                    {t("createdBy")}
                  </p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {device.createdByUserName}
                  </p>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md transition-colors duration-200">
                  <p className="text-gray-500 dark:text-gray-400">
                    {t("lastUpdated")}
                  </p>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(device.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                {device.roundId && (
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md transition-colors duration-200">
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("round")}
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {roundTitle || device.roundId}
                    </p>
                  </div>
                )}
                {device.roundLocationId && (
                  <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-md transition-colors duration-200">
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("location")}
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {locationName || device.roundLocationId}
                    </p>
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
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-1 px-3 rounded text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={handleEditDevice}
                    disabled={isDeleting}
                    aria-label={t("editDevice")}
                  >
                    {t("edit")}
                  </button>
                  <button
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-1 px-3 rounded text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={handleUploadFiles}
                    disabled={isDeleting || isEditing}
                    aria-label={t("uploadFiles")}
                  >
                    {t("uploadFiles")}
                  </button>
                  <button
                    className="bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-800 dark:text-red-100 py-1 px-3 rounded text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={handleDeleteDevice}
                    disabled={isDeleting || isEditing}
                    aria-label={isDeleting ? t("deleting") : t("delete")}
                  >
                    {isDeleting ? (
                      <span className="flex items-center">
                        <LoadingSpinner size="sm" className="mr-1" />{" "}
                        {t("deleting")}
                      </span>
                    ) : (
                      t("delete")
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </li>
  );
};

export default DeviceItem;
