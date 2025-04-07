// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/UserDevicesTabs.tsx
import React from "react";
import { UserDevice } from "@/types/entities/userDevice";
import { User } from "@/types/entities/user";
import UserDeviceDetails from "./UserDeviceDetails";

interface UserDevicesTabsProps {
  userDevices: UserDevice[];
  isLoading: boolean;
  activeUserDeviceId: string | null;
  userInfo: { [userId: string]: User };
  onUserDeviceSelect: (userDeviceId: string) => void;
  hackathonId: string;
}

const UserDevicesTabs: React.FC<UserDevicesTabsProps> = ({
  userDevices,
  isLoading,
  activeUserDeviceId,
  userInfo,
  onUserDeviceSelect,
  hackathonId,
}) => {
  if (isLoading) {
    return <p className="text-gray-500 ml-8">Loading user assignments...</p>;
  }

  if (userDevices.length === 0) {
    return (
      <p className="text-gray-500 ml-8 italic">
        No user assignments for this device
      </p>
    );
  }

  const activeUserDevice = userDevices.find(
    (ud) => ud.id === activeUserDeviceId
  );

  return (
    <div className="ml-8 mt-4">
      <h4 className="font-medium text-sm mb-2">Device Assignments:</h4>

      {/* User device tabs */}
      <div className="flex space-x-2 border-b border-gray-200 mb-4">
        {userDevices.map((userDevice) => {
          const user = userDevice.userId ? userInfo[userDevice.userId] : null;
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
      </div>

      {/* Active user device details */}
      {activeUserDevice && (
        <UserDeviceDetails
          userDevice={activeUserDevice}
          user={
            activeUserDevice.userId ? userInfo[activeUserDevice.userId] : null
          }
          hackathonId={hackathonId}
        />
      )}
    </div>
  );
};

export default UserDevicesTabs;
