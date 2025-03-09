// src/app/api/auth/logout_v0/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Token required", errorCode: "TOKEN_REQUIRED" },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", errorCode: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
