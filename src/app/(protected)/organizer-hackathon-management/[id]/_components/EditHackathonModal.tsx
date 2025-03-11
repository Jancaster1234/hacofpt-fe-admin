// src/app/(protected)/organizer-hackathon-management/[id]/_components/EditHackathonModal.tsx
"use client";

import React, { useState } from "react";

type EditHackathonModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
};

const TABS = [
  "Banner",
  "Information",
  "Description",
  "Participant",
  "Documentation",
  "Contact",
];

export default function EditHackathonModal({
  isOpen,
  onClose,
  onSave,
}: EditHackathonModalProps) {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-99999 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-lg font-bold mb-4">Edit Hackathon</h2>

        {/* Tabs */}
        <div className="flex flex-wrap border-b mb-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {activeTab === "Banner" && (
            <div>
              <label className="block font-medium">Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md mt-1"
                placeholder="Hackathon Title"
              />

              <label className="block mt-3 font-medium">Banner image:</label>
              <button className="text-blue-500 underline">Upload</button>
              <label className="block mt-3 font-medium">Subtitle</label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Enter a short description..."
              />
              <div className="flex items-center mt-3">
                <input type="checkbox" className="mr-2" defaultChecked />
                <label>Show the number of registered participants</label>
              </div>
            </div>
          )}

          {activeTab === "Information" && (
            <textarea
              className="w-full p-2 border rounded-md"
              rows={5}
              placeholder="Enter information here..."
            />
          )}

          {activeTab === "Description" && (
            <textarea
              className="w-full p-2 border rounded-md"
              rows={5}
              placeholder="Enter description here..."
            />
          )}

          {activeTab === "Participant" && (
            <div>
              <label className="inline-flex items-center">
                <input type="checkbox" className="mr-2" /> Show number of
                participants
              </label>
            </div>
          )}

          {activeTab === "Documentation" && (
            <div>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Upload Files
              </button>
              <ul className="mt-2">
                <li className="flex justify-between border p-2 rounded-md">
                  <span>Quy_che_thi.docx</span>
                  <button className="text-red-500">Delete</button>
                </li>
              </ul>
            </div>
          )}

          {activeTab === "Contact" && (
            <div>
              <label className="block font-medium">Phone Number</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md mt-1"
                placeholder="Enter phone number"
              />

              <label className="block mt-3 font-medium">Facebook</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md mt-1"
                placeholder="Facebook link"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
