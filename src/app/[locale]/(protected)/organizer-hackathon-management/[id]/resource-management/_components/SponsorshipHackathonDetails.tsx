// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/SponsorshipHackathonDetails.tsx
import React, { useState, useEffect } from "react";
import { SponsorshipHackathonDetail } from "@/types/entities/sponsorshipHackathonDetail";
import SponsorshipDetailFiles from "./SponsorshipDetailFiles";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { formatDate } from "@/utils/dateFormatter";
import { sponsorshipHackathonDetailService } from "@/services/sponsorshipHackathonDetail.service";
import { useAuth } from "@/hooks/useAuth_v0";
import SponsorshipHackathonDetailForm from "./SponsorshipHackathonDetailForm";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";

interface SponsorshipHackathonDetailsProps {
  sponsorshipHackathonId: string;
  sponsorshipHackathon?: any; // You may want to type this properly
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  loading?: boolean;
  error?: string | null;
  sponsorshipCreatedByUserName?: string;
}

const SponsorshipHackathonDetails: React.FC<
  SponsorshipHackathonDetailsProps
> = ({
  sponsorshipHackathonId,
  sponsorshipHackathon,
  onBack,
  onEdit,
  onDelete,
  loading: initialLoading,
  error: initialError,
  sponsorshipCreatedByUserName,
}) => {
  const { user } = useAuth();
  const t = useTranslations("sponsorshipManagement");
  const toast = useToast();
  const [details, setDetails] = useState<SponsorshipHackathonDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(initialLoading || true);
  const [error, setError] = useState<string | null>(initialError || null);
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"LIST" | "FORM" | "FILES">("LIST");
  const [currentDetail, setCurrentDetail] = useState<
    SponsorshipHackathonDetail | undefined
  >(undefined);

  useEffect(() => {
    if (sponsorshipHackathonId) {
      loadDetails();
    }
  }, [sponsorshipHackathonId]);

  const loadDetails = async () => {
    try {
      setLoading(true);
      const response =
        await sponsorshipHackathonDetailService.getSponsorshipHackathonDetailsBySponsorshipHackathonId(
          sponsorshipHackathonId
        );

      if (response.data) {
        setDetails(response.data);
        // Don't show toast for initial data loading
      }
      setError(null);
    } catch (err: any) {
      const errorMessage = err.message || t("failedToLoadDetails");
      setError(errorMessage);
      // Don't show toast for initial data loading errors
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Check if current user is the creator of the sponsorship
  const isCreatorOfSponsorship =
    user && user.username === sponsorshipCreatedByUserName;

  const handleSelectDetail = (id: string) => {
    const detail = details.find((d) => d.id === id);
    if (detail) {
      setCurrentDetail(detail);
      setSelectedDetailId(id);
      setViewMode("FILES");
    }
  };

  const handleAddDetail = () => {
    // Only allow if user is the creator
    if (!isCreatorOfSponsorship) {
      toast.error(t("onlyCreatorCanAddDetails"));
      return;
    }

    setCurrentDetail(undefined);
    setViewMode("FORM");
  };

  const handleEditDetail = (detail: SponsorshipHackathonDetail) => {
    // Only allow if user is the creator
    if (!isCreatorOfSponsorship) {
      toast.error(t("onlyCreatorCanEditDetails"));
      return;
    }

    setCurrentDetail(detail);
    setViewMode("FORM");
  };

  const handleDeleteDetail = async (id: string) => {
    // Only allow if user is the creator
    if (!isCreatorOfSponsorship) {
      toast.error(t("onlyCreatorCanDeleteDetails"));
      return;
    }

    if (!window.confirm(t("confirmDeleteDetail"))) {
      return;
    }

    try {
      setLoading(true);
      const response =
        await sponsorshipHackathonDetailService.deleteSponsorshipHackathonDetail(
          id
        );

      // Show success toast with message from API response
      toast.success(response.message || t("detailDeletedSuccessfully"));

      // Refresh the list after deletion
      loadDetails();

      // Reset view mode and selection
      setViewMode("LIST");
      setSelectedDetailId(null);
    } catch (err: any) {
      // Show error toast with message from API response
      toast.error(err.message || t("failedToDeleteDetail"));
      setError(t("failedToDeleteDetail"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    loadDetails();
    setViewMode("LIST");
  };

  const handleBackToList = () => {
    setViewMode("LIST");
    setSelectedDetailId(null);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "PLANNED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  if (loading && viewMode === "LIST") {
    return <LoadingSpinner size="md" showText={true} />;
  }

  if (error && viewMode === "LIST") {
    return <ErrorMessage message={error} />;
  }

  if (viewMode === "FILES" && selectedDetailId) {
    const detail = details.find((d) => d.id === selectedDetailId);
    if (!detail) {
      return <ErrorMessage message={t("detailNotFound")} />;
    }

    return (
      <SponsorshipDetailFiles
        sponsorshipHackathonDetailId={selectedDetailId}
        detail={detail}
        onBack={handleBackToList}
        isCreator={isCreatorOfSponsorship}
      />
    );
  }

  if (viewMode === "FORM") {
    // Additional check in case user navigates directly to this state
    if (!isCreatorOfSponsorship) {
      return (
        <div className="p-4 sm:p-6 transition-colors duration-300">
          <ErrorMessage message={t("noPermissionToAddEdit")} />
          <button
            onClick={handleBackToList}
            className="mt-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {t("backToList")}
          </button>
        </div>
      );
    }

    return (
      <SponsorshipHackathonDetailForm
        sponsorshipHackathonId={sponsorshipHackathonId}
        detail={currentDetail}
        onSuccess={handleFormSuccess}
        onCancel={handleBackToList}
      />
    );
  }

  const formatDateTime = (dateTimeStr: string): string => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-6 transition-colors duration-300">
      <button
        onClick={onBack}
        className="mb-4 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-300 focus:outline-none"
        aria-label={t("backToHackathonAllocations")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm sm:text-base">
          {t("backToHackathonAllocations")}
        </span>
      </button>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
          {t("sponsorshipAllocationDetails")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {isCreatorOfSponsorship && (
            <button
              onClick={handleAddDetail}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {t("addNewDetail")}
            </button>
          )}
          {onEdit && isCreatorOfSponsorship && (
            <button
              onClick={onEdit}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 dark:bg-green-500 text-white text-sm rounded-md hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {t("editAllocation")}
            </button>
          )}
          {onDelete && isCreatorOfSponsorship && (
            <button
              onClick={onDelete}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 dark:bg-red-500 text-white text-sm rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {t("deleteAllocation")}
            </button>
          )}
        </div>
      </div>

      {details.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            {t("noSponsorshipDetailsFound")}
          </p>
          {isCreatorOfSponsorship && (
            <button
              onClick={handleAddDetail}
              className="mt-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {t("addDetail")}
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-3 sm:-mx-6">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("description")}
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("moneySpent")}
                  </th>
                  <th className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("period")}
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("status")}
                  </th>
                  <th className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("createdBy")}
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {details.map((detail) => (
                  <tr
                    key={detail.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td className="px-3 sm:px-6 py-2 sm:py-4">
                      <div className="line-clamp-2 text-sm text-gray-900 dark:text-gray-100">
                        {detail.content}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      ${detail.moneySpent.toLocaleString()}
                    </td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="text-xs md:text-sm">
                        {formatDateTime(detail.timeFrom)}{" "}
                        <br className="md:hidden" />
                        <span className="inline-block mx-1">-</span>{" "}
                        <br className="md:hidden" />
                        {formatDateTime(detail.timeTo)}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(
                          detail.status
                        )}`}
                      >
                        {t(detail.status.toLowerCase())}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {detail.createdByUserName || t("unknown")}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleSelectDetail(detail.id)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-xs sm:text-sm transition-colors"
                          aria-label={t("viewFiles")}
                        >
                          {t("viewFiles")}
                        </button>
                        {isCreatorOfSponsorship && (
                          <>
                            <button
                              onClick={() => handleEditDetail(detail)}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 text-xs sm:text-sm transition-colors"
                              aria-label={t("edit")}
                            >
                              {t("edit")}
                            </button>
                            <button
                              onClick={() => handleDeleteDetail(detail.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-xs sm:text-sm transition-colors"
                              aria-label={t("delete")}
                            >
                              {t("delete")}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsorshipHackathonDetails;
