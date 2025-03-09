// src/app/hackathon/[id]/board/_components/RewardListTab.tsx
"use client";

// Mock Data
const mockFinalScores = [
  { team: "Team Alpha", score: 85 },
  { team: "Team Beta", score: 78 },
  { team: "Team Gamma", score: 72 },
];

export default function RewardListTab() {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">Reward Recipient List</h2>
      <ul className="list-disc ml-6">
        {mockFinalScores.map((team, index) => (
          <li key={index}>
            🏆 {team.team}: {team.score} points
          </li>
        ))}
      </ul>
    </div>
  );
}
