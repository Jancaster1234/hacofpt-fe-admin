// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockUserDeviceTracks.ts
import {
  UserDeviceTrack,
  DeviceQualityStatus,
} from "@/types/entities/userDeviceTrack";

export const fetchMockUserDeviceTracks = ({
  userDeviceId,
}: {
  userDeviceId?: string;
}): Promise<UserDeviceTrack[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUserDeviceTracks: UserDeviceTrack[] = [
        {
          id: "udt1",
          userDeviceId: userDeviceId,
          deviceQualityStatus: "EXCELLENT",
          note: "Device in perfect condition.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "udt2",
          userDeviceId: userDeviceId,
          deviceQualityStatus: "FAIR",
          note: "Slight scratches on the screen.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "udt3",
          userDeviceId: userDeviceId,
          deviceQualityStatus: "NEEDS_REPAIR",
          note: "Battery is not holding charge.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      resolve(mockUserDeviceTracks);
    }, 500);
  });
};
