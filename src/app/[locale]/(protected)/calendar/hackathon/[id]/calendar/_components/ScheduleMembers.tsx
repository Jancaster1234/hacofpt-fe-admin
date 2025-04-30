// src/app/[locale]/(protected)/calendar/hackathon/[id]/calendar/_components/ScheduleMembers.tsx
"use client";
import React, { useEffect, useState } from "react";
import { User } from "@/types/entities/user";
import Image from "next/image";
import { useTranslations } from "@/hooks/useTranslations";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface ScheduleMembersProps {
  isOpen: boolean;
  onClose: () => void;
  members: User[];
  scheduleName: string;
}

const ScheduleMembers: React.FC<ScheduleMembersProps> = ({
  isOpen,
  onClose,
  members,
  scheduleName,
}) => {
  const t = useTranslations("scheduleMembers");
  const [isMounted, setIsMounted] = useState(false);

  // Handle animation and mounting
  useEffect(() => {
    setIsMounted(isOpen);
  }, [isOpen]);

  if (!isOpen && !isMounted) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isMounted ? "opacity-100" : "opacity-0"
      }`}
      onClick={() => setIsMounted(false)}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg w-full max-w-[90%] sm:max-w-md p-4 sm:p-6 transform transition-all duration-300 ${
          isMounted ? "translate-y-0" : "translate-y-8"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white/90">
            {scheduleName} - {t("teamMembers")}
          </h3>
          <button
            onClick={() => {
              setIsMounted(false);
              setTimeout(onClose, 300);
            }}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label={t("close")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="max-h-60 sm:max-h-96 overflow-y-auto custom-scrollbar">
          {members.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              {t("noMembers")}
            </p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {members.map((member) => (
                <li key={member.id} className="py-2 sm:py-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {member.avatarUrl ? (
                      <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden">
                        <Image
                          src={member.avatarUrl}
                          alt={`${member.firstName}'s ${t("avatar")}`}
                          fill
                          sizes="(max-width: 640px) 32px, 40px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                        {member.firstName?.charAt(0) || "U"}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white/90 text-sm sm:text-base">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {member.email}
                      </p>
                      {member.userRoles && member.userRoles.length > 0 && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {t(
                            member.userRoles[0].role.name
                              .replace("_", "")
                              .toLowerCase()
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setIsMounted(false);
              setTimeout(onClose, 300);
            }}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-white/90 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:focus:ring-gray-500"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleMembers;
