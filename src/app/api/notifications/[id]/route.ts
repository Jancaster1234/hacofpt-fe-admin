// src/app/api/notifications/[id]/route.ts
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
    data: Notification;
}

// GET /api/v1/notifications/[id] - Lấy chi tiết một thông báo
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
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
            `${process.env.NEXT_PUBLIC_API_URL}/communication-service/api/v1/notifications/${params.id}`,
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

        // Return the notification data
        return NextResponse.json(backendData.data);
    } catch (error) {
        return NextResponse.json(
            {
                error: "Error fetching notification: " + error,
                errorCode: "SERVER_ERROR",
            },
            { status: 500 }
        );
    }
}

// POST /api/v1/notifications/[id] - Cập nhật một thông báo
export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
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
            `${process.env.NEXT_PUBLIC_API_URL}/communication-service/api/v1/notifications/${params.id}`,
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
                error: "Error updating notification: " + error,
                errorCode: "SERVER_ERROR",
            },
            { status: 500 }
        );
    }
}

// DELETE /api/v1/notifications/[id] - Xóa một thông báo
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
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
            `${process.env.NEXT_PUBLIC_API_URL}/communication-service/api/v1/notifications/${params.id}`,
            {
                method: "DELETE",
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

        // Return success response
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            {
                error: "Error deleting notification: " + error,
                errorCode: "SERVER_ERROR",
            },
            { status: 500 }
        );
    }
} 