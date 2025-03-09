// src/app/hackathon/[id]/board/_components/ResultTab.tsx
"use client";
import { useState, useEffect } from "react";
// Mock API function (replace with real API call)
const fetchResultsForRound = async (round: string) => {
  // Mock scores per round
  const mockResults = {
    "Round 1": [
      { criteria: "Innovation", score: 9, max: 10 },
      { criteria: "Feasibility", score: 8, max: 10 },
      { criteria: "Impact", score: 7, max: 10 },
    ],
    "Round 2": [
      { criteria: "User Experience", score: 8, max: 10 },
      { criteria: "Technical Complexity", score: 7, max: 10 },
      { criteria: "Presentation", score: 9, max: 10 },
    ],
    "Round 3": [
      { criteria: "Completeness", score: 8, max: 10 },
      { criteria: "Scalability", score: 8, max: 10 },
      { criteria: "Alignment with Theme", score: 7, max: 10 },
    ],
  };

  return mockResults[round] || [];
};

export default function ResultTab({ round }: { round: string }) {
  const [results, setResults] = useState<any[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const loadResults = async () => {
      const data = await fetchResultsForRound(round);
      setResults(data);
      setTotalScore(data.reduce((sum, item) => sum + item.score, 0));
    };

    loadResults();
  }, [round]);

  return (
    <div>
      <h2 className="text-lg font-semibold">Mark Criteria:</h2>

      <ul className="mt-3 space-y-2">
        {results.map((result, index) => (
          <li key={index} className="border-b pb-2">
            <span className="font-semibold">{result.criteria}:</span>{" "}
            {result.score}/{result.max}
          </li>
        ))}
      </ul>

      <p className="mt-4 font-bold text-lg">
        Total Score for {round}: {totalScore}/30
      </p>
    </div>
  );
}
