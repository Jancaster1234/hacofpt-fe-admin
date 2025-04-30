// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/_components/EditSaveButtons.tsx
"use client";

import { useRouter } from "next/navigation";

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

  const handleEdit = () => {
    // Navigate to the edit page with the hackathon ID
    router.push(`/organizer-hackathon-management/${hackathonId}/edit`);
  };

  return (
    <div className="top-2 left-4 flex space-x-2">
      <button
        onClick={handleEdit}
        className="bg-blue-500 hover:bg-blue-600 font-bold text-white px-4 py-2 rounded-md transition-colors duration-300"
      >
        Edit
      </button>
    </div>
  );
}
