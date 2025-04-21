// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/TrackingHistory.tsx
import React, { useState, useEffect } from "react";
import { UserDeviceTrack } from "@/types/entities/userDeviceTrack";
import {
  formatDate,
  getQualityStatusColorClass,
} from "../../_utils/formatters";
import { FileUrl } from "@/types/entities/fileUrl";
import FilesList from "./FilesList";
import { fileUrlService } from "@/services/fileUrl.service";
import { userDeviceTrackService } from "@/services/userDeviceTrack.service";
import UserDeviceTrackForm from "./UserDeviceTrackForm";

interface TrackingHistoryProps {
  userDeviceId: string;
  initialTracks?: UserDeviceTrack[];
  initialIsLoading?: boolean;
  hackathonId: string;
  onTrackCreated?: () => void;
  onTrackUpdated?: () => void;
  onTrackDeleted?: () => void;
}

const TrackingHistory: React.FC<TrackingHistoryProps> = ({
  userDeviceId,
  initialTracks = [],
  initialIsLoading = false,
  hackathonId,
  onTrackCreated,
  onTrackUpdated,
  onTrackDeleted,
}) => {
  const [tracks, setTracks] = useState<UserDeviceTrack[]>(initialTracks);
  const [isLoading, setIsLoading] = useState<boolean>(initialIsLoading);
  const [expandedTrackIds, setExpandedTrackIds] = useState<string[]>([]);
  const [trackFiles, setTrackFiles] = useState<{
    [trackId: string]: FileUrl[];
  }>({});
  const [loadingTrackFiles, setLoadingTrackFiles] = useState<{
    [trackId: string]: boolean;
  }>({});
  const [isAddingTrack, setIsAddingTrack] = useState<boolean>(false);
  const [isEditingTrack, setIsEditingTrack] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTracks.length === 0) {
      fetchTracks();
    } else {
      setTracks(initialTracks);
    }
  }, [userDeviceId, initialTracks]);

  const fetchTracks = async () => {
    setIsLoading(true);
    try {
      const response =
        await userDeviceTrackService.getUserDeviceTracksByUserDeviceId(
          userDeviceId
        );
      if (response.data) {
        setTracks(response.data);
      }
    } catch (error) {
      console.error(
        `Error fetching user device tracks for ${userDeviceId}:`,
        error
      );
      setError("Failed to load tracking history");
    } finally {
      setIsLoading(false);
    }
  };

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
          const response = await fileUrlService.getFileUrlsByUserDeviceTrackId(
            trackId
          );
          if (response.data) {
            setTrackFiles((prev) => ({ ...prev, [trackId]: response.data }));
          }
        } catch (error) {
          console.error(`Error fetching files for track ${trackId}:`, error);
        } finally {
          setLoadingTrackFiles((prev) => ({ ...prev, [trackId]: false }));
        }
      }
    }
  };

  const handleAddTrackClick = () => {
    setIsAddingTrack(true);
    setIsEditingTrack(null);
    setError(null);
  };

  const handleEditTrackClick = (trackId: string, track: UserDeviceTrack) => {
    setIsEditingTrack(trackId);
    setIsAddingTrack(false);
    setError(null);
  };

  const handleDeleteTrackClick = async (trackId: string) => {
    if (
      window.confirm("Are you sure you want to delete this tracking record?")
    ) {
      try {
        await userDeviceTrackService.deleteUserDeviceTrack(trackId);
        setTracks(tracks.filter((track) => track.id !== trackId));
        if (onTrackDeleted) onTrackDeleted();
      } catch (error) {
        console.error(`Error deleting track ${trackId}:`, error);
        setError("Failed to delete tracking record");
      }
    }
  };

  const handleCancelAddEdit = () => {
    setIsAddingTrack(false);
    setIsEditingTrack(null);
    setError(null);
  };

  const handleCreateTrack = async (formData: any) => {
    try {
      const response = await userDeviceTrackService.createUserDeviceTrack(
        formData
      );
      if (response.data) {
        setTracks([response.data, ...tracks]);
        setIsAddingTrack(false);
        if (onTrackCreated) onTrackCreated();
      }
    } catch (error) {
      console.error("Error creating track:", error);
      setError("Failed to create tracking record");
      throw error;
    }
  };

  const handleUpdateTrack = async (trackId: string, formData: any) => {
    try {
      const response = await userDeviceTrackService.updateUserDeviceTrack(
        trackId,
        formData
      );
      if (response.data) {
        setTracks(
          tracks.map((track) => (track.id === trackId ? response.data : track))
        );
        setIsEditingTrack(null);
        if (onTrackUpdated) onTrackUpdated();
      }
    } catch (error) {
      console.error(`Error updating track ${trackId}:`, error);
      setError("Failed to update tracking record");
      throw error;
    }
  };

  if (isLoading) {
    return <p className="text-gray-500 text-sm">Loading tracking history...</p>;
  }

  return (
    <div>
      {/* Actions */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Tracking History</h3>
        {!isAddingTrack && !isEditingTrack && (
          <button
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-2 rounded"
            onClick={handleAddTrackClick}
          >
            Add Record
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-600 text-xs rounded">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {isAddingTrack && (
        <div className="mb-4 p-3 border rounded-md bg-gray-50">
          <h4 className="text-sm font-medium mb-3">Add New Tracking Record</h4>
          <UserDeviceTrackForm
            userDeviceId={userDeviceId}
            onSubmit={handleCreateTrack}
            onCancel={handleCancelAddEdit}
            submitButtonText="Create Record"
          />
        </div>
      )}

      {isEditingTrack && (
        <div className="mb-4 p-3 border rounded-md bg-gray-50">
          <h4 className="text-sm font-medium mb-3">Edit Tracking Record</h4>
          <UserDeviceTrackForm
            userDeviceId={userDeviceId}
            initialData={{
              deviceQualityStatus: tracks.find((t) => t.id === isEditingTrack)
                ?.deviceQualityStatus as any,
              note: tracks.find((t) => t.id === isEditingTrack)?.note,
            }}
            onSubmit={(formData) => handleUpdateTrack(isEditingTrack, formData)}
            onCancel={handleCancelAddEdit}
            submitButtonText="Update Record"
          />
        </div>
      )}

      {/* Tracks List */}
      {tracks.length === 0 ? (
        <p className="text-gray-500 italic text-sm">
          No tracking history available
        </p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {tracks.map((track) => (
            <li key={track.id} className="py-3">
              <div className="flex justify-between">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => toggleTrackExpansion(track.id)}
                >
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
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTrackClick(track.id, track);
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTrackClick(track.id);
                    }}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                  <span
                    className="cursor-pointer text-gray-500"
                    onClick={() => toggleTrackExpansion(track.id)}
                  >
                    {expandedTrackIds.includes(track.id) ? "▼" : "►"}
                  </span>
                </div>
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
      )}
    </div>
  );
};

export default TrackingHistory;
