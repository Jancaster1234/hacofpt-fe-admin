// src/context/AuthProvider.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { useRouter, usePathname } from "next/navigation";
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { checkUser, user, loading } = useAuth();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const authCheckRef = useRef(false);

  // Determine if we're on an auth page (signin, signup, etc.)
  const isAuthPage =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname.includes("/forgot-password") ||
    pathname.includes("/reset-password");

  useEffect(() => {
    console.log("🔹 AuthProvider: Checking user authentication...");

    // Check if this is a locale change
    const isLocaleChange = sessionStorage.getItem("localeChange") === "true";

    if (isLocaleChange) {
      // Clear the flag
      sessionStorage.removeItem("localeChange");
      console.log("🔹 Skipping auth check during locale change");
      setIsAuthChecked(true);
    } else if (!authCheckRef.current) {
      // Normal behavior - check user authentication - but only once
      authCheckRef.current = true;
      checkUser().finally(() => setIsAuthChecked(true));
    }
  }, []);

  useEffect(() => {
    if (isAuthChecked && !loading) {
      if (!user && !isAuthPage) {
        // Not authenticated and not on an auth page, redirect to signin
        console.warn("🔹 User not authenticated. Redirecting to /signin...");
        router.push("/signin");
      } else if (user && isAuthPage) {
        // Already authenticated but on an auth page, redirect to dashboard
        console.log(
          "🔹 User already authenticated. Redirecting to dashboard..."
        );
        router.push("/");
      }
    }
  }, [user, loading, router, isAuthChecked, isAuthPage, pathname]);

  if (!isAuthChecked || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // If on auth page but not authenticated, or authenticated and not on auth page, render children
  return <>{children}</>;
}
