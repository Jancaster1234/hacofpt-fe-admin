// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/UserDevicesTabs.tsx
import React, { useState } from "react";
import { UserDevice } from "@/types/entities/userDevice";
import { User } from "@/types/entities/user";
import UserDeviceDetails from "./UserDeviceDetails";
import UserDeviceForm from "./UserDeviceForm";
import { userDeviceService } from "@/services/userDevice.service";

interface UserDevicesTabsProps {
  userDevices: UserDevice[];
  isLoading: boolean;
  activeUserDeviceId: string | null;
  userInfo: { [userId: string]: User };
  onUserDeviceSelect: (userDeviceId: string) => void;
  hackathonId: string;
  deviceId: string;
  onUserDevicesUpdated: () => void;
}

const UserDevicesTabs: React.FC<UserDevicesTabsProps> = ({
  userDevices,
  isLoading,
  activeUserDeviceId,
  userInfo,
  onUserDeviceSelect,
  hackathonId,
  deviceId,
  onUserDevicesUpdated,
}) => {
  const [isAddingUserDevice, setIsAddingUserDevice] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="mt-6 ml-14 text-gray-500">
        Loading user assignments...
      </div>
    );
  }

  const activeUserDevice = userDevices.find(
    (ud) => ud.id === activeUserDeviceId
  );

  const handleAddUserDeviceClick = () => {
    setIsAddingUserDevice(true);
  };

  const handleCancelAddUserDevice = () => {
    setIsAddingUserDevice(false);
    setError(null);
  };

  const handleCreateUserDevice = async (formData: any) => {
    try {
      const response = await userDeviceService.createUserDevice({
        userId: formData.userId,
        deviceId: formData.deviceId,
        timeFrom: formData.timeFrom, // Now properly formatted as ISO string
        timeTo: formData.timeTo, // Now properly formatted as ISO string
        status: formData.status,
      });

      if (response.data) {
        setIsAddingUserDevice(false);
        onUserDevicesUpdated();
      }
    } catch (error) {
      console.error("Error creating user device:", error);
      setError("Failed to create assignment. Please try again.");
      throw error;
    }
  };

  const handleUserDeviceUpdated = () => {
    onUserDevicesUpdated();
  };

  const handleUserDeviceDeleted = () => {
    onUserDevicesUpdated();
  };

  return (
    <div className="mt-6 ml-14">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Device Assignments</h3>
        {!isAddingUserDevice && (
          <button
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-3 rounded text-sm"
            onClick={handleAddUserDeviceClick}
          >
            Add Assignment
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded">
          {error}
        </div>
      )}

      {isAddingUserDevice ? (
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <h4 className="text-md font-medium mb-4">
            Add New Device Assignment
          </h4>
          <UserDeviceForm
            hackathonId={hackathonId}
            deviceId={deviceId}
            onSubmit={handleCreateUserDevice}
            onCancel={handleCancelAddUserDevice}
            submitButtonText="Create Assignment"
          />
        </div>
      ) : null}

      {userDevices.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No user assignments for this device
        </div>
      ) : (
        <>
          {/* User device tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4">
              {userDevices.map((userDevice) => {
                const user = userDevice.userId
                  ? userInfo[userDevice.userId]
                  : null;
                const userName = user
                  ? `${user.firstName} ${user.lastName}`
                  : "Unknown User";

                return (
                  <button
                    key={userDevice.id}
                    onClick={() => onUserDeviceSelect(userDevice.id)}
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
            </nav>
          </div>

          {/* Active user device details */}
          {activeUserDevice && (
            <UserDeviceDetails
              userDevice={activeUserDevice}
              userInfo={userInfo}
              hackathonId={hackathonId}
              onUserDeviceUpdated={handleUserDeviceUpdated}
              onUserDeviceDeleted={handleUserDeviceDeleted}
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserDevicesTabs;
