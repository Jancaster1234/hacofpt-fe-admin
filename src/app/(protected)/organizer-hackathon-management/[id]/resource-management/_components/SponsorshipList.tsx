// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/SponsorshipList.tsx
import React from "react";
import { Sponsorship } from "@/types/entities/sponsorship";
import { formatDate } from "@/utils/dateFormatter";

interface SponsorshipListProps {
  sponsorships: Sponsorship[];
  onSelectSponsorship: (id: string) => void;
  onAddNewSponsorship: () => void;
}

const SponsorshipList: React.FC<SponsorshipListProps> = ({
  sponsorships,
  onSelectSponsorship,
  onAddNewSponsorship,
}) => {
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

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">All Sponsorships</h3>
        <button
          onClick={onAddNewSponsorship}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add New Sponsorship
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
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
            {sponsorships.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No sponsorships found
                </td>
              </tr>
            ) : (
              sponsorships.map((sponsorship) => (
                <tr key={sponsorship.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sponsorship.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sponsorship.brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${sponsorship.money.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(sponsorship.timeFrom)} -{" "}
                    {formatDate(sponsorship.timeTo)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(
                        sponsorship.status
                      )}`}
                    >
                      {sponsorship.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onSelectSponsorship(sponsorship.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SponsorshipList;
