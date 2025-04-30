// src/app/[locale]/(protected)/hackathon/[id]/_components/EditSaveButtons.tsx
"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";

interface Hackathon {
  id: string;
  title: string;
  subTitle: string;
  bannerImageUrl: string;
  enrollStartDate: string;
  enrollEndDate: string;
  startDate: string;
  endDate: string;
  information: string;
  description: string;
  contact: string;
  category: string;
  organization: string;
  status: string;
  minimumTeamMembers: number;
  maximumTeamMembers: number;
  documentation: string[];
}

type EditSaveButtonsProps = {
  hackathonId: string;
  initialHackathonData: Hackathon;
};

export default function EditSaveButtons({
  hackathonId,
  initialHackathonData,
}: EditSaveButtonsProps) {
  const router = useRouter();
  const t = useTranslations("hackathonManagement");

  const handleEdit = () => {
    // Navigate to the edit page with the hackathon ID
    router.push(`/organizer-hackathon-management/${hackathonId}/edit`);
  };

  return (
    <div className="flex space-x-2 transition-colors duration-300">
      <button
        onClick={handleEdit}
        className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 font-medium text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md transition-all duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800 shadow-sm"
        aria-label={t("editHackathon")}
      >
        {t("edit")}
      </button>
    </div>
  );
}
