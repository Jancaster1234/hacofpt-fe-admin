// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_mocks/fetchMockFileUrls.ts

import { FileUrl } from "@/types/entities/fileUrl";

export const fetchMockFileUrls = ({
  sponsorshipHackathonDetailId,
  deviceId,
  userDeviceId,
  userDeviceTrackId,
}: {
  sponsorshipHackathonDetailId?: string;
  deviceId?: string;
  userDeviceId?: string;
  userDeviceTrackId?: string;
}): Promise<FileUrl[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date().toISOString();

      const mockFileUrls: FileUrl[] = [
        {
          id: "file1",
          fileName: "sponsor_logo.png",
          fileUrl:
            "https://t3.ftcdn.net/jpg/00/92/53/56/360_F_92535664_IvFsQeHjBzfE6sD4VHdO8u5OHUSc6yHF.jpg",
          fileType: "image/png",
          fileSize: 204800,
          sponsorshipHackathonDetailId: sponsorshipHackathonDetailId,
          deviceId: deviceId,
          userDeviceId: userDeviceId,
          userDeviceTrackId: userDeviceTrackId,
          createdAt: now,
          updatedAt: now,
          createdByUserName: "sponsor_admin",
        },
        {
          id: "file2",
          fileName: "device_manual.pdf",
          fileUrl:
            "https://t3.ftcdn.net/jpg/00/92/53/56/360_F_92535664_IvFsQeHjBzfE6sD4VHdO8u5OHUSc6yHF.jpg",
          fileType: "application/pdf",
          fileSize: 1048576,
          sponsorshipHackathonDetailId: sponsorshipHackathonDetailId,
          deviceId: deviceId,
          userDeviceId: userDeviceId,
          userDeviceTrackId: userDeviceTrackId,
          createdAt: now,
          updatedAt: now,
          createdByUserName: "tech_admin",
        },
        {
          id: "file3",
          fileName: "user_device_photo.jpg",
          fileUrl:
            "https://t3.ftcdn.net/jpg/00/92/53/56/360_F_92535664_IvFsQeHjBzfE6sD4VHdO8u5OHUSc6yHF.jpg",
          fileType: "image/jpeg",
          fileSize: 512000,
          sponsorshipHackathonDetailId: sponsorshipHackathonDetailId,
          deviceId: deviceId,
          userDeviceId: userDeviceId,
          userDeviceTrackId: userDeviceTrackId,
          createdAt: now,
          updatedAt: now,
          createdByUserName: "event_coordinator",
        },
        {
          id: "file4",
          fileName: "repair_report.docx",
          fileUrl:
            "https://t3.ftcdn.net/jpg/00/92/53/56/360_F_92535664_IvFsQeHjBzfE6sD4VHdO8u5OHUSc6yHF.jpg",
          fileType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          fileSize: 256000,
          sponsorshipHackathonDetailId: sponsorshipHackathonDetailId,
          deviceId: deviceId,
          userDeviceId: userDeviceId,
          userDeviceTrackId: userDeviceTrackId,
          createdAt: now,
          updatedAt: now,
          createdByUserName: "maintenance_team",
        },
      ];

      resolve(mockFileUrls);
    }, 500);
  });
};
