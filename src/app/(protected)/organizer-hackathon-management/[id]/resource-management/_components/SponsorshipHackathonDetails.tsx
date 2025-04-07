// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/SponsorshipHackathonDetails.tsx
import React, { useState, useEffect } from "react";
import { fetchMockSponsorshipHackathonDetails } from "../_mocks/fetchMockSponsorshipHackathonDetails";
import { SponsorshipHackathonDetail } from "@/types/entities/sponsorshipHackathonDetail";
import SponsorshipDetailFiles from "./SponsorshipDetailFiles";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { formatDate } from "@/utils/dateFormatter";

interface SponsorshipHackathonDetailsProps {
  sponsorshipHackathonId: string;
  onBack: () => void;
}

const SponsorshipHackathonDetails: React.FC<
  SponsorshipHackathonDetailsProps
> = ({ sponsorshipHackathonId, onBack }) => {
  const [details, setDetails] = useState<SponsorshipHackathonDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchMockSponsorshipHackathonDetails({
          sponsorshipHackathonId,
        });
        setDetails(data);
        setError(null);
      } catch (err) {
        setError("Failed to load sponsorship details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [sponsorshipHackathonId]);

  const handleSelectDetail = (id: string) => {
    setSelectedDetailId(id);
  };

  const handleBackToDetails = () => {
    setSelectedDetailId(null);
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (selectedDetailId) {
    const detail = details.find((d) => d.id === selectedDetailId);
    if (!detail) {
      return <ErrorMessage message="Detail not found" />;
    }

    return (
      <SponsorshipDetailFiles
        sponsorshipHackathonDetailId={selectedDetailId}
        detail={detail}
        onBack={handleBackToDetails}
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
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Add New Detail
        </button>
      </div>

      {details.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No sponsorship details found.</p>
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
                    <button
                      onClick={() => handleSelectDetail(detail.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View Files
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      Edit
                    </button>
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
