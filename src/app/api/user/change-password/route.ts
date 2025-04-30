// src/app/api/user/change-password/route.ts
import { NextResponse } from "next/server";

interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export async function POST(request: Request) {
    try {
        // Kiểm tra token từ header
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Unauthorized", errorCode: "UNAUTHORIZED" },
                { status: 401 }
            );
        }

        // Lấy token từ header
        const token = authHeader.split(" ")[1];

        const body = await request.json();
        const { currentPassword, newPassword, confirmPassword } = body as ChangePasswordRequest;

        // Validate request body
        if (!currentPassword || !newPassword || !confirmPassword) {
            return NextResponse.json(
                { error: "Missing required fields", errorCode: "INVALID_REQUEST" },
                { status: 400 }
            );
        }

        if (newPassword.length < 3) {
            return NextResponse.json(
                { error: "Password must have at least 3 characters", errorCode: "INVALID_PASSWORD" },
                { status: 400 }
            );
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json(
                { error: "New password and confirm password do not match", errorCode: "PASSWORD_MISMATCH" },
                { status: 400 }
            );
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/identity-service/api/v1/users/change-password`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        currentPassword,
                        newPassword,
                        confirmPassword
                    }
                }),
            }
        );

        const data = await response.json();
        console.log('Backend response:', { status: response.status, data });

        if (!response.ok) {
            return NextResponse.json(
                {
                    error: data.error || data.message || 'Failed to change password',
                    errorCode: data.errorCode || 'UNKNOWN_ERROR'
                },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Change password error:', error);
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message, errorCode: 'INTERNAL_SERVER_ERROR' },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to change password', errorCode: 'INTERNAL_SERVER_ERROR' },
            { status: 500 }
        );
    }
} 