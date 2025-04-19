// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/SponsorshipHackathonDetails.tsx
import React, { useState, useEffect } from "react";
import { SponsorshipHackathonDetail } from "@/types/entities/sponsorshipHackathonDetail";
import SponsorshipDetailFiles from "./SponsorshipDetailFiles";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { formatDate } from "@/utils/dateFormatter";
import { sponsorshipHackathonDetailService } from "@/services/sponsorshipHackathonDetail.service";
import { useAuth } from "@/hooks/useAuth_v0";
import SponsorshipHackathonDetailForm from "./SponsorshipHackathonDetailForm";

interface SponsorshipHackathonDetailsProps {
  sponsorshipHackathonId: string;
  sponsorshipHackathon?: any; // You may want to type this properly
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  loading?: boolean;
  error?: string | null;
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
}) => {
  const { user } = useAuth();
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
      }
      setError(null);
    } catch (err: any) {
      setError("Failed to load sponsorship details. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDetail = (id: string) => {
    const detail = details.find((d) => d.id === id);
    if (detail) {
      setCurrentDetail(detail);
      setSelectedDetailId(id);
      setViewMode("FILES");
    }
  };

  const handleAddDetail = () => {
    setCurrentDetail(undefined);
    setViewMode("FORM");
  };

  const handleEditDetail = (detail: SponsorshipHackathonDetail) => {
    setCurrentDetail(detail);
    setViewMode("FORM");
  };

  const handleDeleteDetail = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this detail?")) {
      return;
    }

    try {
      setLoading(true);
      await sponsorshipHackathonDetailService.deleteSponsorshipHackathonDetail(
        id
      );

      // Refresh the list after deletion
      loadDetails();

      // Reset view mode and selection
      setViewMode("LIST");
      setSelectedDetailId(null);
    } catch (err: any) {
      setError("Failed to delete detail. Please try again later.");
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

  // Check if user is the creator of the detail
  const canModify = (createdByUserName?: string) => {
    return user && createdByUserName === user.username;
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PLANNED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && viewMode === "LIST") {
    return <LoadingSpinner />;
  }

  if (error && viewMode === "LIST") {
    return <ErrorMessage message={error} />;
  }

  if (viewMode === "FILES" && selectedDetailId) {
    const detail = details.find((d) => d.id === selectedDetailId);
    if (!detail) {
      return <ErrorMessage message="Detail not found" />;
    }

    return (
      <SponsorshipDetailFiles
        sponsorshipHackathonDetailId={selectedDetailId}
        detail={detail}
        onBack={handleBackToList}
      />
    );
  }

  if (viewMode === "FORM") {
    return (
      <SponsorshipHackathonDetailForm
        sponsorshipHackathonId={sponsorshipHackathonId}
        detail={currentDetail}
        onSuccess={handleFormSuccess}
        onCancel={handleBackToList}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
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
        Back to Hackathon Allocations
      </button>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">
          Sponsorship Allocation Details
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleAddDetail}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add New Detail
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Edit Allocation
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Allocation
            </button>
          )}
        </div>
      </div>

      {details.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No sponsorship details found.</p>
          <button
            onClick={handleAddDetail}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Detail
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Money Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {details.map((detail) => (
                <tr key={detail.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="line-clamp-2">{detail.content}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${detail.moneySpent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(detail.timeFrom)} - {formatDate(detail.timeTo)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(
                        detail.status
                      )}`}
                    >
                      {detail.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {detail.createdByUserName || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleSelectDetail(detail.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View Files
                    </button>
                    {canModify(detail.createdByUserName) && (
                      <>
                        <button
                          onClick={() => handleEditDetail(detail)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDetail(detail.id)}
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
      )}
    </div>
  );
};

export default SponsorshipHackathonDetails;
