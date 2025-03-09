// src/app/api/auth/refresh_v0/route.ts
import { NextResponse } from "next/server";
import { verifyToken, signToken } from "@/utils/jwt";
import { mockUsers } from "@/mocks/auth.mock";

export async function POST(req: Request) {
  try {
    const { accessToken } = await req.json();

    // Verify the expired token (ignore expiration)
    const payload = verifyToken(accessToken, { ignoreExpiration: true });

    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token", errorCode: "INVALID_TOKEN" },
        { status: 401 }
      );
    }

    // Find user from token payload
    const user = mockUsers.find((u) => u.id === payload.id);

    if (!user) {
      return NextResponse.json(
        { error: "User not found", errorCode: "USER_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Generate new access token
    const newAccessToken = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({ accessToken: newAccessToken, user });
  } catch (error) {
    return NextResponse.json(
      { error: "Session expired", errorCode: "SESSION_EXPIRED" },
      { status: 401 }
    );
  }
}
