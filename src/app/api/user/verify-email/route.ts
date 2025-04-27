// src/app/api/user/verify-email/route.ts
import { NextResponse } from "next/server";

interface VerifyEmailRequest {
    email: string;
    otp: string;
}

export async function POST(req: Request) {
    try {
        // Kiểm tra token từ header
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Unauthorized", errorCode: "UNAUTHORIZED" },
                { status: 401 }
            );
        }

        // Lấy token từ header
        const token = authHeader.split(" ")[1];

        // Parse request body
        const body: VerifyEmailRequest = await req.json();

        // Validate input
        if (!body.email || !body.otp) {
            return NextResponse.json(
                { error: "Email and OTP are required", errorCode: "INVALID_INPUT" },
                { status: 400 }
            );
        }

        if (body.otp.length !== 6) {
            return NextResponse.json(
                { error: "OTP must be 6 digits", errorCode: "INVALID_OTP" },
                { status: 400 }
            );
        }

        // Gọi API backend thực
        const backendResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/identity-service/api/v1/users/verify-email`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: {
                        email: body.email,
                        otp: body.otp
                    }
                }),
            }
        );

        // Kiểm tra response từ backend
        if (!backendResponse.ok) {
            const errorData = await backendResponse.json();
            return NextResponse.json(
                {
                    error: errorData,
                },
                { status: backendResponse.status }
            );
        }

        const data = await backendResponse.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            {
                error: "Error verifying email: " + error,
                errorCode: "SERVER_ERROR",
            },
            { status: 500 }
        );
    }
} 