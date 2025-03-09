// src/context/AuthProvider.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { useRouter } from "next/navigation";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { checkUser, user, loading } = useAuth();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    console.log("🔹 AuthProvider: Checking user authentication...");
    checkUser().finally(() => setIsAuthChecked(true)); // Ensure auth check completes
  }, []);

  useEffect(() => {
    if (isAuthChecked && !loading && !user) {
      console.warn("🔹 User not authenticated. Redirecting to /signin...");
      router.push("/signin");
    }
  }, [user, loading, router, isAuthChecked]);

  if (!isAuthChecked || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    ); // Show loader
  }

  return <>{children}</>;
}
