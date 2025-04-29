// src/app/[locale]/(protected)/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { useTranslations } from "@/hooks/useTranslations";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";

export default function DashboardHome() {
  const { user } = useAuth();
  const t = useTranslations("dashboard.home");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
        <LoadingSpinner size="lg" showText={true} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-10 transition-all duration-300">
        <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white transition-colors">
              {t("welcomeTitle")}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300 text-base md:text-lg transition-colors">
              {t("welcomeMessage", {
                name: user ? `${user.lastName} ${user.firstName}` : t("guest"),
              })}
            </p>
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border-l-4 border-blue-500 dark:border-blue-400 transition-colors">
              <p className="text-blue-700 dark:text-blue-300">
                {t("dashboardTip")}
              </p>
            </div>
          </div>

          <div className="w-32 h-32 md:w-40 md:h-40 relative">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 dark:from-blue-600 dark:to-purple-700 p-1 transition-colors">
              <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden transition-colors">
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.username || t("userAvatar")}
                    fill
                    sizes="(max-width: 768px) 128px, 160px"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-5xl md:text-6xl font-bold text-blue-500 dark:text-blue-400 transition-colors">
                    {user ? user.firstName?.charAt(0) : "G"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">
                {t(`card${item}Title`)}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t(`card${item}Description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
