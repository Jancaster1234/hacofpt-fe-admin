// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { simulateLogin } from "@/mocks/auth.mock";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const response = simulateLogin(email, password);

    if (!response.refreshToken) {
      return NextResponse.json(
        { error: "Failed to generate refresh token" },
        { status: 500 }
      );
    }

    const res = NextResponse.json(response);
    res.cookies.set("refreshToken", response.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res;
  } catch (error) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
