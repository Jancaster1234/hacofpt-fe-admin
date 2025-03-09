// src/app/api/auth/login_v0/route.ts
import { NextResponse } from "next/server";
import { signToken } from "@/utils/jwt";
import { mockUsers } from "@/mocks/auth.mock";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Find user in mock database (password validation is skipped for mock data)
    const user = mockUsers.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials", errorCode: "INVALID_CREDENTIALS" },
        { status: 401 }
      );
    }
    // Generate JWT token
    const accessToken = signToken(
      { id: user.id, email: user.email, role: user.role },
      "10h" // Set an expiration time
    );
    return NextResponse.json({ accessToken, user });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong", errorCode: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
