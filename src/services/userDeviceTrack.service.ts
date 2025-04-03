// src/services/userDeviceTrack.service.ts
import { UserDeviceTrack } from "@/types/entities/userDeviceTrack";
import { tokenService_v0 } from "@/services/token.service_v0";

type UserDeviceTrackPayload = {
  userDeviceId: string;
  deviceQualityStatus:
    | "EXCELLENT"
    | "GOOD"
    | "FAIR"
    | "DAMAGED"
    | "NEEDS_REPAIR"
    | "REPAIRING"
    | "REPAIRED"
    | "LOST";
  note?: string;
  files: File[];
};

class UserDeviceTrackService {
  async createUserDeviceTrack(
    payload: UserDeviceTrackPayload
  ): Promise<UserDeviceTrack> {
    try {
      const formData = new FormData();

      formData.append("userDeviceId", payload.userDeviceId);
      formData.append("deviceQualityStatus", payload.deviceQualityStatus);
      if (payload.note) formData.append("note", payload.note);

      payload.files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(
        "/identity-service/api/v1/user-device-tracks",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to create UserDeviceTrack: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating UserDeviceTrack:", error);
      throw error;
    }
  }

  async updateUserDeviceTrack(
    id: string,
    payload: UserDeviceTrackPayload
  ): Promise<UserDeviceTrack> {
    try {
      const formData = new FormData();

      formData.append("userDeviceId", payload.userDeviceId);
      formData.append("deviceQualityStatus", payload.deviceQualityStatus);
      if (payload.note) formData.append("note", payload.note);

      payload.files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(
        `/identity-service/api/v1/user-device-tracks/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${tokenService_v0.getAccessToken()}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update UserDeviceTrack: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating UserDeviceTrack:", error);
      throw error;
    }
  }
}

export const userDeviceTrackService = new UserDeviceTrackService();
