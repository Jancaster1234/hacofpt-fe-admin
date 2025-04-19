// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/SponsorshipHackathonDetailForm.tsx
import React, { useState } from "react";
import { SponsorshipHackathonDetail } from "@/types/entities/sponsorshipHackathonDetail";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { sponsorshipHackathonDetailService } from "@/services/sponsorshipHackathonDetail.service";

interface SponsorshipHackathonDetailFormProps {
  sponsorshipHackathonId: string;
  detail?: SponsorshipHackathonDetail;
  onSuccess: () => void;
  onCancel: () => void;
}

const SponsorshipHackathonDetailForm: React.FC<
  SponsorshipHackathonDetailFormProps
> = ({ sponsorshipHackathonId, detail, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<{
    content: string;
    moneySpent: number;
    status: "PLANNED" | "COMPLETED" | "CANCELLED";
    timeFrom: string;
    timeTo: string;
  }>({
    content: detail?.content || "",
    moneySpent: detail?.moneySpent || 0,
    status:
      (detail?.status as "PLANNED" | "COMPLETED" | "CANCELLED") || "PLANNED",
    timeFrom: detail?.timeFrom
      ? new Date(detail.timeFrom).toISOString().split("T")[0]
      : "",
    timeTo: detail?.timeTo
      ? new Date(detail.timeTo).toISOString().split("T")[0]
      : "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "moneySpent" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        sponsorshipHackathonId,
        ...formData,
      };

      if (detail?.id) {
        // Update existing detail
        await sponsorshipHackathonDetailService.updateSponsorshipHackathonDetailInformation(
          detail.id,
          payload
        );
      } else {
        // Create new detail
        await sponsorshipHackathonDetailService.createSponsorshipHackathonDetail(
          payload
        );
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to save detail. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between mb-6">
        <h3 className="text-lg font-semibold">
          {detail ? "Edit Detail" : "Create New Detail"}
        </h3>
      </div>

      {error && <ErrorMessage message={error} className="mb-4" />}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description*
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Money Spent*
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                $
              </span>
              <input
                type="number"
                name="moneySpent"
                value={formData.moneySpent}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status*
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="PLANNED">Planned</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date*
            </label>
            <input
              type="date"
              name="timeFrom"
              value={formData.timeFrom}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date*
            </label>
            <input
              type="date"
              name="timeTo"
              value={formData.timeTo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {detail ? "Update Detail" : "Create Detail"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SponsorshipHackathonDetailForm;
