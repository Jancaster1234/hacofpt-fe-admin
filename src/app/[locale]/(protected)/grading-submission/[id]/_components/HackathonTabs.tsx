// src/app/[locale]/(protected)/grading-submission/[id]/_components/HackathonTabs.tsx
"use client";

import { useState, useEffect } from "react";

type TabKey =
  | "information"
  | "description"
  | "participant"
  | "documentation"
  | "contact"
  | "submission";

const tabs: { key: TabKey; label: string }[] = [
  { key: "information", label: "Information" },
  { key: "description", label: "Description" },
  { key: "participant", label: "Participant" },
  { key: "documentation", label: "Documentation" },
  { key: "contact", label: "Contact" },
  { key: "submission", label: "Submission" },
];

const mockSubmissions: Submission[] = [
  { team: "Team A", score: "96.7/100", downloadLink: "#" },
  { team: "Team G", score: "93.3/100", downloadLink: "#" },
  { team: "Team S", score: "80.0/100", downloadLink: "#" },
  { team: "Team B", score: "78.0/100", downloadLink: "#" },
  { team: "Team B", score: "78.0/100", downloadLink: "#" },
  { team: "Team B", score: "78.0/100", downloadLink: "#" },
  { team: "Team B", score: "78.0/100", downloadLink: "#" },
  { team: "Team B", score: "78.0/100", downloadLink: "#" },
  { team: "Team B", score: "78.0/100", downloadLink: "#" },
  { team: "Team H", score: "Not marked", downloadLink: "#" },
];

type Submission = {
  team: string;
  score: string;
  downloadLink: string;
};

export default function HackathonTabs({
  content,
}: {
  content: Record<TabKey, string | string[]>;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("information");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [sortedSubmissions, setSortedSubmissions] = useState<Submission[]>([]);
  const [sortAscending, setSortAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as TabKey;
    if (tabs.some((tab) => tab.key === hash)) {
      setActiveTab(hash);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "submission") {
      // Simulating an API call
      setTimeout(() => {
        const mockSubmissions: Submission[] = [
          { team: "Team A", score: "96.7", downloadLink: "#" },
          { team: "Team G", score: "93.3", downloadLink: "#" },
          { team: "Team S", score: "80.0", downloadLink: "#" },
          { team: "Team B", score: "78.0", downloadLink: "#" },
          { team: "Team H", score: "Not marked", downloadLink: "#" },
        ];
        setSubmissions(mockSubmissions);
      }, 500); // Simulated delay
    }
  }, [activeTab]);

  useEffect(() => {
    setSortedSubmissions(
      [...submissions].sort((a, b) => {
        if (a.score === "Not marked") return 1;
        if (b.score === "Not marked") return -1;
        return sortAscending
          ? parseFloat(a.score) - parseFloat(b.score)
          : parseFloat(b.score) - parseFloat(a.score);
      })
    );
  }, [submissions, sortAscending]);

  const handleTabClick = (key: TabKey) => {
    setActiveTab(key);
    window.location.hash = key; // Update URL hash
  };

  const toggleSort = () => {
    setSortAscending(!sortAscending);
  };

  // Pagination Logic
  const totalPages = Math.ceil(submissions.length / itemsPerPage);
  const paginatedSubmissions = sortedSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        {activeTab === "submission" ? (
          <>
            {/* Round Selection */}
            <div className="flex space-x-4 mb-4">
              <button className="px-4 py-2 text-sm font-medium border rounded-lg bg-gray-100">
                Round 1
              </button>
              <button className="px-4 py-2 text-sm font-medium border rounded-lg bg-gray-100">
                Round 2
              </button>
              <button className="px-4 py-2 text-sm font-medium border rounded-lg bg-gray-300">
                Round 3
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Team</th>
                    <th
                      className="px-4 py-2 text-left cursor-pointer"
                      onClick={toggleSort}
                    >
                      Total Score {sortAscending ? "▲" : "▼"}
                    </th>
                    <th className="px-4 py-2 text-left">Submission</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSubmissions.map((submission, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{submission.team}</td>
                      <td className="px-4 py-2">{submission.score}</td>
                      <td className="px-4 py-2">
                        <a
                          href={submission.downloadLink}
                          className="text-blue-500 underline"
                        >
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <span>
                Showing {itemsPerPage * (currentPage - 1) + 1}-
                {Math.min(itemsPerPage * currentPage, submissions.length)} of{" "}
                {submissions.length}
              </span>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  ◀
                </button>
                <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  ▶
                </button>
              </div>
            </div>
          </>
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
