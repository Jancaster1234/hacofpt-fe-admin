// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/HackathonResults.tsx
"use client";
import React, { useState, useEffect } from "react";
import { HackathonResult } from "@/types/entities/hackathonResult";
import { hackathonResultService } from "@/services/hackathonResult.service";
import { useApiModal } from "@/hooks/useApiModal";

interface HackathonResultsProps {
  hackathonId: string;
}

export default function HackathonResults({
  hackathonId,
}: HackathonResultsProps) {
  const [results, setResults] = useState<HackathonResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useApiModal();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const { data, message } =
          await hackathonResultService.getHackathonResultsByHackathonId(
            hackathonId
          );

        if (data && data.length > 0) {
          // Sort results by totalScore (highest to lowest)
          const sortedResults = [...data].sort(
            (a, b) => b.totalScore - a.totalScore
          );
          setResults(sortedResults);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Error fetching hackathon results:", err);
        showError(
          "Results Error",
          "Failed to load hackathon results. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [hackathonId, showError]);

  if (loading) {
    return <div className="flex justify-center py-8">Loading results...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Hackathon Results</h2>

      {results.length === 0 ? (
        <p className="text-gray-500">
          No results available for this hackathon yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Placement</th>
                <th className="py-3 px-4 text-left">Team</th>
                <th className="py-3 px-4 text-left">Team Lead</th>
                <th className="py-3 px-4 text-left">Members</th>
                <th className="py-3 px-4 text-left">Score</th>
                <th className="py-3 px-4 text-left">Award</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full 
                        ${
                          result.placement === 1
                            ? "bg-yellow-100 text-yellow-800"
                            : result.placement === 2
                            ? "bg-gray-100 text-gray-800"
                            : result.placement === 3
                            ? "bg-orange-100 text-orange-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {result.placement}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium">{result.team.name}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-3 rounded-full bg-gray-200 overflow-hidden">
                        {result.team.teamLeader.avatarUrl && (
                          <img
                            src={result.team.teamLeader.avatarUrl}
                            alt={`${result.team.teamLeader.firstName} ${result.team.teamLeader.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div>{`${result.team.teamLeader.firstName} ${result.team.teamLeader.lastName}`}</div>
                        <div className="text-sm text-gray-500">
                          {result.team.teamLeader.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {result.team.teamMembers.length ? (
                      <div className="flex flex-col space-y-1">
                        {result.team.teamMembers.map((member) => (
                          <div key={member.id} className="text-sm">
                            {`${member.user.firstName} ${member.user.lastName}`}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">
                        No additional members
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 font-semibold">
                    {result.totalScore}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {result.award}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
