"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth_v0";
import { useRouter } from "next/navigation";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { checkUser, user, loading } = useAuth();
  useEffect(() => {
    console.log("🔹 AuthProvider: Initializing auth check");
    checkUser(); // No need to check accessToken separately
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      // ✅ Redirect only when not loading and user is null
      console.warn("🔹 User not authenticated. Redirecting to /signin...");
      router.push("/signin");
    }
  }, [user, loading, router]);

  return <>{children}</>;
}
