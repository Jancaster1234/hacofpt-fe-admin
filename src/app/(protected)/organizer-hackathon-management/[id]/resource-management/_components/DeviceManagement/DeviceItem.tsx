// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/DeviceItem.tsx
import React, { useState, useEffect } from "react";
import { Device } from "@/types/entities/device";
import { fetchMockFileUrls } from "../../_mocks/fetchMockFileUrls";
import { fetchMockUserDevices } from "../../_mocks/fetchMockUserDevices";
import { FileUrl } from "@/types/entities/fileUrl";
import { UserDevice } from "@/types/entities/userDevice";
import DeviceFiles from "./DeviceFiles";
import UserDevicesTabs from "./UserDevicesTabs";
import { fetchMockUserById } from "../../_mocks/fetchMockUserById";
import { User } from "@/types/entities/user";

interface DeviceItemProps {
  device: Device;
  isExpanded: boolean;
  onToggleExpand: () => void;
  hackathonId: string;
}

const DeviceItem: React.FC<DeviceItemProps> = ({
  device,
  isExpanded,
  onToggleExpand,
  hackathonId,
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
        const files = await fetchMockFileUrls({ deviceId: device.id });
        setDeviceFiles(files);
      } catch (error) {
        console.error(`Error fetching files for device ${device.id}:`, error);
      } finally {
        setLoadingDeviceFiles(false);
      }
    }
  };

  const loadUserDevices = async () => {
    if (!userDevices.length && !loadingUserDevices) {
      setLoadingUserDevices(true);
      try {
        const fetchedUserDevices = await fetchMockUserDevices({
          deviceId: device.id,
        });
        setUserDevices(fetchedUserDevices);

        // If we got user devices, set the first one as active
        if (fetchedUserDevices.length > 0) {
          setActiveUserDeviceId(fetchedUserDevices[0].id);

          // Fetch user info for each user device
          for (const userDevice of fetchedUserDevices) {
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
          `Error fetching user devices for device ${device.id}:`,
          error
        );
      } finally {
        setLoadingUserDevices(false);
      }
    }
  };

  const handleUserDeviceSelect = (userDeviceId: string) => {
    setActiveUserDeviceId(userDeviceId);
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
    <li className="py-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggleExpand}
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
          <div className="mt-4 ml-14 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Created by</p>
              <p>{device.createdByUserName}</p>
            </div>
            <div>
              <p className="text-gray-500">Last updated</p>
              <p>{new Date(device.updatedAt).toLocaleDateString()}</p>
            </div>
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
          />

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
  );
};

export default DeviceItem;
