// src/app/[locale]/hackathon/_components/HackathonList.tsx
"use client";

import HackathonCard from "@/components/HackathonCard";
import { Hackathon } from "@/types/entities/hackathon";
import { useTranslations } from "@/hooks/useTranslations";

type HackathonListProps = {
  hackathons: Hackathon[];
};

export default function HackathonList({ hackathons }: HackathonListProps) {
  const t = useTranslations("hackathon");

  if (hackathons.length === 0) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-600 dark:text-gray-300 transition-colors duration-300">
        <p>{t("noHackathonsFound")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300">
      {hackathons.map((hackathon) => (
        <HackathonCard key={hackathon.id} hackathon={hackathon} />
      ))}
    </div>
  );
}
