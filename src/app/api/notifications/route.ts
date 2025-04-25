// src/app/api/notifications/route.ts
import { NextResponse } from "next/server";

// Define notification types
interface Notification {
    id: string;
    content: string;
    metadata: string;
    createdAt: string;
    sender: {
        id: string;
        name: string;
        avatarUrl: string;
    };
    isRead?: boolean;
}

interface Response {
    code: number;
    message: string;
    data: Notification[];
}

// GET /api/v1/notifications - Lấy danh sách thông báo
export async function GET(req: Request) {
    try {
        // Check authorization header
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Unauthorized", errorCode: "UNAUTHORIZED" },
                { status: 401 }
            );
        }

        // Get token from header
        const token = authHeader.split(" ")[1];

        // Call backend API
        const backendResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/communication-service/api/v1/notifications`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Check backend response
        if (!backendResponse.ok) {
            const errorData = await backendResponse.json();
            return NextResponse.json(
                {
                    error: errorData,
                },
                { status: backendResponse.status }
            );
        }

        // Parse data from backend
        const backendData: Response = await backendResponse.json();

        // Return the notifications data
        return NextResponse.json(backendData.data);
    } catch (error) {
        return NextResponse.json(
            {
                error: "Error fetching notifications: " + error,
                errorCode: "SERVER_ERROR",
            },
            { status: 500 }
        );
    }
}

// POST /api/v1/notifications - Tạo thông báo mới
export async function POST(req: Request) {
    try {
        // Check authorization header
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Unauthorized", errorCode: "UNAUTHORIZED" },
                { status: 401 }
            );
        }

        // Get token from header
        const token = authHeader.split(" ")[1];

        // Get request body
        const body = await req.json();

        // Call backend API
        const backendResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/communication-service/api/v1/notifications`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );

        // Check backend response
        if (!backendResponse.ok) {
            const errorData = await backendResponse.json();
            return NextResponse.json(
                {
                    error: errorData,
                },
                { status: backendResponse.status }
            );
        }

        // Parse and return the response
        const responseData = await backendResponse.json();
        return NextResponse.json(responseData);
    } catch (error) {
        return NextResponse.json(
            {
                error: "Error creating notification: " + error,
                errorCode: "SERVER_ERROR",
            },
            { status: 500 }
        );
    }
} 