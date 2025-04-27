// src/app/[locale]/(protected)/grading-submission/[id]/_components/EditSaveButtons.tsx
"use client";

import { useState } from "react";
import EditHackathonModal from "./EditHackathonModal";

type EditSaveButtonsProps = {
  hackathonId: string;
  initialHackathonData: any; // Replace `any` with proper type if available
};

export default function EditSaveButtons({
  hackathonId,
  initialHackathonData,
}: EditSaveButtonsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hackathonData, setHackathonData] = useState(initialHackathonData);

  const handleEdit = () => {
    setIsModalOpen(true);
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
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        )}
      </div>

      <EditHackathonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </>
  );
}
