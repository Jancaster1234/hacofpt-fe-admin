// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/SponsorshipHackathonForm.tsx
"use client";
import React, { useState } from "react";
import { SponsorshipHackathon } from "@/types/entities/sponsorshipHackathon";
import { sponsorshipHackathonService } from "@/services/sponsorshipHackathon.service";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useTranslations } from "@/hooks/useTranslations";
import { useToast } from "@/hooks/use-toast";

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
  const t = useTranslations("sponsorshipHackathon");
  const toast = useToast();

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
      let response;

      if (sponsorshipHackathon?.id) {
        // Update existing sponsorship hackathon
        response = await sponsorshipHackathonService.updateSponsorshipHackathon(
          {
            id: sponsorshipHackathon.id,
            hackathonId,
            sponsorshipId,
            totalMoney: formData.totalMoney,
          }
        );

        toast.success(response.message || t("updateSuccess"));
      } else {
        // Create new sponsorship hackathon
        response = await sponsorshipHackathonService.createSponsorshipHackathon(
          {
            hackathonId,
            sponsorshipId,
            totalMoney: formData.totalMoney,
          }
        );

        toast.success(response.message || t("createSuccess"));
      }

      setError(null);
      onSuccess();
    } catch (err: any) {
      const errorMessage = err.message || t("saveError");
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6 transition-all duration-300">
        <LoadingSpinner size="md" showText={true} />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">
        {sponsorshipHackathon ? t("editAllocation") : t("addNewAllocation")}
      </h3>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="totalMoney"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t("totalMoney")}
          </label>
          <div className="relative">
            <input
              type="number"
              id="totalMoney"
              name="totalMoney"
              value={formData.totalMoney}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
              required
              aria-label={t("totalMoney")}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("moneyHelperText")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
          >
            {sponsorshipHackathon ? t("update") : t("create")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SponsorshipHackathonForm;
