"use client";

import { useState } from "react";

type EditSaveButtonsProps = {
  onSave: () => void;
  onEdit: () => void;
  isEditing: boolean;
};

export default function EditSaveButtons({
  onSave,
  onEdit,
  isEditing,
}: EditSaveButtonsProps) {
  return (
    <div className="absolute top-2 left-4 flex space-x-2">
      {!isEditing ? (
        <button
          onClick={onEdit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Edit
        </button>
      ) : (
        <button
          onClick={onSave}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Save
        </button>
      )}
    </div>
  );
}
