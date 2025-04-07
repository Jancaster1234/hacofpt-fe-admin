// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/SponsorshipDetails.tsx
import React, { useState, useEffect } from "react";
import { fetchMockSponsorships } from "../_mocks/fetchMockSponsorships";
import { fetchMockSponsorshipHackathons } from "../_mocks/fetchMockSponsorshipHackathons";
import { Sponsorship } from "@/types/entities/sponsorship";
import { SponsorshipHackathon } from "@/types/entities/sponsorshipHackathon";
import SponsorshipHackathonDetails from "./SponsorshipHackathonDetails";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { formatDate } from "@/utils/dateFormatter";

interface SponsorshipDetailsProps {
  sponsorshipId: string;
  hackathonId: string;
  onBack: () => void;
}

const SponsorshipDetails: React.FC<SponsorshipDetailsProps> = ({
  sponsorshipId,
  hackathonId,
  onBack,
}) => {
  const [sponsorship, setSponsorship] = useState<Sponsorship | null>(null);
  const [sponsorshipHackathons, setSponsorshipHackathons] = useState<
    SponsorshipHackathon[]
  >([]);
  const [selectedSponsorshipHackathonId, setSelectedSponsorshipHackathonId] =
    useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch the sponsorship details
        const sponsorships = await fetchMockSponsorships();
        const foundSponsorship = sponsorships.find(
          (s) => s.id === sponsorshipId
        );

        if (!foundSponsorship) {
          throw new Error("Sponsorship not found");
        }

        setSponsorship(foundSponsorship);

        // Fetch sponsorship hackathons related to this sponsorship
        const hackathons = await fetchMockSponsorshipHackathons({
          sponsorshipId: sponsorshipId,
          hackathonId: hackathonId,
        });

        setSponsorshipHackathons(hackathons);

        // If there's only one sponsorship hackathon, select it automatically
        if (hackathons.length === 1) {
          setSelectedSponsorshipHackathonId(hackathons[0].id);
        }

        setError(null);
      } catch (err) {
        setError("Failed to load sponsorship details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sponsorshipId, hackathonId]);

  const handleSelectSponsorshipHackathon = (id: string) => {
    setSelectedSponsorshipHackathonId(id);
  };

  const handleBackToHackathons = () => {
    setSelectedSponsorshipHackathonId(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !sponsorship) {
    return <ErrorMessage message={error || "Sponsorship not found"} />;
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
              {formatDate(sponsorship.timeFrom)} -{" "}
              {formatDate(sponsorship.timeTo)}
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

        <div className="flex justify-end space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Edit Sponsorship
          </button>
        </div>
      </div>

      {selectedSponsorshipHackathonId ? (
        <SponsorshipHackathonDetails
          sponsorshipHackathonId={selectedSponsorshipHackathonId}
          onBack={handleBackToHackathons}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Hackathon Allocations</h3>

          {sponsorshipHackathons.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No hackathon allocations found for this sponsorship.
              </p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Add Hackathon Allocation
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Add Hackathon Allocation
                </button>
              </div>

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
                          ${hackathon.totalMoney.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(hackathon.createdAt)}
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
