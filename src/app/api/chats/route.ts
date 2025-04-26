// src/app/api/chats/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }

        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/communication-service/api/v1/conversations/users/${userId}`;

        const backendResponse = await fetch(backendUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authHeader,
            },
        });

        if (!backendResponse.ok) {
            const errorText = await backendResponse.text();
            return NextResponse.json(
                { error: errorText || "Backend error" },
                { status: backendResponse.status }
            );
        }

        const data = await backendResponse.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
} 