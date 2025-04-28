// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/UserDevicesTabs.tsx
import React, { useState } from "react";
import { UserDevice } from "@/types/entities/userDevice";
import { User } from "@/types/entities/user";
import UserDeviceDetails from "./UserDeviceDetails";
import UserDeviceForm from "./UserDeviceForm";
import { userDeviceService } from "@/services/userDevice.service";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface UserDevicesTabsProps {
  userDevices: UserDevice[];
  isLoading: boolean;
  activeUserDeviceId: string | null;
  userInfo: { [userId: string]: User };
  onUserDeviceSelect: (userDeviceId: string) => void;
  hackathonId: string;
  deviceId: string;
  onUserDevicesUpdated: () => void;
  isHackathonCreator: boolean;
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
  isHackathonCreator,
}) => {
  const [isAddingUserDevice, setIsAddingUserDevice] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("deviceManagement");
  const toast = useToast();

  if (isLoading) {
    return (
      <div className="mt-4 sm:mt-6 ml-4 sm:ml-14 text-gray-500 dark:text-gray-400 flex items-center transition-colors duration-200">
        <LoadingSpinner size="sm" className="mr-2" />
        <span>{t("loadingUserAssignments")}</span>
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
    setError(null);

    try {
      const response = await userDeviceService.createUserDevice({
        userId: formData.userId,
        deviceId: formData.deviceId,
        timeFrom: formData.timeFrom,
        timeTo: formData.timeTo,
        status: formData.status,
        files: formData.files || [],
      });

      if (response.data) {
        setIsAddingUserDevice(false);
        onUserDevicesUpdated();
        toast.success(response.message || t("assignmentCreatedSuccess"));
      }
    } catch (error: any) {
      console.error("Error creating user device:", error);
      const errorMessage = error.message || t("failedToCreateAssignment");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
    }
  };

  const handleUserDeviceUpdated = () => {
    onUserDevicesUpdated();
  };

  const handleUserDeviceDeleted = () => {
    onUserDevicesUpdated();
  };

  return (
    <div className="mt-4 sm:mt-6 ml-4 sm:ml-14 transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 sm:mb-0 transition-colors duration-200">
          {t("deviceAssignments")}
        </h3>
        {!isAddingUserDevice && isHackathonCreator && (
          <button
            className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 
                      text-blue-800 dark:text-blue-200 py-1 px-3 rounded text-sm transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            onClick={handleAddUserDeviceClick}
          >
            {t("addAssignment")}
          </button>
        )}
      </div>

      {error && (
        <div
          className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm rounded transition-colors duration-200"
          role="alert"
        >
          {error}
        </div>
      )}

      {isAddingUserDevice && isHackathonCreator ? (
        <div className="mb-6 p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800/50 transition-colors duration-200">
          <h4 className="text-md font-medium mb-3 sm:mb-4 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            {t("addNewDeviceAssignment")}
          </h4>
          <UserDeviceForm
            hackathonId={hackathonId}
            deviceId={deviceId}
            onSubmit={handleCreateUserDevice}
            onCancel={handleCancelAddUserDevice}
            submitButtonText={t("createAssignment")}
          />
        </div>
      ) : null}

      {userDevices.length === 0 ? (
        <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400 transition-colors duration-200">
          {t("noUserAssignments")}
        </div>
      ) : (
        <>
          {/* User device tabs - Properly implemented with ARIA roles */}
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto transition-colors duration-200">
            <div
              role="tablist"
              className="-mb-px flex space-x-2 sm:space-x-4 pb-1"
            >
              {userDevices.map((userDevice) => {
                const user = userDevice.userId
                  ? userInfo[userDevice.userId]
                  : null;
                const userName = user
                  ? `${user.firstName} ${user.lastName}`
                  : t("unknownUser");
                const isActive = activeUserDeviceId === userDevice.id;

                return (
                  <button
                    key={userDevice.id}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${userDevice.id}`}
                    id={`tab-${userDevice.id}`}
                    onClick={() => onUserDeviceSelect(userDevice.id)}
                    className={`py-1 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200
                      ${
                        isActive
                          ? "border-b-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-300"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                  >
                    {userName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active user device details - with proper ARIA labelling */}
          {activeUserDevice && (
            <div
              id={`panel-${activeUserDevice.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeUserDevice.id}`}
              className="mt-4 transition-all duration-200"
            >
              <UserDeviceDetails
                userDevice={activeUserDevice}
                userInfo={userInfo}
                hackathonId={hackathonId}
                onUserDeviceUpdated={handleUserDeviceUpdated}
                onUserDeviceDeleted={handleUserDeviceDeleted}
                isHackathonCreator={isHackathonCreator}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserDevicesTabs;
