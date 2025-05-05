// src/app/[locale]/(protected)/grading-submission/_components/HackathonCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Hackathon } from "@/types/entities/hackathon";
import { useTranslations } from "@/hooks/useTranslations";

type HackathonCardProps = {
  hackathon: Hackathon;
};

export default function HackathonCard({ hackathon }: HackathonCardProps) {
  const t = useTranslations("hackathonCard");

  // Format date function to convert from "2025-05-06 09:23:00.000000" to "May 6, 2025"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Link
      href={`/grading-submission/${hackathon.id}`}
      className="block bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700
       rounded-lg overflow-hidden transition-all duration-300 hover:scale-105
       hover:shadow-lg dark:hover:shadow-gray-600"
    >
      <div className="relative w-full h-36 sm:h-48">
        <Image
          src={hackathon.bannerImageUrl}
          alt={hackathon.title}
          fill
          className="object-cover rounded-t-lg"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        />
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
          {hackathon.title}
        </h3>

        <div className="mt-2 space-y-1">
          <div className="flex items-center text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium mr-2">{t("enrollment")}:</span>
            <span>
              {formatDate(hackathon.enrollStartDate)} -{" "}
              {formatDate(hackathon.enrollEndDate)}
            </span>
          </div>

          <div className="flex items-center text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium mr-2">{t("event")}:</span>
            <span>
              {formatDate(hackathon.startDate)} -{" "}
              {formatDate(hackathon.endDate)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
