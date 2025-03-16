// src/app/(protected)/organizer-hackathon-management/[id]/_components/HackathonTabs.tsx
"use client";

import { useState, useEffect } from "react";

type TabKey =
  | "information"
  | "description"
  | "participant"
  | "documentation"
  | "contact"
  | "mark_criteria";

const tabs: { key: TabKey; label: string }[] = [
  { key: "information", label: "Information" },
  { key: "description", label: "Description" },
  { key: "participant", label: "Participant" },
  { key: "documentation", label: "Documentation" },
  { key: "contact", label: "Contact" },
  { key: "mark_criteria", label: "Mark Criteria" },
];

interface Criteria {
  title: string;
  note: string;
  bandScore: number;
}

export default function HackathonTabs({
  content,
}: {
  content: Record<TabKey, string | string[]>;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("information");
  const [criteriaList, setCriteriaList] = useState<Criteria[]>([
    {
      title: "Innovation (tính sáng tạo)",
      note: "Innovation có tiêu chí đánh giá ....",
      bandScore: 10,
    },
    {
      title: "Scalability (khả năng mở rộng)",
      note: "Scalability có tiêu chí đánh giá ....",
      bandScore: 10,
    },
  ]);

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

  const addCriteria = () => {
    setCriteriaList([...criteriaList, { title: "", note: "", bandScore: 0 }]);
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
        {activeTab === "mark_criteria" ? (
          <div>
            {criteriaList.map((criteria, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg">
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={criteria.title}
                  onChange={(e) => {
                    const updatedCriteria = [...criteriaList];
                    updatedCriteria[index].title = e.target.value;
                    setCriteriaList(updatedCriteria);
                  }}
                  className="w-full p-2 border rounded mt-1"
                />

                <label className="block text-sm font-medium mt-2">Note</label>
                <textarea
                  value={criteria.note}
                  onChange={(e) => {
                    const updatedCriteria = [...criteriaList];
                    updatedCriteria[index].note = e.target.value;
                    setCriteriaList(updatedCriteria);
                  }}
                  className="w-full p-2 border rounded mt-1"
                ></textarea>

                <label className="block text-sm font-medium mt-2">
                  Band score
                </label>
                <input
                  type="number"
                  value={criteria.bandScore}
                  onChange={(e) => {
                    const updatedCriteria = [...criteriaList];
                    updatedCriteria[index].bandScore = Number(e.target.value);
                    setCriteriaList(updatedCriteria);
                  }}
                  className="w-full p-2 border rounded mt-1"
                />
              </div>
            ))}

            <button
              onClick={addCriteria}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Thêm criteria
            </button>
          </div>
        ) : Array.isArray(content[activeTab]) ? (
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
