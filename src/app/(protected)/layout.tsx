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
import { Providers } from "./providers";
import { WebSocketProvider } from '@/contexts/WebSocketContext';
import { Toaster } from "sonner";

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

  const sidebarWidth = isMobileOpen ? 0 : isExpanded || isHovered ? 290 : 90;

  return (
    <WebSocketProvider>
      <Providers>
        <div className="min-h-screen xl:flex">
          {/* Sidebar and Backdrop */}
          <AppSidebar />
          <Backdrop />
          {/* Main Content Area */}
          <div
            className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
          >
            {/* Header */}
            <AppHeader />
            {/* Page Content */}
            <div
              className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6"
              style={{
                width: `calc(100vw - ${sidebarWidth}px - 1rem )`, // 3rem = padding (p-6 ~ 1.5rem each side)
                maxWidth: "1536px", // or whatever your --breakpoint-2xl is
              }}
            >
              {children}
            </div>
            <Toaster position="top-center" richColors />

          </div>
        </div>
      </Providers>
    </WebSocketProvider>

  );
}
