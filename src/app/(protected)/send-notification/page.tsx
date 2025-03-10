// src/app/(protected)/send-notification/page.tsx
"use client";

import { useState } from "react";

export default function SendNotificationPage() {
  const [notificationText, setNotificationText] = useState("");

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Notification Content:</h2>

      {/* Text Area */}
      <textarea
        className="w-full p-3 border rounded-md bg-gray-100 text-sm font-mono"
        rows={6}
        value={notificationText}
        onChange={(e) => setNotificationText(e.target.value)}
        placeholder="Enter your notification message here..."
      />

      {/* Edit List Section */}
      <div className="mt-4">
        <h3 className="text-md font-semibold mb-1">Edit recipient list:</h3>
        <button className="bg-gray-300 px-4 py-2 rounded-md">Edit list</button>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex space-x-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Preview
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Confirm
        </button>
      </div>
    </div>
  );
}
