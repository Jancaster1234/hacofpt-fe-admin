// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/TrackingHistory.tsx
import React, { useState } from "react";
import { UserDeviceTrack } from "@/types/entities/userDeviceTrack";
import {
  formatDate,
  getQualityStatusColorClass,
} from "../../_utils/formatters";
import { fetchMockFileUrls } from "../../_mocks/fetchMockFileUrls";
import { FileUrl } from "@/types/entities/fileUrl";
import FilesList from "./FilesList";

interface TrackingHistoryProps {
  tracks: UserDeviceTrack[];
  isLoading: boolean;
  hackathonId: string;
}

const TrackingHistory: React.FC<TrackingHistoryProps> = ({
  tracks,
  isLoading,
  hackathonId,
}) => {
  const [expandedTrackIds, setExpandedTrackIds] = useState<string[]>([]);
  const [trackFiles, setTrackFiles] = useState<{
    [trackId: string]: FileUrl[];
  }>({});
  const [loadingTrackFiles, setLoadingTrackFiles] = useState<{
    [trackId: string]: boolean;
  }>({});

  const toggleTrackExpansion = async (trackId: string) => {
    if (expandedTrackIds.includes(trackId)) {
      // Collapse if already expanded
      setExpandedTrackIds(expandedTrackIds.filter((id) => id !== trackId));
    } else {
      // Expand and fetch track files if not already fetched
      setExpandedTrackIds([...expandedTrackIds, trackId]);

      if (!trackFiles[trackId] && !loadingTrackFiles[trackId]) {
        setLoadingTrackFiles((prev) => ({ ...prev, [trackId]: true }));
        try {
          const files = await fetchMockFileUrls({ userDeviceTrackId: trackId });
          setTrackFiles((prev) => ({ ...prev, [trackId]: files }));
        } catch (error) {
          console.error(`Error fetching files for track ${trackId}:`, error);
        } finally {
          setLoadingTrackFiles((prev) => ({ ...prev, [trackId]: false }));
        }
      }
    }
  };

  if (isLoading) {
    return <p className="text-gray-500 text-sm">Loading tracking history...</p>;
  }

  if (tracks.length === 0) {
    return (
      <p className="text-gray-500 italic text-sm">
        No tracking history available
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {tracks.map((track) => (
        <li key={track.id} className="py-3">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleTrackExpansion(track.id)}
          >
            <div>
              <p
                className={`text-sm font-medium ${getQualityStatusColorClass(
                  track.deviceQualityStatus
                )}`}
              >
                {track.deviceQualityStatus}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(track.createdAt)} • {track.note}
              </p>
            </div>
            <span>{expandedTrackIds.includes(track.id) ? "▼" : "►"}</span>
          </div>

          {/* Expanded track files */}
          {expandedTrackIds.includes(track.id) && (
            <div className="ml-4 mt-2">
              {loadingTrackFiles[track.id] ? (
                <p className="text-gray-500 text-sm">Loading files...</p>
              ) : trackFiles[track.id]?.length > 0 ? (
                <>
                  <h6 className="text-xs font-medium text-gray-500">
                    Attached Files:
                  </h6>
                  <FilesList files={trackFiles[track.id]} compact={true} />
                </>
              ) : (
                <p className="text-gray-500 italic text-sm">
                  No files attached to this record
                </p>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TrackingHistory;
