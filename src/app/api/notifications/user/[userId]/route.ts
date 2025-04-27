// src/app/api/notifications/user/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Unauthorized", errorCode: "UNAUTHORIZED" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/communication-service/api/v1/notifications/user/${params.userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { error: { message: error.message || "Failed to fetch notifications" } },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: { message: "Internal server error" } },
            { status: 500 }
        );
    }
} 