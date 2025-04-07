// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/UserDeviceDetails.tsx
import React, { useState, useEffect } from "react";
import { UserDevice } from "@/types/entities/userDevice";
import { User } from "@/types/entities/user";
import { formatDateTime, getStatusColorClass } from "../../_utils/formatters";
import TrackingHistory from "./TrackingHistory";
import { fetchMockUserDeviceTracks } from "../../_mocks/fetchMockUserDeviceTracks";
import { UserDeviceTrack } from "@/types/entities/userDeviceTrack";

interface UserDeviceDetailsProps {
  userDevice: UserDevice;
  user: User | null;
  hackathonId: string;
}

const UserDeviceDetails: React.FC<UserDeviceDetailsProps> = ({
  userDevice,
  user,
  hackathonId,
}) => {
  const [tracks, setTracks] = useState<UserDeviceTrack[]>([]);
  const [loadingTracks, setLoadingTracks] = useState<boolean>(false);

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

    loadTracks();
  }, [userDevice.id]);

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
        <TrackingHistory
          tracks={tracks}
          isLoading={loadingTracks}
          hackathonId={hackathonId}
        />
      </div>
    </div>
  );
};

export default UserDeviceDetails;
