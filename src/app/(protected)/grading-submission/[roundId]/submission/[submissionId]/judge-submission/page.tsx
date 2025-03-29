// src/app/(protected)/grading-submission/[roundId]/submission/[submissionId]/judge-submission/page.tsx
"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth_v0";

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-900">
        This is the Dashboard Home Page
      </h1>
      <p className="mt-2 text-gray-600">
        Welcome back, {user ? `${user.lastName} ${user.firstName}` : "Guest"}!.
      </p>
    </div>
  );
}
