// src/app/[locale]/(protected)/organizer-hackathon-management/[id]/resource-management/_components/JudgesList.tsx
import { TeamRoundJudge } from "@/types/entities/teamRoundJudge";
import { useTranslations } from "@/hooks/useTranslations";
import Image from "next/image";

interface JudgesListProps {
  judges: TeamRoundJudge[];
}

export function JudgesList({ judges }: JudgesListProps) {
  const t = useTranslations("judges");

  if (judges.length === 0) {
    return (
      <div className="mt-3 mb-4 transition-colors duration-200">
        <h5 className="font-medium text-sm border-b pb-1 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700">
          {t("judgesTitle")}
        </h5>
        <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-2">
          {t("noJudgesAssigned")}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-3 mb-4 transition-colors duration-200">
      <h5 className="font-medium text-sm border-b pb-1 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700">
        {t("judgesTitle")}
      </h5>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
        {judges.map((judge) => (
          <div
            key={judge.id}
            className="p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 flex items-center transition-all duration-200 hover:shadow-md"
          >
            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-xs rounded-full mr-2">
              {judge.judge.firstName?.[0]}
              {judge.judge.lastName?.[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {judge.judge.firstName} {judge.judge.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {judge.judge.email}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
