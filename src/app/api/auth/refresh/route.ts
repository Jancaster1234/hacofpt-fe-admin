// src/app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { simulateTokenRefresh } from "@/mocks/auth.mock";

export async function POST() {
  try {
    const { accessToken } = simulateTokenRefresh();
    return NextResponse.json({ accessToken });
  } catch (error) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }
}
