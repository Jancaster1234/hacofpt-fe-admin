// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/SponsorshipDetails.tsx
import React, { useState, useEffect } from "react";
import { Sponsorship } from "@/types/entities/sponsorship";
import { SponsorshipHackathon } from "@/types/entities/sponsorshipHackathon";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { formatDate } from "@/utils/dateFormatter";
import { sponsorshipHackathonService } from "@/services/sponsorshipHackathon.service";
import { useAuth } from "@/hooks/useAuth_v0";
import { hasOrganizerRole } from "@/utils/roleUtils";
import SponsorshipHackathonForm from "./SponsorshipHackathonForm";
import SponsorshipHackathonDetails from "./SponsorshipHackathonDetails";

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
      setError(
        "Failed to load sponsorship allocations. Please try again later."
      );
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
      setError("Failed to load allocation details. Please try again later.");
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
      setError(
        "Only the organizer who created this sponsorship can add hackathon allocations"
      );
      return;
    }

    setCurrentSponsorshipHackathon(undefined);
    setViewMode("FORM");
  };

  const handleEditHackathonAllocation = (
    sponsorshipHackathon: SponsorshipHackathon
  ) => {
    if (!isOrganizer || !isCreator) {
      setError(
        "Only the organizer who created this sponsorship can edit hackathon allocations"
      );
      return;
    }

    setCurrentSponsorshipHackathon(sponsorshipHackathon);
    setViewMode("FORM");
  };

  const handleDeleteHackathonAllocation = async (id: string) => {
    if (!isOrganizer || !isCreator) {
      setError(
        "Only the organizer who created this sponsorship can delete hackathon allocations"
      );
      return;
    }

    if (!window.confirm("Are you sure you want to delete this allocation?")) {
      return;
    }

    try {
      setLoading(true);
      await sponsorshipHackathonService.deleteSponsorshipHackathon(id);

      // Refresh the list after deletion
      loadSponsorshipHackathons();

      // Reset view mode and selection
      setViewMode("LIST");
      setSelectedSponsorshipHackathonId(null);
    } catch (err: any) {
      setError("Failed to delete allocation. Please try again later.");
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
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (sponsorshipLoading || (loading && viewMode === "LIST")) {
    return <LoadingSpinner />;
  }

  if (sponsorshipError || (error && viewMode === "LIST")) {
    return (
      <ErrorMessage
        message={sponsorshipError || error || "Error loading details"}
      />
    );
  }

  if (!sponsorship) {
    return <ErrorMessage message="Sponsorship not found" />;
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
    <div>
      <button
        onClick={onBack}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Sponsorships
      </button>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{sponsorship.name}</h3>
          <span
            className={`px-3 py-1 text-sm rounded-full ${getStatusBadgeColor(
              sponsorship.status
            )}`}
          >
            {sponsorship.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Brand</p>
            <p className="font-medium">{sponsorship.brand}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="font-medium">${sponsorship.money.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Period</p>
            <p className="font-medium">
              {formatDateTime(sponsorship.timeFrom)} -{" "}
              {formatDateTime(sponsorship.timeTo)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created By</p>
            <p className="font-medium">{sponsorship.createdByUserName}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">Description</p>
          <p className="text-gray-700">{sponsorship.content}</p>
        </div>

        {isOrganizer && (
          <div className="flex justify-end space-x-3">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Sponsorship
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
            isCreator // Use the isCreator variable we defined earlier
              ? () =>
                  currentSponsorshipHackathon &&
                  handleEditHackathonAllocation(currentSponsorshipHackathon)
              : undefined
          }
          onDelete={
            isCreator // Use the isCreator variable we defined earlier
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
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p>Only organizers can add or edit hackathon allocations.</p>
          <button
            onClick={handleBackToList}
            className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
          >
            Back to List
          </button>
        </div>
      )}

      {viewMode === "LIST" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Hackathon Allocations</h3>

          {sponsorshipHackathons.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No hackathon allocations found for this sponsorship.
              </p>
              {isOrganizer && isCreator && (
                <button
                  onClick={handleAddHackathonAllocation}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Hackathon Allocation
                </button>
              )}
            </div>
          ) : (
            <>
              {isOrganizer && isCreator && (
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={handleAddHackathonAllocation}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Hackathon Allocation
                  </button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hackathon ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Money
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sponsorshipHackathons.map((hackathon) => (
                      <tr key={hackathon.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {hackathon.hackathonId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${hackathon.totalMoney?.toLocaleString() || "0"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {hackathon.createdByUserName || "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDateTime(hackathon.createdAt || "")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() =>
                              handleSelectSponsorshipHackathon(hackathon.id)
                            }
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View Details
                          </button>
                          {isOrganizer && isCreator && (
                            <>
                              <button
                                onClick={() =>
                                  handleEditHackathonAllocation(hackathon)
                                }
                                className="text-green-600 hover:text-green-900 mr-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteHackathonAllocation(hackathon.id)
                                }
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
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
