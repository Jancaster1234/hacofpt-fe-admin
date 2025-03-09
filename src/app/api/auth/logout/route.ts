// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { simulateLogout } from "@/mocks/auth.mock";

export async function POST() {
  simulateLogout();
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set("refreshToken", "", { expires: new Date(0), path: "/" });
  return res;
}
