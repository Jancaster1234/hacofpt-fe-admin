// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/SponsorshipDetails.tsx
import React, { useState, useEffect } from "react";
import { Sponsorship } from "@/types/entities/sponsorship";
import { SponsorshipHackathon } from "@/types/entities/sponsorshipHackathon";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { formatDate } from "@/utils/dateFormatter";
import { sponsorshipHackathonService } from "@/services/sponsorshipHackathon.service";
import { useAuth } from "@/hooks/useAuth_v0";
import { hasOrganizerRole } from "@/utils/roleUtils";
import SponsorshipHackathonForm from "./SponsorshipHackathonForm";
import SponsorshipHackathonDetails from "./SponsorshipHackathonDetails";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface SponsorshipDetailsProps {
  sponsorshipId: string;
  sponsorship?: Sponsorship;
  hackathonId: string;
  onBack: () => void;
  onEdit: () => void;
  loading: boolean;
  error: string | null;
  isOrganizer: boolean;
}

const SponsorshipDetails: React.FC<SponsorshipDetailsProps> = ({
  sponsorshipId,
  sponsorship,
  hackathonId,
  onBack,
  onEdit,
  loading: sponsorshipLoading,
  error: sponsorshipError,
  isOrganizer,
}) => {
  const { user } = useAuth();
  const toast = useToast();
  const t = useTranslations("sponsorshipDetails");

  const [sponsorshipHackathons, setSponsorshipHackathons] = useState<
    SponsorshipHackathon[]
  >([]);
  const [selectedSponsorshipHackathonId, setSelectedSponsorshipHackathonId] =
    useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"LIST" | "FORM" | "DETAILS">("LIST");
  const [currentSponsorshipHackathon, setCurrentSponsorshipHackathon] =
    useState<SponsorshipHackathon | undefined>(undefined);

  useEffect(() => {
    loadSponsorshipHackathons();
  }, [sponsorshipId, hackathonId]);

  const loadSponsorshipHackathons = async () => {
    try {
      setLoading(true);
      // Fetch sponsorship hackathons related to this sponsorship
      const response =
        await sponsorshipHackathonService.getSponsorshipHackathonsBySponsorshipId(
          sponsorshipId
        );

      if (response.data) {
        setSponsorshipHackathons(response.data);

        // If there's only one sponsorship hackathon, select it automatically
        if (response.data.length === 1) {
          setSelectedSponsorshipHackathonId(response.data[0].id);
        }
      }

      setError(null);
    } catch (err: any) {
      setError(t("errors.loadAllocationsFailed"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSponsorshipHackathon = async (id: string) => {
    try {
      setLoading(true);
      const response =
        await sponsorshipHackathonService.getSponsorshipHackathonById(id);

      if (response.data) {
        setCurrentSponsorshipHackathon(response.data);
        setSelectedSponsorshipHackathonId(id);
        setViewMode("DETAILS");
      }
    } catch (err: any) {
      setError(t("errors.loadDetailsFailed"));
      toast.error(err.message || t("errors.loadDetailsFailed"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isCreator =
    sponsorship && user && sponsorship.createdByUserName === user.username;

  // Only allow adding hackathon allocation if user is organizer AND creator of the sponsorship
  const handleAddHackathonAllocation = () => {
    if (!isOrganizer || !isCreator) {
      setError(t("errors.onlyCreatorCanAdd"));
      toast.error(t("errors.onlyCreatorCanAdd"));
      return;
    }

    setCurrentSponsorshipHackathon(undefined);
    setViewMode("FORM");
  };

  const handleEditHackathonAllocation = (
    sponsorshipHackathon: SponsorshipHackathon
  ) => {
    if (!isOrganizer || !isCreator) {
      setError(t("errors.onlyCreatorCanEdit"));
      toast.error(t("errors.onlyCreatorCanEdit"));
      return;
    }

    setCurrentSponsorshipHackathon(sponsorshipHackathon);
    setViewMode("FORM");
  };

  const handleDeleteHackathonAllocation = async (id: string) => {
    if (!isOrganizer || !isCreator) {
      setError(t("errors.onlyCreatorCanDelete"));
      toast.error(t("errors.onlyCreatorCanDelete"));
      return;
    }

    if (!window.confirm(t("confirmations.deleteAllocation"))) {
      return;
    }

    try {
      setLoading(true);
      const response =
        await sponsorshipHackathonService.deleteSponsorshipHackathon(id);

      // Show success toast with the message from API
      toast.success(response.message || t("success.allocationDeleted"));

      // Refresh the list after deletion
      loadSponsorshipHackathons();

      // Reset view mode and selection
      setViewMode("LIST");
      setSelectedSponsorshipHackathonId(null);
    } catch (err: any) {
      setError(t("errors.deleteFailed"));
      toast.error(err.message || t("errors.deleteFailed"));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    loadSponsorshipHackathons();
    setViewMode("LIST");
  };

  const handleBackToList = () => {
    setViewMode("LIST");
    setSelectedSponsorshipHackathonId(null);
  };

  const canModify = () => {
    return isOrganizer && isCreator;
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  if (sponsorshipLoading || (loading && viewMode === "LIST")) {
    return <LoadingSpinner size="lg" showText={true} />;
  }

  if (sponsorshipError || (error && viewMode === "LIST")) {
    return (
      <ErrorMessage
        message={sponsorshipError || error || t("errors.loadingDetails")}
      />
    );
  }

  if (!sponsorship) {
    return <ErrorMessage message={t("errors.sponsorshipNotFound")} />;
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
    <div className="transition-colors duration-200 ease-in-out">
      <button
        onClick={onBack}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        {t("actions.backToSponsorships")}
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-6 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">
            {sponsorship.name}
          </h3>
          <span
            className={`px-3 py-1 text-sm rounded-full ${getStatusBadgeColor(
              sponsorship.status
            )} transition-colors duration-200`}
          >
            {t(`status.${sponsorship.status.toLowerCase()}`)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("fields.brand")}
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {sponsorship.brand}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("fields.totalAmount")}
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              (VND) {sponsorship.money.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("fields.period")}
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatDateTime(sponsorship.timeFrom)} -{" "}
              {formatDateTime(sponsorship.timeTo)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("fields.createdBy")}
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {sponsorship.createdByUserName}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {t("fields.description")}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {sponsorship.content}
          </p>
        </div>

        {isOrganizer && (
          <div className="flex justify-end space-x-3">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label={t("actions.editSponsorship")}
            >
              {t("actions.editSponsorship")}
            </button>
          </div>
        )}
      </div>

      {viewMode === "DETAILS" && selectedSponsorshipHackathonId && (
        <SponsorshipHackathonDetails
          sponsorshipHackathonId={selectedSponsorshipHackathonId}
          sponsorshipHackathon={currentSponsorshipHackathon}
          sponsorshipCreatedByUserName={sponsorship.createdByUserName}
          onBack={handleBackToList}
          onEdit={
            isCreator
              ? () =>
                  currentSponsorshipHackathon &&
                  handleEditHackathonAllocation(currentSponsorshipHackathon)
              : undefined
          }
          onDelete={
            isCreator
              ? () =>
                  selectedSponsorshipHackathonId &&
                  handleDeleteHackathonAllocation(
                    selectedSponsorshipHackathonId
                  )
              : undefined
          }
          loading={loading}
          error={error}
        />
      )}

      {viewMode === "FORM" && isOrganizer && (
        <SponsorshipHackathonForm
          hackathonId={hackathonId}
          sponsorshipId={sponsorshipId}
          sponsorshipHackathon={currentSponsorshipHackathon}
          onSuccess={handleFormSuccess}
          onCancel={handleBackToList}
        />
      )}

      {viewMode === "FORM" && !isOrganizer && (
        <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200 p-4 mb-4 rounded transition-colors duration-200">
          <p>{t("errors.onlyOrganizersCanModify")}</p>
          <button
            onClick={handleBackToList}
            className="mt-2 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white py-1 px-3 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            aria-label={t("actions.backToList")}
          >
            {t("actions.backToList")}
          </button>
        </div>
      )}

      {viewMode === "LIST" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {t("sections.hackathonAllocations")}
          </h3>

          {sponsorshipHackathons.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {t("messages.noAllocationsFound")}
              </p>
              {isOrganizer && isCreator && (
                <button
                  onClick={handleAddHackathonAllocation}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  aria-label={t("actions.addHackathonAllocation")}
                >
                  {t("actions.addHackathonAllocation")}
                </button>
              )}
            </div>
          ) : (
            <>
              {isOrganizer && isCreator && (
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={handleAddHackathonAllocation}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    aria-label={t("actions.addHackathonAllocation")}
                  >
                    {t("actions.addHackathonAllocation")}
                  </button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t("table.hackathonId")}
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t("table.totalMoney")}
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t("table.createdBy")}
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t("table.createdAt")}
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t("table.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
                    {sponsorshipHackathons.map((hackathon) => (
                      <tr
                        key={hackathon.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                          {hackathon.hackathonId}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                          (VND) {hackathon.totalMoney?.toLocaleString() || "0"}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                          {hackathon.createdByUserName || t("labels.unknown")}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                          {formatDateTime(hackathon.createdAt || "")}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() =>
                              handleSelectSponsorshipHackathon(hackathon.id)
                            }
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3 transition-colors duration-200 focus:outline-none"
                            aria-label={t("actions.viewDetails")}
                          >
                            {t("actions.viewDetails")}
                          </button>
                          {isOrganizer && isCreator && (
                            <>
                              <button
                                onClick={() =>
                                  handleEditHackathonAllocation(hackathon)
                                }
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3 transition-colors duration-200 focus:outline-none"
                                aria-label={t("actions.edit")}
                              >
                                {t("actions.edit")}
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteHackathonAllocation(hackathon.id)
                                }
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 focus:outline-none"
                                aria-label={t("actions.delete")}
                              >
                                {t("actions.delete")}
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SponsorshipDetails;
