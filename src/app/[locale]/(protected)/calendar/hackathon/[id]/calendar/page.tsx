// src/app/[locale]/(protected)/calendar/hackathon/[id]/calendar/page.tsx
"use client";

import React from "react";
import Calendar from "./_components/Calendar";
import { useParams } from "next/navigation";

export default function HackathonCalendarPage() {
  const params = useParams();
  const hackathonId = Array.isArray(params.id) ? params.id[0] : params.id;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto">
        <Calendar hackathonId={hackathonId} />
      </div>
    </div>
  );
}
