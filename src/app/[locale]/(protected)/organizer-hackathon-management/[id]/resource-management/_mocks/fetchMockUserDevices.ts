// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockUserDevices.ts
import { UserDevice, UserDeviceStatus } from "@/types/entities/userDevice";

export const fetchMockUserDevices = ({
  userId,
  deviceId,
}: {
  userId?: string;
  deviceId?: string;
}): Promise<UserDevice[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUserDevices: UserDevice[] = [
        {
          id: "ud1",
          userId: userId,
          deviceId: deviceId,
          timeFrom: new Date().toISOString(),
          timeTo: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
          status: "ASSIGNED",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "user_name",
        },
        {
          id: "ud2",
          userId: userId,
          deviceId: deviceId,
          timeFrom: new Date().toISOString(),
          timeTo: new Date(Date.now() + 7200000).toISOString(), // 2 hours later
          status: "RETURNED",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "user_name",
        },
        {
          id: "ud3",
          userId: userId,
          deviceId: deviceId,
          timeFrom: new Date().toISOString(),
          timeTo: new Date(Date.now() + 10800000).toISOString(), // 3 hours later
          status: "LOST",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "user_name",
        },
      ];

      resolve(mockUserDevices);
    }, 500);
  });
};
