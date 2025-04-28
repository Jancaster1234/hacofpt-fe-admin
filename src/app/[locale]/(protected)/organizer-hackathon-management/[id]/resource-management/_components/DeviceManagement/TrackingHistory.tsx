// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/DeviceManagement/TrackingHistory.tsx
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
import { useAuth } from "@/hooks/useAuth_v0";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface TrackingHistoryProps {
  userDeviceId: string;
  initialTracks?: UserDeviceTrack[];
  initialIsLoading?: boolean;
  hackathonId: string;
  onTrackCreated?: () => void;
  onTrackUpdated?: () => void;
  onTrackDeleted?: () => void;
  isHackathonCreator?: boolean;
  deviceAssignedUserId?: string;
}

const TrackingHistory: React.FC<TrackingHistoryProps> = ({
  userDeviceId,
  initialTracks = [],
  initialIsLoading = false,
  hackathonId,
  onTrackCreated,
  onTrackUpdated,
  onTrackDeleted,
  isHackathonCreator,
  deviceAssignedUserId,
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
  const [isDeleting, setIsDeleting] = useState<{ [trackId: string]: boolean }>(
    {}
  );

  // Get current user information
  const { user } = useAuth();
  const t = useTranslations("trackingHistory");
  const toast = useToast();

  // Check if current user is the device owner
  const isDeviceOwner = user?.id === deviceAssignedUserId;

  // User can edit if they're the device owner or hackathon creator
  const canEditTracks = isDeviceOwner;

  useEffect(() => {
    // Set state from props first
    setTracks(initialTracks);
    setIsLoading(initialIsLoading);

    // Fetch data if needed
    if (initialTracks.length === 0 && !initialIsLoading) {
      fetchTracks();
    }
  }, [userDeviceId, initialTracks, initialIsLoading]);

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
      // No toast here as this is background data initialization
    } catch (error) {
      console.error(
        `Error fetching user device tracks for ${userDeviceId}:`,
        error
      );
      setError(t("errorLoadingHistory"));
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
          const response =
            await fileUrlService.getFileUrlsByUserDeviceTrackId(trackId);
          if (response.data) {
            setTrackFiles((prev) => ({ ...prev, [trackId]: response.data }));
          }
          // No toast here as this is background data fetch
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
    if (window.confirm(t("confirmDelete"))) {
      setIsDeleting((prev) => ({ ...prev, [trackId]: true }));
      try {
        const response =
          await userDeviceTrackService.deleteUserDeviceTrack(trackId);
        setTracks(tracks.filter((track) => track.id !== trackId));
        if (onTrackDeleted) onTrackDeleted();
        toast.success(response.message || t("recordDeleted"));
      } catch (error: any) {
        console.error(`Error deleting track ${trackId}:`, error);
        setError(t("errorDeleting"));
        toast.error(error.message || t("errorDeleting"));
      } finally {
        setIsDeleting((prev) => ({ ...prev, [trackId]: false }));
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
      const response =
        await userDeviceTrackService.createUserDeviceTrack(formData);
      if (response.data) {
        setTracks([response.data, ...tracks]);
        setIsAddingTrack(false);
        if (onTrackCreated) onTrackCreated();
        toast.success(response.message || t("recordCreated"));
      }
    } catch (error: any) {
      console.error("Error creating track:", error);
      setError(t("errorCreating"));
      toast.error(error.message || t("errorCreating"));
      throw error;
    } finally {
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
        toast.success(response.message || t("recordUpdated"));
      }
    } catch (error: any) {
      console.error(`Error updating track ${trackId}:`, error);
      setError(t("errorUpdating"));
      toast.error(error.message || t("errorUpdating"));
      throw error;
    } finally {
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="md" showText={true} />
      </div>
    );
  }

  return (
    <div className="transition-colors duration-200">
      {/* Actions */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm md:text-base font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
          {t("title")}
        </h3>
        {!isAddingTrack && !isEditingTrack && canEditTracks && (
          <button
            className="text-xs md:text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 text-blue-800 dark:text-blue-100 py-1 px-2 md:px-3 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleAddTrackClick}
          >
            {t("addRecord")}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded transition-colors duration-200">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {isAddingTrack && canEditTracks && (
        <div className="mb-4 p-3 border rounded-md bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <h4 className="text-sm font-medium mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            {t("addNewRecord")}
          </h4>
          <UserDeviceTrackForm
            userDeviceId={userDeviceId}
            onSubmit={handleCreateTrack}
            onCancel={handleCancelAddEdit}
            submitButtonText={t("createRecord")}
          />
        </div>
      )}

      {isEditingTrack && canEditTracks && (
        <div className="mb-4 p-3 border rounded-md bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <h4 className="text-sm font-medium mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            {t("editRecord")}
          </h4>
          <UserDeviceTrackForm
            userDeviceId={userDeviceId}
            initialData={{
              deviceQualityStatus: tracks.find((t) => t.id === isEditingTrack)
                ?.deviceQualityStatus as any,
              note: tracks.find((t) => t.id === isEditingTrack)?.note,
            }}
            onSubmit={(formData) => handleUpdateTrack(isEditingTrack, formData)}
            onCancel={handleCancelAddEdit}
            submitButtonText={t("updateRecord")}
          />
        </div>
      )}

      {/* Tracks List */}
      {tracks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 italic text-sm transition-colors duration-200">
          {t("noHistory")}
        </p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
          {tracks.map((track) => (
            <li
              key={track.id}
              className="py-3 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <div className="flex justify-between">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => toggleTrackExpansion(track.id)}
                >
                  <p
                    className={`text-sm font-medium ${getQualityStatusColorClass(
                      track.deviceQualityStatus
                    )} transition-colors duration-200`}
                  >
                    {track.deviceQualityStatus}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                    {formatDate(track.createdAt)} • {track.note}
                  </p>
                </div>
                {canEditTracks && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTrackClick(track.id, track);
                      }}
                      disabled={isDeleting[track.id]}
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 transition-colors duration-200"
                    >
                      {t("edit")}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTrackClick(track.id);
                      }}
                      disabled={isDeleting[track.id]}
                      className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50 transition-colors duration-200 flex items-center"
                    >
                      {isDeleting[track.id] ? (
                        <LoadingSpinner size="sm" className="mr-1" />
                      ) : null}
                      {t("delete")}
                    </button>
                    <span
                      className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTrackExpansion(track.id);
                      }}
                    >
                      {expandedTrackIds.includes(track.id) ? "▼" : "►"}
                    </span>
                  </div>
                )}
                {!canEditTracks && (
                  <span
                    className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                    onClick={() => toggleTrackExpansion(track.id)}
                  >
                    {expandedTrackIds.includes(track.id) ? "▼" : "►"}
                  </span>
                )}
              </div>

              {/* Expanded track files */}
              {expandedTrackIds.includes(track.id) && (
                <div className="ml-2 md:ml-4 mt-2 transition-all duration-200">
                  {loadingTrackFiles[track.id] ? (
                    <div className="py-4 flex justify-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                        {t("loadingFiles")}
                      </span>
                    </div>
                  ) : trackFiles[track.id]?.length > 0 ? (
                    <>
                      <h6 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-200">
                        {t("attachedFiles")}:
                      </h6>
                      <FilesList files={trackFiles[track.id]} compact={true} />
                    </>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic text-sm transition-colors duration-200">
                      {t("noFiles")}
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
