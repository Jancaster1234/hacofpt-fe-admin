// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/UserDeviceDetails.tsx
import React, { useState, useEffect } from "react";
import { UserDevice } from "@/types/entities/userDevice";
import { User } from "@/types/entities/user";
import { formatDateTime, getStatusColorClass } from "../../_utils/formatters";
import TrackingHistory from "./TrackingHistory";
import { fetchMockUserDeviceTracks } from "../../_mocks/fetchMockUserDeviceTracks";
import { UserDeviceTrack } from "@/types/entities/userDeviceTrack";
import UserDeviceForm from "./UserDeviceForm";
import { userDeviceService } from "@/services/userDevice.service";
import { FileUrl } from "@/types/entities/fileUrl";
import { fileUrlService } from "@/services/fileUrl.service";

interface UserDeviceDetailsProps {
  userDevice: UserDevice;
  userInfo: { [userId: string]: User };
  hackathonId: string;
  onUserDeviceUpdated: () => void;
  onUserDeviceDeleted: () => void;
}

const UserDeviceDetails: React.FC<UserDeviceDetailsProps> = ({
  userDevice,
  userInfo,
  hackathonId,
  onUserDeviceUpdated,
  onUserDeviceDeleted,
}) => {
  const [tracks, setTracks] = useState<UserDeviceTrack[]>([]);
  const [loadingTracks, setLoadingTracks] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userDeviceFiles, setUserDeviceFiles] = useState<FileUrl[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false);

  // Get the user from userInfo
  const user = userDevice.userId ? userInfo[userDevice.userId] : null;

  useEffect(() => {
    const loadTracks = async () => {
      setLoadingTracks(true);
      try {
        const fetchedTracks = await fetchMockUserDeviceTracks({
          userDeviceId: userDevice.id,
        });
        setTracks(fetchedTracks);
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

    loadTracks();
    loadFiles();
  }, [userDevice.id]);

  const handleEditClick = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleUpdateUserDevice = async (formData: any) => {
    try {
      const updateData = {
        userId: formData.userId,
        deviceId: userDevice.deviceId,
        timeFrom: formData.timeFrom, // Now properly formatted as ISO string
        timeTo: formData.timeTo, // Now properly formatted as ISO string
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
      }
    } catch (error) {
      console.error(`Error updating user device ${userDevice.id}:`, error);
      setError("Failed to update assignment. Please try again.");
      throw error;
    }
  };

  const handleDeleteUserDevice = async () => {
    if (
      window.confirm(`Are you sure you want to delete this device assignment?`)
    ) {
      try {
        const response = await userDeviceService.deleteUserDevice(
          userDevice.id
        );
        if (response.message) {
          onUserDeviceDeleted();
        }
      } catch (error) {
        console.error(`Error deleting user device ${userDevice.id}:`, error);
        alert("Failed to delete device assignment. Please try again.");
      }
    }
  };

  // Initial data for the form
  const initialData = {
    userId: userDevice.userId || "",
    timeFrom: userDevice.timeFrom || "",
    timeTo: userDevice.timeTo || "",
    status: userDevice.status || "ASSIGNED",
  };

  // Render file list
  const renderFiles = () => {
    if (loadingFiles) {
      return <p className="text-sm text-gray-500">Loading files...</p>;
    }

    if (userDeviceFiles.length === 0) {
      return <p className="text-sm text-gray-500">No files attached</p>;
    }

    return (
      <ul className="text-sm">
        {userDeviceFiles.map((file) => (
          <li key={file.id} className="mb-1">
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {file.fileName}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mt-4">
      {isEditing ? (
        <div className="mb-4">
          <h4 className="text-md font-medium mb-4">Edit Device Assignment</h4>
          <UserDeviceForm
            hackathonId={hackathonId}
            deviceId={userDevice.deviceId}
            initialData={initialData}
            onSubmit={handleUpdateUserDevice}
            onCancel={handleCancelEdit}
            submitButtonText="Update Assignment"
          />
          {error && (
            <div className="mt-2 p-3 bg-red-50 text-red-600 text-sm rounded">
              {error}
            </div>
          )}
        </div>
      ) : (
        <>
          {user && (
            <div className="mb-4">
              <h5 className="font-medium">User Information</h5>
              <p className="text-sm">
                Name: {user.firstName} {user.lastName}
              </p>
              <p className="text-sm">Email: {user.email}</p>
              {user.userRoles && user.userRoles.length > 0 && (
                <p className="text-sm">
                  Role: {user.userRoles[0]?.role.name || "Unknown"}
                </p>
              )}
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
            <p className="text-sm">
              From: {formatDateTime(userDevice.timeFrom)}
            </p>
            <p className="text-sm">To: {formatDateTime(userDevice.timeTo)}</p>
            <p className="text-sm">
              Created by: {userDevice.createdByUserName}
            </p>
          </div>

          {/* Assignment Files */}
          <div className="mb-4">
            <h5 className="font-medium">Assignment Files</h5>
            {renderFiles()}
          </div>

          {/* User device tracks */}
          <div className="mt-4 mb-4">
            <h5 className="font-medium mb-2">Device Tracking History</h5>
            <TrackingHistory
              tracks={tracks}
              isLoading={loadingTracks}
              hackathonId={hackathonId}
            />
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex gap-2">
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded text-sm"
              onClick={handleEditClick}
            >
              Edit Assignment
            </button>
            <button
              className="bg-red-100 hover:bg-red-200 text-red-800 py-1 px-3 rounded text-sm"
              onClick={handleDeleteUserDevice}
            >
              Delete Assignment
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDeviceDetails;
