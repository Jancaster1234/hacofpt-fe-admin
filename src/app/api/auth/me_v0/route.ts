// src/app/api/auth/me_v0/route.ts
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/jwt";
import { mockUsers } from "@/mocks/auth.mock";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    console.log("🔹 Incoming Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized", errorCode: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token", errorCode: "INVALID_TOKEN" },
        { status: 401 }
      );
    }

    const user = mockUsers.find((u) => u.id === payload.id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found", errorCode: "USER_NOT_FOUND" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", errorCode: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
