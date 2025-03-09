// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { mockUsers, mockAccessToken } from "@/mocks/auth.mock";

export async function GET(req: Request) {
  // Extract Authorization header
  const authHeader = req.headers.get("Authorization");

  // Validate token
  if (!authHeader || authHeader !== `Bearer ${mockAccessToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Return mock user data
  return NextResponse.json(mockUsers);
}
