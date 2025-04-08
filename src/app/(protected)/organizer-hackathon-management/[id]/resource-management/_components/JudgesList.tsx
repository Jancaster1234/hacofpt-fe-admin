// src/app/(protected)/organizer-hackathon-management/[id]/resource-management/_components/JudgesList.tsx
import { TeamRoundJudge } from "@/types/entities/teamRoundJudge";

interface JudgesListProps {
  judges: TeamRoundJudge[];
}

export function JudgesList({ judges }: JudgesListProps) {
  if (judges.length === 0) {
    return (
      <div className="mt-3 mb-4">
        <h5 className="font-medium text-sm border-b pb-1">Judges</h5>
        <p className="text-sm text-gray-500 italic mt-2">
          No judges assigned yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 mb-4">
      <h5 className="font-medium text-sm border-b pb-1">Judges</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        {judges.map((judge) => (
          <div
            key={judge.id}
            className="p-2 bg-gray-50 rounded border border-gray-200 flex items-center"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-gray-300 text-xs rounded-full mr-2">
              {judge.judge.firstName?.[0]}
              {judge.judge.lastName?.[0]}
            </div>
            <div>
              <p className="text-sm font-medium">
                {judge.judge.firstName} {judge.judge.lastName}
              </p>
              <p className="text-xs text-gray-500">{judge.judge.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
