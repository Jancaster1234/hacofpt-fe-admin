// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/_components/EditSaveButtons.tsx
"use client";

import { useState } from "react";
import EditHackathonModal from "./EditHackathonModal";

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
  const [isEditing, setIsEditing] = useState(false);
  const [hackathonData, setHackathonData] = useState(initialHackathonData);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/hackathon/${hackathonId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hackathonData), // Send updated data
      });

      if (!response.ok) throw new Error("Failed to update hackathon");

      alert("Hackathon updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update hackathon.");
    }
  };

  return (
    <>
      <div className="top-2 left-4 flex space-x-2">
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="bg-blue-500 font-bold text-white px-4 py-2 rounded-md"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="bg-green-500 font-bold text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        )}
      </div>

      {isEditing && (
        <EditHackathonModal
          hackathon={hackathonData}
          onClose={() => setIsEditing(false)}
          onSuccess={(updatedHackathon) => {
            setHackathonData(updatedHackathon);
            setIsEditing(false);
          }}
        />
      )}
    </>
  );
}
