import { NextResponse } from "next/server";

interface AddEmailRequest {
    email: string;
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
        const body: AddEmailRequest = await req.json();

        // Validate email
        if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
            return NextResponse.json(
                { error: "Invalid email format", errorCode: "INVALID_EMAIL" },
                { status: 400 }
            );
        }

        // Gọi API backend thực
        const backendResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/identity-service/api/v1/users/add-email`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data: { email: body.email } }),
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
                error: "Error adding email: " + error,
                errorCode: "SERVER_ERROR",
            },
            { status: 500 }
        );
    }
} 