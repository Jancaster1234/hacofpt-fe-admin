// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockDevices.ts
import { Device, DeviceStatus } from "@/types/entities/device";

export const fetchMockDevices = ({
  hackathonId,
  roundId,
  roundLocationId,
}: {
  hackathonId?: string;
  roundId?: string;
  roundLocationId?: string;
}): Promise<Device[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockDevices: Device[] = [
        {
          id: "dev1",
          hackathonId: hackathonId,
          roundId: roundId,
          roundLocationId: roundLocationId,
          name: "Laptop A",
          description: "High-performance laptop for participants",
          status: "AVAILABLE",
          quantity: 10,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "user_name",
        },
        {
          id: "dev2",
          hackathonId: hackathonId,
          roundId: roundId,
          roundLocationId: roundLocationId,
          name: "Raspberry Pi",
          description: "Single-board computer for hardware hacks",
          status: "IN_USE",
          quantity: 5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "user_name",
        },
        {
          id: "dev3",
          hackathonId: hackathonId,
          roundId: roundId,
          roundLocationId: roundLocationId,
          name: "Arduino Kit",
          description: "Microcontroller kit for IoT projects",
          status: "DAMAGED",
          quantity: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdByUserName: "user_name",
        },
      ];
      resolve(mockDevices);
    }, 500);
  });
};
