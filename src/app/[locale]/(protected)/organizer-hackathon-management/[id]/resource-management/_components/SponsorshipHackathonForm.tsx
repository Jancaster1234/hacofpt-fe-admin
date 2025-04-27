// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/SponsorshipHackathonForm.tsx
import React, { useState } from "react";
import { SponsorshipHackathon } from "@/types/entities/sponsorshipHackathon";
import { sponsorshipHackathonService } from "@/services/sponsorshipHackathon.service";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";

interface SponsorshipHackathonFormProps {
  hackathonId: string;
  sponsorshipId: string;
  sponsorshipHackathon?: SponsorshipHackathon;
  onSuccess: () => void;
  onCancel: () => void;
}

const SponsorshipHackathonForm: React.FC<SponsorshipHackathonFormProps> = ({
  hackathonId,
  sponsorshipId,
  sponsorshipHackathon,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<{
    totalMoney: number;
  }>({
    totalMoney: sponsorshipHackathon?.totalMoney || 0,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "totalMoney") {
      const numberValue = parseFloat(value) || 0;
      setFormData((prev) => ({
        ...prev,
        [name]: numberValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (sponsorshipHackathon?.id) {
        // Update existing sponsorship hackathon
        await sponsorshipHackathonService.updateSponsorshipHackathon({
          id: sponsorshipHackathon.id,
          hackathonId,
          sponsorshipId,
          totalMoney: formData.totalMoney,
        });
      } else {
        // Create new sponsorship hackathon
        await sponsorshipHackathonService.createSponsorshipHackathon({
          hackathonId,
          sponsorshipId,
          totalMoney: formData.totalMoney,
        });
      }

      setError(null);
      onSuccess();
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to save sponsorship allocation. Please try again later."
      );
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
      <h3 className="text-lg font-semibold mb-6">
        {sponsorshipHackathon ? "Edit Allocation" : "Add New Allocation"}
      </h3>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="totalMoney"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Total Money ($)
          </label>
          <input
            type="number"
            id="totalMoney"
            name="totalMoney"
            value={formData.totalMoney}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
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
            {sponsorshipHackathon ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SponsorshipHackathonForm;
