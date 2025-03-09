// src/app/hackathon/[id]/_components/HackathonTabs.tsx
"use client";

import { useState, useEffect } from "react";

type TabKey =
  | "information"
  | "description"
  | "participant"
  | "documentation"
  | "contact";

const tabs: { key: TabKey; label: string }[] = [
  { key: "information", label: "Information" },
  { key: "description", label: "Description" },
  { key: "participant", label: "Participant" },
  { key: "documentation", label: "Documentation" },
  { key: "contact", label: "Contact" },
];

export default function HackathonTabs({
  content,
}: {
  content: Record<TabKey, string | string[]>;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("information");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as TabKey;
    if (tabs.some((tab) => tab.key === hash)) {
      setActiveTab(hash);
    }
  }, []);

  const handleTabClick = (key: TabKey) => {
    setActiveTab(key);
    window.location.hash = key; // Update URL hash
  };

  return (
    <div className="mt-6">
      {/* Tab Buttons */}
      <div className="flex border-b">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleTabClick(key)}
            className={`px-4 py-2 text-lg ${
              activeTab === key
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4 p-4 border rounded-lg bg-white">
        {Array.isArray(content[activeTab]) ? (
          <ul className="list-disc pl-5">
            {(content[activeTab] as string[]).map((doc, index) => (
              <li key={index}>
                <a
                  href={doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {doc}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>{content[activeTab]}</p>
        )}
      </div>
    </div>
  );
}
