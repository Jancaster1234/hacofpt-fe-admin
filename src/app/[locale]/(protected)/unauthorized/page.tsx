// src/app/[locale]/(protected)/unauthorized/page.tsx
"use client";

import { useTranslations } from "@/hooks/useTranslations";
import Link from "next/link";

export default function UnauthorizedPage() {
  const t = useTranslations("common");

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-lg">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
          {t("unauthorized.title") || "Unauthorized Access"}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {t("unauthorized.message") ||
            "You don't have permission to view this page. Please contact an administrator if you believe this is an error."}
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          {t("unauthorized.backToHome") || "Back to Home"}
        </Link>
      </div>
    </div>
  );
}
