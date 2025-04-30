"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "@/hooks/useTranslations";

export default function ResourceManagementButton({
  hackathonId,
}: {
  hackathonId: string;
}) {
  const router = useRouter();
  const t = useTranslations("hackathonManagement");

  const navigateToResourceManagement = () => {
    router.push(
      `/organizer-hackathon-management/${hackathonId}/resource-management`
    );
  };

  return (
    <button
      onClick={navigateToResourceManagement}
      className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-medium py-1.5 px-3 sm:py-2 sm:px-4 rounded-md transition-all duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800 shadow-sm"
      aria-label={t("resourceManagementAriaLabel")}
    >
      {t("resourceManagement")}
    </button>
  );
}
