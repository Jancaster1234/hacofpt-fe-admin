// src/app/(protected)/layout.tsx
"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  useEffect(() => {
    if (!loading && !user) {
      console.warn("🔹 User not authenticated. Redirecting to /signin...");
      router.push("/signin");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    ); // Show a loading state while checking auth
  }

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar user={user} />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader user={user} />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
