// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/UserDeviceDetails.tsx
import React, { useState, useEffect } from "react";
import { UserDevice } from "@/types/entities/userDevice";
import { User } from "@/types/entities/user";
import { formatDateTime, getStatusColorClass } from "../../_utils/formatters";
import TrackingHistory from "./TrackingHistory";
import { UserDeviceTrack } from "@/types/entities/userDeviceTrack";
import UserDeviceForm from "./UserDeviceForm";
import { userDeviceService } from "@/services/userDevice.service";
import { FileUrl } from "@/types/entities/fileUrl";
import { fileUrlService } from "@/services/fileUrl.service";
import { userDeviceTrackService } from "@/services/userDeviceTrack.service";
import FilesList from "./FilesList";
import { useAuth } from "@/hooks/useAuth_v0";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";

interface UserDeviceDetailsProps {
  userDevice: UserDevice;
  userInfo: { [userId: string]: User };
  hackathonId: string;
  onUserDeviceUpdated: () => void;
  onUserDeviceDeleted: () => void;
  isHackathonCreator: boolean;
}

const UserDeviceDetails: React.FC<UserDeviceDetailsProps> = ({
  userDevice,
  userInfo,
  hackathonId,
  onUserDeviceUpdated,
  onUserDeviceDeleted,
  isHackathonCreator,
}) => {
  const t = useTranslations("userDeviceDetails");
  const toast = useToast();

  const [tracks, setTracks] = useState<UserDeviceTrack[]>([]);
  const [loadingTracks, setLoadingTracks] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userDeviceFiles, setUserDeviceFiles] = useState<FileUrl[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Get current user information
  const { user } = useAuth();

  // Get the user from userInfo
  const deviceOwner = userDevice.userId ? userInfo[userDevice.userId] : null;

  // Check if current user is the device owner
  const isDeviceOwner = user?.id === userDevice.userId;

  useEffect(() => {
    loadTracksAndFiles();
  }, [userDevice.id]);

  const loadTracksAndFiles = () => {
    loadTracks();
    loadFiles();
  };

  const loadTracks = async () => {
    setLoadingTracks(true);
    try {
      const response =
        await userDeviceTrackService.getUserDeviceTracksByUserDeviceId(
          userDevice.id
        );
      if (response.data) {
        setTracks(response.data);
      }
    } catch (error) {
      console.error(
        `Error fetching user device tracks for ${userDevice.id}:`,
        error
      );
    } finally {
      setLoadingTracks(false);
    }
  };

  const loadFiles = async () => {
    setLoadingFiles(true);
    try {
      const response = await fileUrlService.getFileUrlsByUserDeviceId(
        userDevice.id
      );
      if (response.data) {
        setUserDeviceFiles(response.data);
      }
    } catch (error) {
      console.error(
        `Error fetching files for user device ${userDevice.id}:`,
        error
      );
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleUpdateUserDevice = async (formData: any) => {
    setIsUpdating(true);
    setError(null);

    try {
      const updateData = {
        userId: formData.userId,
        deviceId: userDevice.deviceId,
        timeFrom: formData.timeFrom,
        timeTo: formData.timeTo,
        status: formData.status,
        files: formData.files || [],
      };

      const response = await userDeviceService.updateUserDevice(
        userDevice.id,
        updateData
      );

      if (response.data) {
        setIsEditing(false);
        onUserDeviceUpdated();
        toast.success(response.message || t("updateSuccess"));
      }
    } catch (error: any) {
      console.error(`Error updating user device ${userDevice.id}:`, error);
      setError(error?.message || t("updateError"));
      toast.error(error?.message || t("updateError"));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUserDevice = async () => {
    if (window.confirm(t("deleteConfirm"))) {
      setIsDeleting(true);
      try {
        const response = await userDeviceService.deleteUserDevice(
          userDevice.id
        );
        if (response.message) {
          toast.success(response.message || t("deleteSuccess"));
          onUserDeviceDeleted();
        }
      } catch (error: any) {
        console.error(`Error deleting user device ${userDevice.id}:`, error);
        toast.error(error?.message || t("deleteError"));
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleTrackCreated = () => {
    loadTracks();
  };

  const handleTrackUpdated = () => {
    loadTracks();
  };

  const handleTrackDeleted = () => {
    loadTracks();
  };

  // Initial data for the form
  const initialData = {
    id: userDevice.id || "",
    userId: userDevice.userId || "",
    timeFrom: userDevice.timeFrom || "",
    timeTo: userDevice.timeTo || "",
    status: userDevice.status || "ASSIGNED",
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg mt-4 transition-colors duration-300 shadow">
      {isEditing && isHackathonCreator ? (
        <div className="mb-4">
          <h4 className="text-md font-medium mb-4 dark:text-gray-200">
            {t("editAssignment")}
          </h4>
          <UserDeviceForm
            hackathonId={hackathonId}
            deviceId={userDevice.deviceId}
            initialData={initialData}
            onSubmit={handleUpdateUserDevice}
            onCancel={handleCancelEdit}
            submitButtonText={
              isUpdating ? t("updating") : t("updateAssignment")
            }
            isSubmitting={isUpdating}
          />
          {error && (
            <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm rounded">
              {error}
            </div>
          )}
        </div>
      ) : (
        <>
          {deviceOwner && (
            <div className="mb-4">
              <h5 className="font-medium text-gray-800 dark:text-gray-200">
                {t("userInformation")}
              </h5>
              <div className="mt-2 space-y-1">
                <p className="text-sm dark:text-gray-300">
                  {t("name")}: {deviceOwner.firstName} {deviceOwner.lastName}
                </p>
                <p className="text-sm dark:text-gray-300">
                  {t("email")}: {deviceOwner.email}
                </p>
                {deviceOwner.userRoles && deviceOwner.userRoles.length > 0 && (
                  <p className="text-sm dark:text-gray-300">
                    {t("role")}:{" "}
                    {deviceOwner.userRoles[0]?.role.name || t("unknown")}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mb-4">
            <h5 className="font-medium text-gray-800 dark:text-gray-200">
              {t("assignmentDetails")}
            </h5>
            <div className="mt-2 space-y-1">
              <p className="text-sm dark:text-gray-300">
                {t("status")}:{" "}
                <span
                  className={`${getStatusColorClass(userDevice.status)} px-2 py-0.5 rounded-full text-xs font-medium`}
                >
                  {userDevice.status}
                </span>
              </p>
              <p className="text-sm dark:text-gray-300">
                {t("from")}: {formatDateTime(userDevice.timeFrom)}
              </p>
              <p className="text-sm dark:text-gray-300">
                {t("to")}: {formatDateTime(userDevice.timeTo)}
              </p>
              <p className="text-sm dark:text-gray-300">
                {t("createdBy")}: {userDevice.createdByUserName || t("unknown")}
              </p>
            </div>
          </div>

          {/* Assignment Files */}
          <div className="mb-4">
            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
              {t("assignmentFiles")}
            </h5>
            {loadingFiles ? (
              <div className="flex items-center">
                <LoadingSpinner size="sm" />
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {t("loadingFiles")}
                </span>
              </div>
            ) : userDeviceFiles.length > 0 ? (
              <FilesList files={userDeviceFiles} />
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("noFiles")}
              </p>
            )}
          </div>

          {/* User device tracks */}
          <div className="mt-4 mb-4">
            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
              {t("trackingHistory")}
            </h5>
            <TrackingHistory
              userDeviceId={userDevice.id}
              initialTracks={tracks}
              initialIsLoading={loadingTracks}
              hackathonId={hackathonId}
              onTrackCreated={handleTrackCreated}
              onTrackUpdated={handleTrackUpdated}
              onTrackDeleted={handleTrackDeleted}
              isHackathonCreator={isHackathonCreator}
              deviceAssignedUserId={userDevice.userId} // Pass the assigned user ID
            />
          </div>

          {/* Action buttons - only show for hackathon creator */}
          {isHackathonCreator && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-1.5 px-3 rounded text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                onClick={handleEditClick}
                disabled={isDeleting}
              >
                {t("editAssignmentBtn")}
              </button>
              <button
                className="bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 text-red-800 dark:text-red-300 py-1.5 px-3 rounded text-sm transition-colors duration-200 flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                onClick={handleDeleteUserDevice}
                disabled={isDeleting}
              >
                {isDeleting && <LoadingSpinner size="sm" />}
                <span>
                  {isDeleting ? t("deleting") : t("deleteAssignmentBtn")}
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserDeviceDetails;
